import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { CarMesh } from "./CarMesh";
import {
  BUILDINGS,
  WAYPOINTS,
  createCurbGeometry,
  createTrackGeometry,
  findNearestWaypoint,
} from "./trackData";

export interface HudData {
  speed: number;
  lap: number;
  position: number;
  time: number;
}

export interface Controls {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

interface PlayerState {
  x: number;
  z: number;
  angle: number;
  speed: number;
  lapCount: number;
  raceTime: number;
  halfwayPassed: boolean;
  raceFinished: boolean;
}

interface AiState {
  x: number;
  z: number;
  angle: number;
  speed: number;
  waypointIndex: number;
  lapCount: number;
  halfwayPassed: boolean;
}

const AI_BASE_SPEEDS = { easy: 14, medium: 22, hard: 31 };

interface GameSceneProps {
  difficulty: "easy" | "medium" | "hard";
  onUpdate: (data: HudData) => void;
  onRaceFinish: (timeMs: number) => void;
  controlsRef: React.MutableRefObject<Controls>;
  paused: boolean;
  totalLaps: number;
}

export function GameScene({
  difficulty,
  onUpdate,
  onRaceFinish,
  controlsRef,
  paused,
  totalLaps,
}: GameSceneProps) {
  const playerMeshRef = useRef<THREE.Group>(null);
  const aiMesh0 = useRef<THREE.Group>(null);
  const aiMesh1 = useRef<THREE.Group>(null);
  const aiMesh2 = useRef<THREE.Group>(null);

  const playerState = useRef<PlayerState>({
    x: 0,
    z: -80,
    angle: Math.PI / 2, // facing east (+x)
    speed: 0,
    lapCount: 0,
    raceTime: 0,
    halfwayPassed: false,
    raceFinished: false,
  });

  const aiBase = AI_BASE_SPEEDS[difficulty];
  const aiStates = useRef<AiState[]>([
    {
      x: 6,
      z: -76,
      angle: Math.PI / 2,
      speed: aiBase * (0.92 + Math.random() * 0.16),
      waypointIndex: 0,
      lapCount: 0,
      halfwayPassed: false,
    },
    {
      x: -6,
      z: -76,
      angle: Math.PI / 2,
      speed: aiBase * (0.92 + Math.random() * 0.16),
      waypointIndex: 0,
      lapCount: 0,
      halfwayPassed: false,
    },
    {
      x: 0,
      z: -68,
      angle: Math.PI / 2,
      speed: aiBase * (0.92 + Math.random() * 0.16),
      waypointIndex: 0,
      lapCount: 0,
      halfwayPassed: false,
    },
  ]);

  const hudTimer = useRef(0);
  const lookAtVec = useRef(new THREE.Vector3());

  const trackGeo = useMemo(() => createTrackGeometry(), []);
  const curbGeoLeft = useMemo(() => createCurbGeometry("left"), []);
  const curbGeoRight = useMemo(() => createCurbGeometry("right"), []);

  useFrame((state, delta) => {
    if (paused) return;
    const p = playerState.current;
    if (p.raceFinished) return;

    const dt = Math.min(delta, 0.05);
    const controls = controlsRef.current;
    const maxSpeed = 40;

    // --- Player physics ---
    if (controls.up) {
      p.speed = Math.min(p.speed + 28 * dt, maxSpeed);
    } else if (controls.down) {
      p.speed = Math.max(p.speed - 38 * dt, 0);
    } else {
      p.speed = Math.max(p.speed - 9 * dt, 0);
    }

    const turnSensitivity = 1.7 * (0.4 + 0.6 * (p.speed / maxSpeed));
    if (controls.left && p.speed > 0.5) {
      p.angle -= turnSensitivity * dt;
    }
    if (controls.right && p.speed > 0.5) {
      p.angle += turnSensitivity * dt;
    }

    p.x += Math.sin(p.angle) * p.speed * dt;
    p.z += Math.cos(p.angle) * p.speed * dt;
    p.raceTime += dt;

    if (playerMeshRef.current) {
      playerMeshRef.current.position.set(p.x, 0, p.z);
      playerMeshRef.current.rotation.y = -p.angle;
    }

    // --- Lap detection ---
    if (p.z > 50) p.halfwayPassed = true;
    if (p.halfwayPassed && p.z < -84 && Math.abs(p.x) < 22) {
      p.halfwayPassed = false;
      p.lapCount++;
      if (p.lapCount >= totalLaps) {
        p.raceFinished = true;
        onRaceFinish(Math.round(p.raceTime * 1000));
      }
    }

    // --- AI cars ---
    const aiMeshes = [aiMesh0.current, aiMesh1.current, aiMesh2.current];
    aiStates.current.forEach((ai, idx) => {
      const mesh = aiMeshes[idx];
      const wp = WAYPOINTS[ai.waypointIndex];
      const dx = wp.x - ai.x;
      const dz = wp.z - ai.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 5) {
        ai.waypointIndex = (ai.waypointIndex + 1) % WAYPOINTS.length;
      } else {
        const targetAngle = Math.atan2(dx, dz);
        let diff = targetAngle - ai.angle;
        while (diff > Math.PI) diff -= 2 * Math.PI;
        while (diff < -Math.PI) diff += 2 * Math.PI;
        ai.angle += diff * Math.min(3.5 * dt, 1);
      }

      ai.x += Math.sin(ai.angle) * ai.speed * dt;
      ai.z += Math.cos(ai.angle) * ai.speed * dt;

      // AI lap tracking
      if (ai.z > 50) ai.halfwayPassed = true;
      if (ai.halfwayPassed && ai.z < -84 && Math.abs(ai.x) < 25) {
        ai.halfwayPassed = false;
        ai.lapCount++;
      }

      if (mesh) {
        mesh.position.set(ai.x, 0, ai.z);
        mesh.rotation.y = -ai.angle;
      }
    });

    // --- Camera ---
    const camDist = 16;
    const camHeight = 7;
    const targetCamX = p.x - Math.sin(p.angle) * camDist;
    const targetCamZ = p.z - Math.cos(p.angle) * camDist;
    state.camera.position.x += (targetCamX - state.camera.position.x) * 0.09;
    state.camera.position.y += (camHeight - state.camera.position.y) * 0.09;
    state.camera.position.z += (targetCamZ - state.camera.position.z) * 0.09;
    lookAtVec.current.set(p.x, 1, p.z);
    state.camera.lookAt(lookAtVec.current);

    // --- HUD updates (10fps) ---
    hudTimer.current += dt;
    if (hudTimer.current > 0.1) {
      hudTimer.current = 0;
      const playerProgress =
        p.lapCount * WAYPOINTS.length + findNearestWaypoint(p.x, p.z);
      const aiProgresses = aiStates.current.map(
        (ai) => ai.lapCount * WAYPOINTS.length + ai.waypointIndex,
      );
      const position =
        1 + aiProgresses.filter((ap) => ap > playerProgress).length;
      onUpdate({
        speed: Math.round(p.speed * 4.5),
        lap: Math.min(p.lapCount + 1, totalLaps),
        position,
        time: p.raceTime,
      });
    }
  });

