import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Equipment from "./components/Equipment";

export default function EquipmentAssemblyPage() {
  return (
    <div className="scene orbit-scene" role="region" aria-label="장비 한 대 조립">
      <title>3D FAB · 05 · 장비 한 대 조립</title>
      <p className="scene-hint">본체·문·표시창을 하나의 group으로 묶었어요.</p>
      <Canvas camera={{ position: [8, 6, 8], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 2]} intensity={3} />
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6, 6]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
        </mesh>
        <gridHelper args={[6, 6, "#64748b", "#94a3b8"]} position={[0, 0.01, 0]} />
        <Equipment name="식각 장비 01" position={[0, 0, 0]} />
        <OrbitControls target={[0, 0, 0]} minDistance={2} maxDistance={25}
          maxPolarAngle={Math.PI / 2 - 0.05} screenSpacePanning={false} enableDamping={false} />
      </Canvas>
    </div>
  );
}
