/** 1×1칸 컨베이어의 외형과 벨트 애니메이션. 운반함의 이동 계산은 simulation.ts가 담당한다. */
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { rotations, worldPosition } from "../simulation";
import type { Cell, Direction } from "../simulation";

// 부모에서 받는 설정. ?가 붙은 speed와 paused는 생략할 수 있으며 아래에서 기본값을 정한다.
type ConveyorBeltProps = {
  cell: Cell;
  direction: Direction;
  speed?: number;
  paused?: boolean;
};

// slat은 벨트 표면을 이루는 작은 판이다. 20개의 판을 두 직선과 두 반원으로 된 경로에 놓는다.
const SLATS = 20;
const RADIUS = 0.068;
const STRAIGHT = 0.8;
// 반원의 길이는 πr, 한 바퀴 길이는 위·아래 직선 길이 + 앞·뒤 반원 길이다.
const ARC = Math.PI * RADIUS;
const LOOP = 2 * STRAIGHT + 2 * ARC;

// 각 판의 위치와 기울기를 계산한다. 위쪽 → 앞 롤러 → 아래쪽 → 뒤 롤러 순서로 순환한다.
// 좌표는 벨트 내부 기준이다. 전체 벨트의 위치와 방향은 최상위 group에서 한 번에 적용한다.
const poseSlats = (group: Group, distance: number) => {
  group.children.forEach((slat, i) => {
    // 판마다 같은 간격을 더하고, 나머지 연산(%)으로 경로 끝을 넘으면 처음으로 돌아오게 한다.
    const t = (distance + i * LOOP / SLATS) % LOOP;
    let z: number;
    let y: number;
    let angle: number;
    // ① 위쪽 직선: 높이를 유지하면서 기본 진행 방향인 -Z로 이동한다.
    if (t < STRAIGHT) {
      z = 0.4 - t; y = 0.3 + RADIUS; angle = 0;
    // ② 앞쪽 반원: 호의 길이 ÷ 반지름으로 회전각을 구하고 sin/cos로 원 위의 위치를 구한다.
    } else if (t < STRAIGHT + ARC) {
      const a = (t - STRAIGHT) / RADIUS;
      z = -0.4 - RADIUS * Math.sin(a); y = 0.3 + RADIUS * Math.cos(a); angle = -a;
    // ③ 아래쪽 직선: 판이 뒤집힌 채 +Z 방향으로 돌아온다.
    } else if (t < 2 * STRAIGHT + ARC) {
      z = -0.4 + t - STRAIGHT - ARC; y = 0.3 - RADIUS; angle = -Math.PI;
    // ④ 뒤쪽 반원: 다시 위로 올라가 처음 구간에 이어진다.
    } else {
      const a = (t - 2 * STRAIGHT - ARC) / RADIUS;
      z = 0.4 + RADIUS * Math.sin(a); y = 0.3 - RADIUS * Math.cos(a); angle = -Math.PI - a;
    }
    slat.position.set(0, y, z);
    slat.rotation.x = angle;
  });
};

const ConveyorBelt = ({ cell, direction, speed = 1, paused = false }: ConveyorBeltProps) => {
  // group ref로 실제 3D 객체에 접근하고, travel ref로 누적 이동 거리를 보관한다.
  const slats = useRef<Group>(null);
  const rollers = useRef<Group>(null);
  const travel = useRef(0);
  const [x, z] = worldPosition(cell);
  // 프레임 수가 아닌 경과 시간(초)에 속도를 곱해 화면 주사율이 달라도 같은 속도로 움직인다.
  useFrame((_, delta) => {
    // 이동 거리가 계속 커지지 않도록 1,000바퀴마다 줄인다. 판의 순환 주기는 유지된다.
    if (!paused) travel.current = (travel.current + delta * speed) % (LOOP * 1000);
    if (slats.current) poseSlats(slats.current, travel.current);
    // 미끄러짐 없이 구르는 원의 회전각 = 이동 거리 / 반지름(라디안).
    rollers.current?.children.forEach((roller) => { roller.rotation.x = -travel.current / RADIUS; });
  });

  return (
    // group의 이동·회전은 내부의 프레임, 롤러, 판에 함께 적용된다.
    <group position={[x, 0, z]} rotation={[0, rotations[direction], 0]} name={`conveyor-${cell.join("-")}`}>
      {/* 좌우 두 위치를 순회해 금속 프레임을 만들고, 각 프레임 아래에 앞뒤 다리를 붙인다. */}
      {[-0.37, 0.37].map((side) => (
        <group key={side}>
          <mesh position={[side, 0.21, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.09, 0.16, 0.98]} />
            <meshStandardMaterial color="#8199a8" metalness={0.65} roughness={0.32} />
          </mesh>
          {[-0.32, 0.32].map((end) => (
            <mesh key={end} position={[side, 0.08, end]} castShadow>
              <boxGeometry args={[0.08, 0.16, 0.09]} />
              <meshStandardMaterial color="#364b58" metalness={0.5} roughness={0.45} />
            </mesh>
          ))}
        </group>
      ))}
      {/* 판 아래를 채우는 몸체. boxGeometry의 args는 [가로(X), 높이(Y), 깊이(Z)]다. */}
      <mesh position={[0, 0.3, 0]} receiveShadow>
        <boxGeometry args={[0.68, 0.13, 0.8]} />
        <meshStandardMaterial color="#172c35" roughness={0.9} />
      </mesh>
      {/* 원통은 기본적으로 Y축을 따라 길어지므로 Z축으로 90도 돌려 X축 방향의 롤러로 만든다. */}
      <group ref={rollers}>
        {[-0.4, 0.4].map((end) => (
          <group key={end} position={[0, 0.3, end]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[RADIUS, RADIUS, 0.76, 16]} />
              <meshStandardMaterial color="#647e8b" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* 롤러 양 끝의 노란 표시가 함께 돌아가므로 회전하는 모습을 알아볼 수 있다. */}
            {[-0.385, 0.385].map((side) => (
              <mesh key={side} position={[side, 0, 0]}>
                <boxGeometry args={[0.006, 0.1, 0.018]} />
                <meshStandardMaterial color="#f3c46c" />
              </mesh>
            ))}
          </group>
        ))}
      </group>
      {/* 판을 생성한 뒤 매 프레임 poseSlats가 배치한다. 5번째마다 색을 달리해 이동을 보여 준다. */}
      <group ref={slats}>
        {Array.from({ length: SLATS }, (_, i) => (
          <mesh key={i} castShadow receiveShadow>
            <boxGeometry args={[0.68, 0.024, 0.085]} />
            <meshStandardMaterial color={i % 5 === 0 ? "#639a9c" : "#294b56"} roughness={0.75} />
          </mesh>
        ))}
      </group>
      {/* 가느다란 상자 두 개를 비스듬히 놓아 운반면 옆에 진행 방향 표시(∨)를 만든다. */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0.37 + side * 0.019, 0.295, -0.1]} rotation={[0, side * Math.PI / 4, 0]}>
          <boxGeometry args={[0.012, 0.008, 0.055]} />
          <meshStandardMaterial color="#f7cb72" />
        </mesh>
      ))}
    </group>
  );
};

export default ConveyorBelt;
