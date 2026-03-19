import * as THREE from "three";

export interface Waypoint {
  x: number;
  z: number;
}

// Oval circuit, 18 waypoints, clockwise from top center
export const WAYPOINTS: Waypoint[] = [
  { x: 0, z: -90 }, // 0 - start/finish
  { x: 28, z: -86 }, // 1
  { x: 55, z: -72 }, // 2
  { x: 76, z: -50 }, // 3
  { x: 88, z: -22 }, // 4
  { x: 88, z: 10 }, // 5
  { x: 76, z: 40 }, // 6
  { x: 55, z: 63 }, // 7
  { x: 28, z: 80 }, // 8
  { x: 0, z: 88 }, // 9  - halfway
  { x: -28, z: 80 }, // 10
  { x: -55, z: 63 }, // 11
  { x: -76, z: 40 }, // 12
  { x: -88, z: 10 }, // 13
  { x: -88, z: -22 }, // 14
  { x: -76, z: -50 }, // 15
  { x: -55, z: -72 }, // 16
  { x: -28, z: -86 }, // 17
];

export const ROAD_HALF_WIDTH = 10;

export function findNearestWaypoint(x: number, z: number): number {
  let minDist = Number.POSITIVE_INFINITY;
  let nearest = 0;
  for (let i = 0; i < WAYPOINTS.length; i++) {
    const dx = WAYPOINTS[i].x - x;
    const dz = WAYPOINTS[i].z - z;
    const dist = dx * dx + dz * dz;
    if (dist < minDist) {
      minDist = dist;
      nearest = i;
    }
  }
  return nearest;
}

export function createTrackGeometry(): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(
    WAYPOINTS.map((w) => new THREE.Vector3(w.x, 0, w.z)),
    true,
  );

  const N = 360;
  const halfW = ROAD_HALF_WIDTH;
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const pos = curve.getPoint(t);
    const tan = curve.getTangent(t).normalize();
    // Right-perpendicular in XZ plane
    const perpX = tan.z;
    const perpZ = -tan.x;

    positions.push(
      pos.x - perpX * halfW,
      0.02,
      pos.z - perpZ * halfW,
      pos.x + perpX * halfW,
      0.02,
      pos.z + perpZ * halfW,
    );
    normals.push(0, 1, 0, 0, 1, 0);
    uvs.push(i * 0.4, 0, i * 0.4, 1);

    if (i < N) {
      const a = i * 2;
      const b = i * 2 + 1;
      const c = (i + 1) * 2;
      const d = (i + 1) * 2 + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  return geo;
}

export function createCurbGeometry(
  side: "left" | "right",
): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(
    WAYPOINTS.map((w) => new THREE.Vector3(w.x, 0, w.z)),
    true,
  );

  const N = 360;
  const halfW = ROAD_HALF_WIDTH;
  const curbW = 1.5;
  const offset = side === "left" ? -1 : 1;
  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const pos = curve.getPoint(t);
    const tan = curve.getTangent(t).normalize();
    const perpX = tan.z * offset;
    const perpZ = -tan.x * offset;
    const innerEdge = halfW;
    const outerEdge = halfW + curbW;

    positions.push(
      pos.x + perpX * innerEdge,
      0.04,
      pos.z + perpZ * innerEdge,
      pos.x + perpX * outerEdge,
      0.04,
      pos.z + perpZ * outerEdge,
    );
    normals.push(0, 1, 0, 0, 1, 0);

    if (i < N) {
      const a = i * 2;
      const b = i * 2 + 1;
      const c = (i + 1) * 2;
      const d = (i + 1) * 2 + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setIndex(indices);
  return geo;
}

// Scattered buildings around the track
export const BUILDINGS = [
  { x: 120, z: 0, w: 16, h: 40, d: 16, color: "#1a1a3e" },
  { x: 130, z: 30, w: 10, h: 28, d: 10, color: "#0a1520" },
  { x: -120, z: 0, w: 20, h: 50, d: 20, color: "#1e0a2e" },
  { x: -130, z: -30, w: 12, h: 22, d: 12, color: "#0f0a20" },
  { x: 0, z: 140, w: 14, h: 35, d: 14, color: "#0a1a1e" },
  { x: 30, z: 145, w: 8, h: 18, d: 8, color: "#101530" },
  { x: 0, z: -140, w: 18, h: 42, d: 18, color: "#1a0a1e" },
  { x: -25, z: -145, w: 10, h: 24, d: 10, color: "#0f1528" },
  { x: 110, z: -90, w: 12, h: 30, d: 12, color: "#0a1a3e" },
  { x: -110, z: 90, w: 14, h: 32, d: 14, color: "#1e1a0a" },
  { x: 115, z: 90, w: 9, h: 22, d: 9, color: "#0a1820" },
  { x: -115, z: -90, w: 11, h: 26, d: 11, color: "#180a28" },
];
