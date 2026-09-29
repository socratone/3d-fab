const WaferCarrier = () => {
  return (
    <group name="wafer-carrier">
      <mesh position={[0, 0.045, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.09, 0.5]} />
        <meshStandardMaterial color="#e8b458" metalness={0.35} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#e8f3f4" metalness={0.2} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.29, 0.205]}>
        <boxGeometry args={[0.3, 0.27, 0.014]} />
        <meshStandardMaterial color="#244858" metalness={0.45} roughness={0.2} />
      </mesh>
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[0, 0.19 + i * 0.045, 0.215]}>
          <boxGeometry args={[0.25, 0.009, 0.008]} />
          <meshStandardMaterial color="#83c3ce" metalness={0.7} roughness={0.25} />
        </mesh>
      ))}
      <mesh position={[0, 0.505, 0]} castShadow>
        <boxGeometry args={[0.2, 0.05, 0.1]} />
        <meshStandardMaterial color="#e8b458" metalness={0.35} roughness={0.35} />
      </mesh>
    </group>
  );
};

export default WaferCarrier;
