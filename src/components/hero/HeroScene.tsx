import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

const COLOR_CYAN = new THREE.Color("#22D3EE");
const COLOR_VIOLET = new THREE.Color("#A78BFA");
const COLOR_PINK = new THREE.Color("#F472B6");

/**
 * Inbound particle stream: flows from the left edge toward the center gateway,
 * funnelling into a tight beam as particles approach x ≈ 0.
 */
function InboundFlow({
  count = 700,
  color,
}: {
  count?: number;
  color: THREE.Color;
}) {
  const ref = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.pow(Math.random(), 0.6) * 2.4;
      positions[i * 3 + 0] = -7 + Math.random() * 7;    // x: -7 → 0
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = Math.cos(angle) * radius;
      speeds[i] = 0.018 + Math.random() * 0.045;
    }
    return { positions, speeds };
  }, [count]);

  useFrame((_, delta) => {
    const pts = ref.current;
    if (!pts) return;
    const pos = pts.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;

    for (let i = 0; i < count; i++) {
      arr[i * 3] += speeds[i] * (delta * 60);

      // Funnel: squeeze y/z as x → 0
      const distToCenter = Math.abs(arr[i * 3]);
      const funnel = THREE.MathUtils.clamp(distToCenter / 6, 0.05, 1);
      arr[i * 3 + 1] *= 0.985 + (1 - funnel) * 0.005;
      arr[i * 3 + 2] *= 0.985 + (1 - funnel) * 0.005;

      // Recycle when reaching center
      if (arr[i * 3] > 0.4) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.pow(Math.random(), 0.6) * 2.4;
        arr[i * 3 + 0] = -7;
        arr[i * 3 + 1] = Math.sin(angle) * radius;
        arr[i * 3 + 2] = Math.cos(angle) * radius;
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color={color}
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Outbound particle stream: spawns at the center and fans out toward the right,
 * spreading into a wider cone as particles move away from the gateway.
 */
function OutboundFlow({
  count = 700,
  color,
}: {
  count?: number;
  color: THREE.Color;
}) {
  const ref = useRef<THREE.Points>(null);

  const { positions, speeds, driftY, driftZ } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const driftY = new Float32Array(count);
    const driftZ = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const t = Math.random();                            // 0‥1 along path
      const angle = Math.random() * Math.PI * 2;
      const spread = t * 2.4;                             // fans out over distance
      positions[i * 3 + 0] = t * 7;                       // x: 0 → 7
      positions[i * 3 + 1] = Math.sin(angle) * spread;
      positions[i * 3 + 2] = Math.cos(angle) * spread;
      speeds[i] = 0.018 + Math.random() * 0.045;
      // Per-particle drift direction so they fan out naturally
      const a = Math.random() * Math.PI * 2;
      const r = 0.003 + Math.random() * 0.006;
      driftY[i] = Math.sin(a) * r;
      driftZ[i] = Math.cos(a) * r;
    }
    return { positions, speeds, driftY, driftZ };
  }, [count]);

  useFrame((_, delta) => {
    const pts = ref.current;
    if (!pts) return;
    const pos = pts.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const dt = delta * 60;

    for (let i = 0; i < count; i++) {
      arr[i * 3] += speeds[i] * dt;

      // Fan out: push y/z away from axis proportional to distance from center
      const distFromCenter = Math.max(arr[i * 3], 0.1);
      const fan = THREE.MathUtils.clamp(distFromCenter / 5, 0, 1);
      arr[i * 3 + 1] += driftY[i] * fan * dt;
      arr[i * 3 + 2] += driftZ[i] * fan * dt;

      // Recycle when reaching the far right
      if (arr[i * 3] > 7) {
        arr[i * 3 + 0] = 0;
        arr[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color={color}
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Central gateway core: rotating wireframe icosahedron + inner glowing sphere.
 */
function GatewayCore() {
  const wire = useRef<THREE.LineSegments>(null);
  const wire2 = useRef<THREE.LineSegments>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (wire.current) {
      wire.current.rotation.x = t * 0.15;
      wire.current.rotation.y = t * 0.25;
    }
    if (wire2.current) {
      wire2.current.rotation.x = -t * 0.12;
      wire2.current.rotation.z = t * 0.18;
    }
    if (inner.current) {
      const s = 1 + Math.sin(t * 1.6) * 0.05;
      inner.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      {/* Inner glowing sphere */}
      <mesh ref={inner}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color={COLOR_CYAN} transparent opacity={0.55} />
      </mesh>

      {/* Outer wireframe icosahedron */}
      <lineSegments ref={wire}>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(1.1, 1)]} />
        <lineBasicMaterial color={COLOR_CYAN} transparent opacity={0.7} />
      </lineSegments>

      {/* Second wireframe layer */}
      <lineSegments ref={wire2}>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(1.4, 0)]} />
        <lineBasicMaterial color={COLOR_VIOLET} transparent opacity={0.5} />
      </lineSegments>

      {/* Soft halo */}
      <mesh>
        <sphereGeometry args={[1.7, 32, 32]} />
        <meshBasicMaterial color={COLOR_PINK} transparent opacity={0.04} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 5]} intensity={1.2} color={COLOR_CYAN} />

      <InboundFlow color={COLOR_CYAN} count={700} />
      <OutboundFlow color={COLOR_VIOLET} count={700} />
      <GatewayCore />
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0.6, 6.5], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