  const AI_COLORS = ["#9B5CFF", "#FF8A3D", "#19E6FF"];

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.25} color="#1a2040" />
      <directionalLight
        position={[60, 100, 40]}
        intensity={0.7}
        color="#aac4ff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <fog attach="fog" args={["#080c14", 100, 320]} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshLambertMaterial color="#080c0a" />
      </mesh>

      {/* Infield */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[160, 190]} />
        <meshLambertMaterial color="#0a120a" />
      </mesh>

      {/* Track surface */}
      <mesh geometry={trackGeo} receiveShadow>
        <meshLambertMaterial color="#1c1c2a" side={THREE.DoubleSide} />
      </mesh>

      {/* Track center line */}
      <mesh geometry={trackGeo} position={[0, 0.015, 0]}>
        <meshLambertMaterial
          color="#2a2a40"
          side={THREE.DoubleSide}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Curbs */}
      <mesh geometry={curbGeoLeft}>
        <meshLambertMaterial color="#cc2222" side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={curbGeoRight}>
        <meshLambertMaterial color="#cc2222" side={THREE.DoubleSide} />
      </mesh>

      {/* Start/finish line */}
      <mesh position={[0, 0.03, -91]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 3]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Start/finish neon light */}
      <pointLight
        position={[0, 4, -91]}
        intensity={5}
        color="#19E6FF"
        distance={20}
      />

      {/* Buildings */}
      {BUILDINGS.map((b, i) => (
        <group key={`bld-${b.x}-${b.z}`} position={[b.x, 0, b.z]}>
          <mesh position={[0, b.h / 2, 0]} castShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshLambertMaterial color={b.color} />
          </mesh>
          {/* Building windows */}
          <pointLight
            position={[0, b.h * 0.7, 0]}
            intensity={0.8}
            color={i % 2 === 0 ? "#2255ff" : "#ff44aa"}
            distance={b.h * 1.5}
          />
        </group>
      ))}

      {/* Player car */}
      <group ref={playerMeshRef} position={[0, 0, -80]}>
        <CarMesh color="#19E6FF" isPlayer />
      </group>

      {/* AI cars */}
      <group ref={aiMesh0} position={[6, 0, -76]}>
        <CarMesh color={AI_COLORS[0]} />
      </group>
      <group ref={aiMesh1} position={[-6, 0, -76]}>
        <CarMesh color={AI_COLORS[1]} />
      </group>
      <group ref={aiMesh2} position={[0, 0, -68]}>
        <CarMesh color={AI_COLORS[2]} />
      </group>
    </>
  );
}
