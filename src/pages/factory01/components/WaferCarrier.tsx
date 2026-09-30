/**
 * 웨이퍼 운반함의 모양만 만든다. 위치 이동은 부모인 MovingCarrier가 담당한다.
 * 모든 위치는 이 group 기준의 상대 좌표다. 바닥면이 Y=0이므로 부모 높이에 맞춰 올려놓을 수 있다.
 * mesh는 물체, boxGeometry는 상자 형상, meshStandardMaterial은 빛에 반응하는 표면 재질이다.
 * metalness는 금속 느낌, roughness는 표면 거칠기이며, 각각 0~1 범위로 조절한다.
 * castShadow는 그림자를 만드는 설정이고 receiveShadow는 다른 물체의 그림자를 받는 설정이다.
 */
const WaferCarrier = () => {
  return (
    <group name="wafer-carrier">
      {/* 받침대: 높이가 0.09인 상자의 중심을 0.045에 두어 아랫면을 Y=0에 맞춘다. */}
      <mesh position={[0, 0.045, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.09, 0.5]} />
        <meshStandardMaterial color="#e8b458" metalness={0.35} roughness={0.35} />
      </mesh>
      {/* 본체: 밝은색 상자로 운반함의 큰 형태를 만든다. args는 [가로, 높이, 깊이]다. */}
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#e8f3f4" metalness={0.2} roughness={0.28} />
      </mesh>
      {/* 앞면 패널: 본체의 +Z 면 바로 앞에 얇고 어두운 상자를 덧댄다. */}
      <mesh position={[0, 0.29, 0.205]}>
        <boxGeometry args={[0.3, 0.27, 0.014]} />
        <meshStandardMaterial color="#244858" metalness={0.45} roughness={0.2} />
      </mesh>
      {/* 패널의 가로줄 5개. 인덱스 i에 따라 높이를 0.045씩 올려 일정 간격으로 배치한다. */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[0, 0.19 + i * 0.045, 0.215]}>
          <boxGeometry args={[0.25, 0.009, 0.008]} />
          <meshStandardMaterial color="#83c3ce" metalness={0.7} roughness={0.25} />
        </mesh>
      ))}
      {/* 윗면 손잡이도 작은 상자로 표현한다. 부모 group이 움직이면 모든 부품이 함께 이동한다. */}
      <mesh position={[0, 0.505, 0]} castShadow>
        <boxGeometry args={[0.2, 0.05, 0.1]} />
        <meshStandardMaterial color="#e8b458" metalness={0.35} roughness={0.35} />
      </mesh>
    </group>
  );
};

export default WaferCarrier;
