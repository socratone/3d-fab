import { Canvas } from "@react-three/fiber";

export default function App() {
  return (
    <main>
      <header>
        <h1>3D FAB</h1>
        <p>01 · 첫 번째 박스</p>
      </header>

      <div
        className="scene"
        role="img"
        aria-label="비스듬히 바라본 파란색 정육면체 와이어프레임"
      >
        {/* Canvas가 장면, 카메라, 렌더러를 구성한다. 카메라는 원점을 바라본다. */}
        <Canvas camera={{ position: [3, 2, 4], fov: 45 }}>
          {/* mesh는 모양(geometry)과 표면(material)을 결합한 3D 물체다. */}
          <mesh>
            {/* args는 박스의 가로, 높이, 깊이 순서다. */}
            <boxGeometry args={[1, 1, 1]} />
            {/* 조명 없이 보이는 기본 재질. 선으로 표시해 박스 구조를 살펴본다. */}
            <meshBasicMaterial color="tomato" wireframe />
          </mesh>
        </Canvas>
      </div>
    </main>
  );
}
