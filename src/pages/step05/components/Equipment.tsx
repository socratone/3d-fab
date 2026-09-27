type EquipmentProps = {
  name: string;
  position: [number, number, number];
};

export default function Equipment({ name, position }: EquipmentProps) {
  return (
    // group의 원점은 장비 바닥이다. 부품 위치는 이 원점을 기준으로 한다.
    <group name={name} position={position}>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[1.4, 1.6, 1.2]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.5} metalness={0.15} />
      </mesh>
      {/* 문은 본체 앞쪽(+Z)에 얇은 박스로 붙인다. */}
      <mesh position={[0, 0.65, 0.63]}>
        <boxGeometry args={[1.05, 1.1, 0.06]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      <mesh position={[0, 1.35, 0.64]}>
        <boxGeometry args={[0.6, 0.22, 0.08]} />
        <meshStandardMaterial color="#38bdf8" />
      </mesh>
    </group>
  );
}
