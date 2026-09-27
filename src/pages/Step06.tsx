import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Equipment from "./step06/Equipment";

type EquipmentData = {
  id: string;
  name: string;
  position: [number, number, number];
};

const equipmentData: EquipmentData[] = [
  { id: "etch-01", name: "식각 장비 01", position: [-2, 0, -2] },
  { id: "etch-02", name: "식각 장비 02", position: [-2, 0, 2] },
  { id: "dep-01", name: "증착 장비 01", position: [2, 0, -2] },
  { id: "dep-02", name: "증착 장비 02", position: [2, 0, 2] },
];

export default function Step06() {
  return (
    <div className="scene orbit-scene" role="region" aria-label="장비 배치와 통로">
      <title>3D FAB · 06 · 장비 배치와 통로</title>
      <p className="scene-hint">배치 데이터의 position을 바꿔 장비를 이동해 보세요.</p>
      <Canvas camera={{ position: [11, 9, 11], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 2]} intensity={3} />
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
        </mesh>
        <gridHelper args={[10, 10, "#64748b", "#94a3b8"]} position={[0, 0.01, 0]} />
        {/* 중앙 통로: 폭 2m. 장비는 양옆에 2대씩 놓는다. */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <planeGeometry args={[2, 8]} />
          <meshStandardMaterial color="#bfdbfe" />
        </mesh>
        {equipmentData.map((equipment) => (
          <Equipment key={equipment.id} name={equipment.name} position={equipment.position} />
        ))}
        <OrbitControls target={[0, 0, 0]} minDistance={2} maxDistance={25}
          maxPolarAngle={Math.PI / 2 - 0.05} screenSpacePanning={false} enableDamping={false} />
      </Canvas>
    </div>
  );
}
