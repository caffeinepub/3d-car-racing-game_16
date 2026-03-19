import { memo } from "react";
import * as THREE from "three";

interface CarMeshProps {
  color: string;
  isPlayer?: boolean;
}

export const CarMesh = memo(function CarMesh({
  color,
  isPlayer,
}: CarMeshProps) {
  const bodyColor = color;
  const darkColor = "#111118";
  const glassColor = "#223340";
  const lightColor = isPlayer ? "#ffffcc" : "#ffcccc";

  const wheelPositions: [number, number, number][] = [
    [-0.95, 0.28, 1.3],
    [0.95, 0.28, 1.3],
    [-0.95, 0.28, -1.3],
    [0.95, 0.28, -1.3],
  ];

  return (
    <group>
      {/* Main body */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[1.85, 0.55, 4.0]} />
        <meshLambertMaterial color={bodyColor} />
      </mesh>

      {/* Cabin */}
      <mesh position={[0, 0.88, -0.2]} castShadow>
        <boxGeometry args={[1.4, 0.42, 2.2]} />
        <meshLambertMaterial color={bodyColor} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 0.88, 0.9]}>
        <boxGeometry args={[1.35, 0.35, 0.08]} />
        <meshLambertMaterial color={glassColor} />
      </mesh>

      {/* Rear window */}
      <mesh position={[0, 0.88, -1.3]}>
        <boxGeometry args={[1.35, 0.32, 0.08]} />
        <meshLambertMaterial color={glassColor} />
      </mesh>

      {/* Spoiler */}
      <mesh position={[0, 0.9, -2.1]} castShadow>
        <boxGeometry args={[1.7, 0.08, 0.45]} />
        <meshLambertMaterial color={darkColor} />
      </mesh>
      {/* Spoiler stands */}
      <mesh position={[-0.6, 0.72, -2.1]}>
        <boxGeometry args={[0.08, 0.35, 0.08]} />
        <meshLambertMaterial color={darkColor} />
      </mesh>
      <mesh position={[0.6, 0.72, -2.1]}>
        <boxGeometry args={[0.08, 0.35, 0.08]} />
        <meshLambertMaterial color={darkColor} />
      </mesh>

      {/* Headlights */}
      <mesh position={[0.52, 0.4, 2.01]}>
        <boxGeometry args={[0.32, 0.14, 0.04]} />
        <meshBasicMaterial color={lightColor} />
      </mesh>
      <mesh position={[-0.52, 0.4, 2.01]}>
        <boxGeometry args={[0.32, 0.14, 0.04]} />
        <meshBasicMaterial color={lightColor} />
      </mesh>

      {/* Tail lights */}
      <mesh position={[0.55, 0.4, -2.01]}>
        <boxGeometry args={[0.28, 0.12, 0.04]} />
        <meshBasicMaterial color="#ff2200" />
      </mesh>
      <mesh position={[-0.55, 0.4, -2.01]}>
        <boxGeometry args={[0.28, 0.12, 0.04]} />
        <meshBasicMaterial color="#ff2200" />
      </mesh>

      {/* Wheels */}
      {wheelPositions.map(([wx, wy, wz]) => (
        <group key={`w-${wx}-${wz}`} position={[wx, wy, wz]}>
          {/* Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.32, 0.32, 0.26, 14]} />
            <meshLambertMaterial color="#151515" />
          </mesh>
          {/* Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.27, 8]} />
            <meshLambertMaterial color="#888899" />
          </mesh>
        </group>
      ))}

      {/* Neon underglow */}
      <pointLight
        position={[0, 0.05, 0]}
        intensity={isPlayer ? 3 : 1.5}
        color={color}
        distance={6}
        decay={2}
      />
    </group>
  );
});
