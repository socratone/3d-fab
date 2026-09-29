import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

const LightingMaterialsPage = () => {
  return (
    <div
      className="relative min-h-0 flex-1"
      role="region"
      aria-label="마우스로 둘러볼 수 있는 공장 장면"
    >
      <title>3D FAB · 04 · 조명과 재질</title>
      <p className="pointer-events-none absolute inset-x-6 top-3 z-10 m-0 text-[13px] text-[#58677c]">조명에 따른 면의 밝기 차이를 살펴보세요. 마우스 조작은 3단계와 같아요.</p>
      {/* Canvas가 장면, 카메라, 렌더러를 구성한다. 카메라는 원점을 바라본다. */}
      <Canvas camera={{ position: [8, 6, 8], fov: 50 }}>
        {/* 주변광은 전체를 은은하게, 방향광은 방향에 따라 면을 밝힌다. */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 2]} intensity={3} />
        {/* 평면은 원래 XY 방향이다. X축으로 -90도 회전해 XZ 바닥으로 눕힌다. */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6, 6]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
        </mesh>

        {/* 6m를 6칸으로 나누어 한 칸은 1m. 바닥과 겹쳐 깜빡이지 않게 살짝 올린다. */}
        <gridHelper
          args={[6, 6, "#64748b", "#94a3b8"]}
          position={[0, 0.01, 0]}
        />

        {/* mesh는 모양(geometry)과 표면(material)을 결합한 3D 물체다. */}
        {/* 위치는 중심 기준이다. 높이 1m인 박스의 중심을 0.5m 올려 바닥에 맞춘다. */}
        <mesh position={[0, 0.5, 0]}>
          {/* args는 박스의 가로, 높이, 깊이 순서다. */}
          <boxGeometry args={[1, 1, 1]} />
          {/* 표준 재질은 빛에 반응한다. roughness는 거칠기, metalness는 금속성이다. */}
          <meshStandardMaterial color="tomato" roughness={0.5} metalness={0.1} />
        </mesh>
        {/* 물체가 아니라 카메라를 움직인다. target은 회전의 중심이다. */}
        <OrbitControls
          target={[0, 0, 0]}
          minDistance={2}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2 - 0.05}
          screenSpacePanning={false}
          enableDamping={false}
        />
      </Canvas>
    </div>
  );
};

export default LightingMaterialsPage;
