import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function CameraControlsPage() {
  return (
    <div
      className="scene orbit-scene"
      role="region"
      aria-label="마우스로 둘러볼 수 있는 공장 장면"
    >
      <title>3D FAB · 03 · 마우스로 둘러보기</title>
      <p className="scene-hint">왼쪽 드래그: 회전 · 휠: 확대/축소 · 오른쪽 드래그: 이동</p>
      {/* Canvas가 장면, 카메라, 렌더러를 구성한다. 카메라는 원점을 바라본다. */}
      <Canvas camera={{ position: [8, 6, 8], fov: 50 }}>
        {/* 평면은 원래 XY 방향이다. X축으로 -90도 회전해 XZ 바닥으로 눕힌다. */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6, 6]} />
          <meshBasicMaterial color="#e2e8f0" />
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
          {/* 조명 없이 보이는 기본 재질. 선으로 표시해 박스 구조를 살펴본다. */}
          <meshBasicMaterial color="tomato" wireframe />
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
}
