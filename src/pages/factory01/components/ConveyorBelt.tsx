import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { rotations, worldPosition } from "../simulation";
import type { Cell, Direction } from "../simulation";

type ConveyorBeltProps = {
  cell: Cell;
  direction: Direction;
  speed?: number;
  paused?: boolean;
};

const SLATS = 20;
const RADIUS = 0.068;
const STRAIGHT = 0.8;
const ARC = Math.PI * RADIUS;
const LOOP = 2 * STRAIGHT + 2 * ARC;

// A closed loop: upper run, front roller, lower run, rear roller.
const poseSlats = (group: Group, distance: number) => {
  group.children.forEach((slat, i) => {
    const t = (distance + i * LOOP / SLATS) % LOOP;
    let z: number;
    let y: number;
    let angle: number;
    if (t < STRAIGHT) {
      z = 0.4 - t; y = 0.3 + RADIUS; angle = 0;
    } else if (t < STRAIGHT + ARC) {
      const a = (t - STRAIGHT) / RADIUS;
      z = -0.4 - RADIUS * Math.sin(a); y = 0.3 + RADIUS * Math.cos(a); angle = -a;
    } else if (t < 2 * STRAIGHT + ARC) {
      z = -0.4 + t - STRAIGHT - ARC; y = 0.3 - RADIUS; angle = -Math.PI;
    } else {
      const a = (t - 2 * STRAIGHT - ARC) / RADIUS;
      z = 0.4 + RADIUS * Math.sin(a); y = 0.3 - RADIUS * Math.cos(a); angle = -Math.PI - a;
    }
    slat.position.set(0, y, z);
    slat.rotation.x = angle;
  });
};

const ConveyorBelt = ({ cell, direction, speed = 1, paused = false }: ConveyorBeltProps) => {
  const slats = useRef<Group>(null);
  const rollers = useRef<Group>(null);
  const travel = useRef(0);
  const [x, z] = worldPosition(cell);
  useFrame((_, delta) => {
    if (!paused) travel.current = (travel.current + delta * speed) % (LOOP * 1000);
    if (slats.current) poseSlats(slats.current, travel.current);
    rollers.current?.children.forEach((roller) => { roller.rotation.x = -travel.current / RADIUS; });
  });

  return (
    <group position={[x, 0, z]} rotation={[0, rotations[direction], 0]} name={`conveyor-${cell.join("-")}`}>
      {[-0.37, 0.37].map((side) => (
        <group key={side}>
          <mesh position={[side, 0.21, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.09, 0.16, 0.98]} />
            <meshStandardMaterial color="#8199a8" metalness={0.65} roughness={0.32} />
          </mesh>
          {[-0.32, 0.32].map((end) => (
            <mesh key={end} position={[side, 0.08, end]} castShadow>
              <boxGeometry args={[0.08, 0.16, 0.09]} />
              <meshStandardMaterial color="#364b58" metalness={0.5} roughness={0.45} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 0.3, 0]} receiveShadow>
        <boxGeometry args={[0.68, 0.13, 0.8]} />
        <meshStandardMaterial color="#172c35" roughness={0.9} />
      </mesh>
      <group ref={rollers}>
        {[-0.4, 0.4].map((end) => (
          <group key={end} position={[0, 0.3, end]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[RADIUS, RADIUS, 0.76, 16]} />
              <meshStandardMaterial color="#647e8b" metalness={0.7} roughness={0.3} />
            </mesh>
            {[-0.385, 0.385].map((side) => (
              <mesh key={side} position={[side, 0, 0]}>
                <boxGeometry args={[0.006, 0.1, 0.018]} />
                <meshStandardMaterial color="#f3c46c" />
              </mesh>
            ))}
          </group>
        ))}
      </group>
      <group ref={slats}>
        {Array.from({ length: SLATS }, (_, i) => (
          <mesh key={i} castShadow receiveShadow>
            <boxGeometry args={[0.68, 0.024, 0.085]} />
            <meshStandardMaterial color={i % 5 === 0 ? "#639a9c" : "#294b56"} roughness={0.75} />
          </mesh>
        ))}
      </group>
      {/* Flat direction chevron sits beside the carrying surface, below the cargo. */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0.37 + side * 0.019, 0.295, -0.1]} rotation={[0, side * Math.PI / 4, 0]}>
          <boxGeometry args={[0.012, 0.008, 0.055]} />
          <meshStandardMaterial color="#f7cb72" />
        </mesh>
      ))}
    </group>
  );
};

export default ConveyorBelt;
