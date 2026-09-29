import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

type TransportProps = { paused: boolean };

const Transport = ({ paused }: TransportProps) => {
  const vehicle = useRef<Group>(null);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    if (paused || !vehicle.current) return;
    // delta는 지난 프레임부터 흐른 초. React 상태 대신 ref를 갱신한다.
    elapsed.current += delta;
    const speed = 1; // m/s
    const distance = 5; // Z=-2.5에서 Z=2.5까지 5m
    const travel = (elapsed.current * speed) % (distance * 2);
    // 앞 5m는 전진, 다음 5m는 복귀. 긴 프레임에서도 경로를 벗어나지 않는다.
    vehicle.current.position.z = -2.5 + (travel <= distance ? travel : distance * 2 - travel);
  });

  return (
    <group ref={vehicle} name="transport" position={[0, 0, -2.5]}>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.8, 0.4, 0.9]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>
      {/* 단순한 적재함. 장비나 실제 공정과 연동하지 않는 이동 예제다. */}
      <mesh position={[0, 0.65, 0]}>
        <boxGeometry args={[0.55, 0.5, 0.6]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
    </group>
  );
};

export default Transport;
