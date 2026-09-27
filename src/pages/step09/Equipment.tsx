import { statusColors, type EquipmentStatus } from "./status";

type EquipmentProps = {
  name: string;
  status: EquipmentStatus;
  selected: boolean;
  onSelect: () => void;
  position: [number, number, number];
};

export default function Equipment({ name, position, selected, onSelect, status }: EquipmentProps) {
  return (
    // group의 원점은 장비 바닥이다. 부품 위치는 이 원점을 기준으로 한다.
    <group name={name} position={position} onClick={(event) => {
      // 부품 클릭이 group으로 올라온다. 뒤쪽 바닥에는 전달하지 않는다.
      event.stopPropagation();
      onSelect();
    }}>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[1.4, 1.6, 1.2]} />
        <meshStandardMaterial color={selected ? "#60a5fa" : "#cbd5e1"} roughness={0.5} metalness={0.15} />
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
      {/* 본체의 파란색은 선택, 상단 표시등 색상은 장비 상태다. */}
      <mesh name={`${name}-status`} position={[0, 1.75, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color={statusColors[status]} emissive={statusColors[status]} emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}
