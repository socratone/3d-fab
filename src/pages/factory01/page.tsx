/**
 * factory01의 진입점: 조작 버튼과 3D 장면을 하나의 페이지로 구성한다.
 * 읽는 순서: FactoryPage(전체 구성) → MovingCarrier(애니메이션) → simulation.ts(이동 규칙).
 * React Three Fiber는 JSX로 Three.js의 3D 객체를 만들고, drei는 카메라 조작 같은 도구를 제공한다.
 */
import { useLayoutEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Group } from "three";
import ConveyorBelt from "./components/ConveyorBelt";
import WaferCarrier from "./components/WaferCarrier";
import {
  advanceTransport,
  createTransport,
  demoBelts,
  demoLayout,
  GRID_SIZE,
  SPEED,
  transportPosition,
  worldPosition,
} from "./simulation";

// 화면이 세로로 길어지면 카메라의 줌을 줄여 공장 전체가 더 잘 보이게 한다.
const FitCamera = () => {
  const { camera, size } = useThree();
  // useThree는 Canvas 안에서 사용하는 훅이며, size는 Canvas의 화면상 크기다.
  // 화면이 그려지기 전에 줌을 보정하고, 창 크기가 바뀌면 다시 계산한다.
  useLayoutEffect(() => {
    camera.zoom = Math.min(1, size.width / size.height / 0.9);
    // 줌 값을 바꾼 뒤에는 3D 좌표를 화면에 투영하는 행렬도 갱신해야 한다.
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null; // 카메라 설정만 담당하므로 별도의 3D 물체는 만들지 않는다.
};

// 이동 규칙으로 계산한 위치를 실제 운반함의 3D group에 적용한다.
const MovingCarrier = ({
  paused,
  onDischarge,
}: {
  paused: boolean;
  onDischarge: () => void;
}) => {
  // ref는 렌더링 사이에 값을 보관한다. 매 프레임 바뀌어도 React 재렌더링을 일으키지 않는다.
  const group = useRef<Group>(null);
  const transport = useRef(createTransport([1, 1], demoLayout));
  // useFrame은 매 프레임 실행된다. delta는 이전 프레임 이후 흐른 시간(초)이다.
  // 첫 번째 인수인 렌더링 상태는 여기서 쓰지 않아 _라는 이름으로 받는다.
  useFrame((_, delta) => {
    const previous = transport.current.status;
    transport.current = advanceTransport(
      transport.current,
      delta,
      demoLayout,
      paused,
    );
    // ?.는 group이 아직 연결되지 않은 경우 호출을 건너뛴다. ...는 [x, y, z]를 펼친다.
    group.current?.position.set(
      ...transportPosition(transport.current, demoLayout),
    );
    // 배출 완료로 바뀌는 순간에만 부모에게 알린다. 이후 프레임마다 반복 통지하지 않는다.
    if (previous !== "discharged" && transport.current.status === "discharged")
      onDischarge();
  });
  return (
    <group
      ref={group}
      position={transportPosition(transport.current, demoLayout)}
    >
      <WaferCarrier />
    </group>
  );
};

// 격자 좌표의 바닥에 색 표시를 놓는다. 3D 위치 배열의 순서는 [X, Y(높이), Z]다.
const FloorMarker = ({
  cell,
  color,
}: {
  cell: readonly [number, number];
  color: string;
}) => {
  const [x, z] = worldPosition(cell);
  return (
    // 평면의 기본 방향은 XY이므로 X축으로 -90도 돌려 바닥(XZ)과 나란하게 둔다.
    // 바닥보다 조금 높여 겹친 표면이 깜빡이는 현상을 줄인다.
    <mesh
      position={[x, 0.013, z]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[0.88, 0.88]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
};

const FactoryPage = () => {
  // 버튼과 안내 문구에 영향을 주는 값은 state로 관리하여 변경 시 화면을 다시 그린다.
  const [paused, setPaused] = useState(false);
  const [discharged, setDischarged] = useState(false);
  // run은 실행 횟수이자 아래 3D group을 새로 생성하게 하는 key다.
  const [run, setRun] = useState(0);
  const status = paused ? "일시정지" : discharged ? "배출 완료" : "운반 중";

  const restart = () => {
    setPaused(false);
    setDischarged(false);
    // key가 달라지면 자식 컴포넌트가 다시 마운트되어 이동 상태와 벨트 회전 ref도 초기화된다.
    setRun((value) => value + 1);
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col" aria-label="공장 만들기">
      <title>3D FAB · 공장 만들기</title>
      {/* Canvas 밖의 일반 HTML 영역. className의 Tailwind 클래스가 배치·색·반응형 스타일을 정한다. */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#dce2eb] bg-white px-6 py-5 max-[601px]:px-4 max-[601px]:py-3.5">
        <div>
          <p className="mb-[5px] text-xs leading-[normal] font-[650] text-[#39736f]">
            작은 공장의 시작 · 01
          </p>
          <h2 className="text-[23px] font-bold tracking-[-0.7px]">
            컨베이어 라인
          </h2>
          <p className="mt-1.5 text-[13px] text-[#58677c]">
            한 칸씩 연결하고, 네 방향으로 운반합니다.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className={`inline-flex min-w-20 items-center text-[13px] ${paused ? "text-[#94671c]" : "text-[#286e62]"}`}
            role="status"
          >
            <span
              className={`mr-1.5 inline-block size-2 rounded-full ${paused ? "bg-[#c38c31]" : "bg-[#359781]"}`}
            />
            {status}
          </span>
          <button
            className="cursor-pointer rounded-[7px] border px-[13px] py-[9px] text-[13px] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#287f79] border-[#c5d3d8] bg-white text-[#244650] hover:bg-[#e8f2f0]"
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? "재개" : "일시정지"}
          </button>
          <button
            className="cursor-pointer rounded-[7px] border px-[13px] py-[9px] text-[13px] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#287f79] border-[#285b60] bg-[#285b60] text-white hover:bg-[#1c4549]"
            onClick={restart}
          >
            처음부터 재시작
          </button>
        </div>
      </div>
      <div className="relative min-h-[360px] flex-1">
        <div className="pointer-events-none absolute top-4 left-6 z-10 flex flex-wrap gap-2 max-[601px]:right-4 max-[601px]:left-4">
          <span className="rounded-[5px] border border-[#d5e0e3] bg-[#ffffffd9] px-[9px] py-[5px] text-xs leading-[normal] text-[#48616c]">
            8 × 8 격자
          </span>
          <span className="rounded-[5px] border border-[#d5e0e3] bg-[#ffffffd9] px-[9px] py-[5px] text-xs leading-[normal] text-[#48616c]">
            벨트 1 × 1 m
          </span>
          <span className="rounded-[5px] border border-[#d5e0e3] bg-[#ffffffd9] px-[9px] py-[5px] text-xs leading-[normal] text-[#48616c]">
            속도 1칸/초
          </span>
        </div>
        {/* Canvas 안의 JSX는 HTML 대신 3D 객체가 된다. fov는 카메라의 수직 시야각(도)이다. */}
        <Canvas shadows camera={{ position: [9, 10, 11], fov: 42 }}>
          <FitCamera />
          <color attach="background" args={["#edf3f4"]} />
          {/* 환경광은 전체를 밝히고, 방향광은 특정 방향에서 비추며 그림자를 만든다. */}
          <ambientLight intensity={0.9} />
          <directionalLight
            position={[2, 8, 5]}
            intensity={2.5}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-6}
            shadow-camera-right={6}
            shadow-camera-top={6}
            shadow-camera-bottom={-6}
            shadow-normalBias={0.025}
          />
          {/* mesh = 형상(geometry) + 표면 재질(material). 바닥 윗면이 Y=0이 되도록 배치한다. */}
          <mesh position={[0, -0.1, 0]} receiveShadow>
            <boxGeometry args={[GRID_SIZE, 0.2, GRID_SIZE]} />
            <meshStandardMaterial color="#dce7e9" roughness={0.9} />
          </mesh>
          {/* 8m 바닥을 8칸으로 나누므로 한 칸은 1m다. 시작은 초록, 배출 지점은 노랑이다. */}
          <gridHelper
            args={[GRID_SIZE, GRID_SIZE, "#adbec5", "#adbec5"]}
            position={[0, 0.006, 0]}
          />
          <FloorMarker cell={[1, 1]} color="#a6d7ce" />
          <FloorMarker cell={[2, 2]} color="#f0d49b" />
          {/* 배열의 벨트 정보를 각각 컴포넌트로 만든다. {...belt}는 cell과 direction을 전달한다. */}
          <group key={run}>
            {demoBelts.map((belt) => (
              <ConveyorBelt
                key={belt.cell.join(",")}
                {...belt}
                speed={SPEED}
                paused={paused}
              />
            ))}
            <MovingCarrier
              paused={paused}
              onDischarge={() => setDischarged(true)}
            />
          </group>
          {/* 원점을 중심으로 시점을 조작한다. 거리와 수직 회전각을 제한해 바닥 아래로 내려가지 않게 한다. */}
          <OrbitControls
            target={[0, 0, 0]}
            minDistance={5}
            maxDistance={20}
            maxPolarAngle={Math.PI / 2 - 0.08}
            screenSpacePanning={false}
            enableDamping={false}
          />
        </Canvas>
        {/* Canvas 위에 겹친 안내문. pointer-events-none으로 마우스 조작을 아래 Canvas에 전달한다. */}
        <div className="pointer-events-none absolute inset-x-6 bottom-[18px] flex flex-col gap-[5px] text-[13px] text-[#3b5661] max-[601px]:inset-x-4 max-[601px]:rounded-md max-[601px]:bg-[#edf3f4e8] max-[601px]:p-2.5">
          <strong>웨이퍼 운반함 · 단일 운반 데모</strong>
          <span>
            {discharged
              ? "운반함이 노란 바닥 칸에 도착했습니다. 재시작해서 다시 운반할 수 있어요."
              : "동 → 남 → 서 → 북 순서로 이동한 뒤, 노란 바닥 칸으로 내려옵니다."}
          </span>
          <small className="text-[11px] text-[#657d86]">
            드래그: 시점 회전 · 휠: 확대/축소 · 오른쪽 드래그: 화면 이동
          </small>
        </div>
      </div>
    </section>
  );
};

export default FactoryPage;
