import { useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Equipment from "./step08/Equipment";
import { statusLabels, statusColors, statuses, type EquipmentStatus } from "./step08/status";

type EquipmentData = {
  id: string;
  status: EquipmentStatus;
  name: string;
  position: [number, number, number];
};

const initialEquipment: EquipmentData[] = [
  { id: "etch-01", status: "running", name: "식각 장비 01", position: [-2, 0, -2] },
  { id: "etch-02", status: "idle", name: "식각 장비 02", position: [-2, 0, 2] },
  { id: "dep-01", status: "error", name: "증착 장비 01", position: [2, 0, -2] },
  { id: "dep-02", status: "running", name: "증착 장비 02", position: [2, 0, 2] },
];

export default function Step08() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [equipmentData, setEquipmentData] = useState(initialEquipment);
  const selected = equipmentData.find((equipment) => equipment.id === selectedId);

  function changeStatus(status: EquipmentStatus) {
    setEquipmentData((items) => items.map((item) =>
      item.id === selectedId ? { ...item, status } : item
    ));
  }
  return (
    <section className="lesson" aria-label="장비 상태">
      <title>3D FAB · 08 · 장비 상태</title>
      <div className="lesson-bar">
        <p aria-live="polite">{selected ? `선택: ${selected.name}` : "장비를 클릭해 선택하세요."}</p>
        <button onClick={() => setSelectedId(null)} disabled={!selected}>선택 해제</button>
        <div className="status-buttons" aria-label="선택 장비 상태 변경">
          {statuses.map((status) => (
            <button key={status} disabled={!selected}
              aria-pressed={selected?.status === status} onClick={() => changeStatus(status)}>
              <span className="status-dot" style={{ background: statusColors[status] }} />
              {statusLabels[status]}
            </button>
          ))}
        </div>
        <p aria-live="polite">{selected ? `상태: ${statusLabels[selected.status]}` : "표시등: 주황 대기 · 초록 가동 · 빨강 오류"}</p>
      </div>
      <div className="scene orbit-scene">
        <p className="scene-hint">장비 클릭: 선택 · 바닥/빈 공간 클릭: 해제 · 마우스 드래그: 시점 변경</p>
        <Canvas camera={{ position: [11, 9, 11], fov: 50 }} onPointerMissed={() => setSelectedId(null)}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 5, 2]} intensity={3} />
          <mesh onClick={() => setSelectedId(null)} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
          </mesh>
          <gridHelper args={[10, 10, "#64748b", "#94a3b8"]} position={[0, 0.01, 0]} />
          {/* 중앙 통로: 폭 2m. 장비는 양옆에 2대씩 놓는다. */}
          <mesh onClick={() => setSelectedId(null)} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
            <planeGeometry args={[2, 8]} />
            <meshStandardMaterial color="#bfdbfe" />
          </mesh>
          {equipmentData.map((equipment) => (
            <Equipment key={equipment.id} name={equipment.name} position={equipment.position}
              selected={selectedId === equipment.id} onSelect={() => setSelectedId(equipment.id)}
              status={equipment.status} />
          ))}
          <OrbitControls target={[0, 0, 0]} minDistance={2} maxDistance={25}
            maxPolarAngle={Math.PI / 2 - 0.05} screenSpacePanning={false} enableDamping={false} />
        </Canvas>
      </div>
    </section>
  );
}
