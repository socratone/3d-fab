import { useLayoutEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Group } from "three";
import ConveyorBelt from "./components/ConveyorBelt";
import WaferCarrier from "./components/WaferCarrier";
import { advanceTransport, createTransport, demoBelts, demoLayout, GRID_SIZE, SPEED, transportPosition, worldPosition } from "./simulation";

function FitCamera() {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    camera.zoom = Math.min(1, size.width / size.height / 0.9);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

function MovingCarrier({ paused, onDischarge }: { paused: boolean; onDischarge: () => void }) {
  const group = useRef<Group>(null);
  const transport = useRef(createTransport([1, 1], demoLayout));
  useFrame((_, delta) => {
    const previous = transport.current.status;
    transport.current = advanceTransport(transport.current, delta, demoLayout, paused);
    group.current?.position.set(...transportPosition(transport.current, demoLayout));
    if (previous !== "discharged" && transport.current.status === "discharged") onDischarge();
  });
  return <group ref={group} position={transportPosition(transport.current, demoLayout)}><WaferCarrier /></group>;
}

function FloorMarker({ cell, color }: { cell: readonly [number, number]; color: string }) {
  const [x, z] = worldPosition(cell);
  return (
    <mesh position={[x, 0.013, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[0.88, 0.88]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
}

export default function FactoryPage() {
  const [paused, setPaused] = useState(false);
  const [discharged, setDischarged] = useState(false);
  const [run, setRun] = useState(0);
  const status = paused ? "일시정지" : discharged ? "배출 완료" : "운반 중";

  function restart() {
    setPaused(false);
    setDischarged(false);
    setRun((value) => value + 1);
  }

  return (
    <section className="lesson factory" aria-label="공장 만들기">
      <title>3D FAB · 공장 만들기</title>
      <div className="factory-toolbar">
        <div>
          <p className="factory-eyebrow">작은 공장의 시작 · 01</p>
          <h2>컨베이어 라인</h2>
          <p className="factory-description">한 칸씩 연결하고, 네 방향으로 운반합니다.</p>
        </div>
        <div className="factory-actions">
          <span className={`factory-status${paused ? " is-paused" : ""}`} role="status">
            <span className="status-dot" />{status}
          </span>
          <button onClick={() => setPaused((value) => !value)}>{paused ? "재개" : "일시정지"}</button>
          <button className="factory-restart" onClick={restart}>처음부터 재시작</button>
        </div>
      </div>
      <div className="scene orbit-scene factory-scene">
        <div className="factory-legend">
          <span>8 × 8 격자</span><span>벨트 1 × 1 m</span><span>속도 1칸/초</span>
        </div>
        <Canvas shadows camera={{ position: [9, 10, 11], fov: 42 }}>
          <FitCamera />
          <color attach="background" args={["#edf3f4"]} />
          <ambientLight intensity={0.9} />
          <directionalLight position={[2, 8, 5]} intensity={2.5} castShadow
            shadow-mapSize={[2048, 2048]} shadow-camera-left={-6} shadow-camera-right={6}
            shadow-camera-top={6} shadow-camera-bottom={-6} shadow-normalBias={0.025} />
          <mesh position={[0, -0.1, 0]} receiveShadow>
            <boxGeometry args={[GRID_SIZE, 0.2, GRID_SIZE]} />
            <meshStandardMaterial color="#dce7e9" roughness={0.9} />
          </mesh>
          <gridHelper args={[GRID_SIZE, GRID_SIZE, "#adbec5", "#adbec5"]} position={[0, 0.006, 0]} />
          <FloorMarker cell={[1, 1]} color="#a6d7ce" />
          <FloorMarker cell={[2, 2]} color="#f0d49b" />
          <group key={run}>
            {demoBelts.map((belt) => <ConveyorBelt key={belt.cell.join(",")} {...belt} speed={SPEED} paused={paused} />)}
            <MovingCarrier paused={paused} onDischarge={() => setDischarged(true)} />
          </group>
          <OrbitControls target={[0, 0, 0]} minDistance={5} maxDistance={20}
            maxPolarAngle={Math.PI / 2 - 0.08} screenSpacePanning={false} enableDamping={false} />
        </Canvas>
        <div className="factory-caption">
          <strong>웨이퍼 운반함 · 단일 운반 데모</strong>
          <span>{discharged ? "운반함이 노란 바닥 칸에 도착했습니다. 재시작해서 다시 운반할 수 있어요." : "동 → 남 → 서 → 북 순서로 이동한 뒤, 노란 바닥 칸으로 내려옵니다."}</span>
          <small>드래그: 시점 회전 · 휠: 확대/축소 · 오른쪽 드래그: 화면 이동</small>
        </div>
      </div>
    </section>
  );
}
