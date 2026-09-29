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
    <section className="flex min-h-0 flex-1 flex-col" aria-label="공장 만들기">
      <title>3D FAB · 공장 만들기</title>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#dce2eb] bg-white px-6 py-5 max-[601px]:px-4 max-[601px]:py-3.5">
        <div>
          <p className="mb-[5px] text-xs leading-[normal] font-[650] text-[#39736f]">작은 공장의 시작 · 01</p>
          <h2 className="text-[23px] font-bold tracking-[-0.7px]">컨베이어 라인</h2>
          <p className="mt-1.5 text-[13px] text-[#58677c]">한 칸씩 연결하고, 네 방향으로 운반합니다.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className={`inline-flex min-w-20 items-center text-[13px] ${paused ? "text-[#94671c]" : "text-[#286e62]"}`} role="status">
            <span className={`mr-1.5 inline-block size-2 rounded-full ${paused ? "bg-[#c38c31]" : "bg-[#359781]"}`} />{status}
          </span>
          <button className="cursor-pointer rounded-[7px] border px-[13px] py-[9px] text-[13px] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#287f79] border-[#c5d3d8] bg-white text-[#244650] hover:bg-[#e8f2f0]" onClick={() => setPaused((value) => !value)}>{paused ? "재개" : "일시정지"}</button>
          <button className="cursor-pointer rounded-[7px] border px-[13px] py-[9px] text-[13px] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#287f79] border-[#285b60] bg-[#285b60] text-white hover:bg-[#1c4549]" onClick={restart}>처음부터 재시작</button>
        </div>
      </div>
      <div className="relative min-h-[360px] flex-1">
        <div className="pointer-events-none absolute top-4 left-6 z-10 flex flex-wrap gap-2 max-[601px]:right-4 max-[601px]:left-4">
          <span className="rounded-[5px] border border-[#d5e0e3] bg-[#ffffffd9] px-[9px] py-[5px] text-xs leading-[normal] text-[#48616c]">8 × 8 격자</span><span className="rounded-[5px] border border-[#d5e0e3] bg-[#ffffffd9] px-[9px] py-[5px] text-xs leading-[normal] text-[#48616c]">벨트 1 × 1 m</span><span className="rounded-[5px] border border-[#d5e0e3] bg-[#ffffffd9] px-[9px] py-[5px] text-xs leading-[normal] text-[#48616c]">속도 1칸/초</span>
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
        <div className="pointer-events-none absolute inset-x-6 bottom-[18px] flex flex-col gap-[5px] text-[13px] text-[#3b5661] max-[601px]:inset-x-4 max-[601px]:rounded-md max-[601px]:bg-[#edf3f4e8] max-[601px]:p-2.5">
          <strong>웨이퍼 운반함 · 단일 운반 데모</strong>
          <span>{discharged ? "운반함이 노란 바닥 칸에 도착했습니다. 재시작해서 다시 운반할 수 있어요." : "동 → 남 → 서 → 북 순서로 이동한 뒤, 노란 바닥 칸으로 내려옵니다."}</span>
          <small className="text-[11px] text-[#657d86]">드래그: 시점 회전 · 휠: 확대/축소 · 오른쪽 드래그: 화면 이동</small>
        </div>
      </div>
    </section>
  );
}
