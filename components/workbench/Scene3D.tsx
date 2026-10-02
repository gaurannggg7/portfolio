"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { BENCH_ORDER, exhibits } from "@/content/exhibits";
import { featured } from "@/content/projects";
import type { ProjectSlug } from "@/content/types";
import { dossierTexture, instrumentFaceTexture, paperTexture, pegboardTexture, placardTexture, signScreenTexture, terminalScreenTexture, transcriptTexture, woodTexture } from "./textures";

export type SceneProps = {
  selected: ProjectSlug | null;
  hovered: ProjectSlug | null;
  part: string | null;
  /** Increments to replay the selected exhibit's animation. */
  motionKey: number;
  dark: boolean;
  onSelect: (slug: ProjectSlug) => void;
  onHover: (slug: ProjectSlug | null) => void;
  onPart: (part: string) => void;
  /** Screen positions of each exhibit, for the DOM labels. */
  labelRefs: React.RefObject<Partial<Record<ProjectSlug, HTMLElement | null>>>;
  onReady: () => void;
};

const ACCENT = new THREE.Color("#3d6bff");
const ACCENT_HOT = new THREE.Color("#7f9cff");

/* ---------- Layout --------------------------------------------------------- */

/** Five exhibits in one row, evenly spaced along the bench. */
const SPACING = 0.9;
const X = Object.fromEntries(BENCH_ORDER.map((s, i) => [s, (i - (BENCH_ORDER.length - 1) / 2) * SPACING])) as Partial<Record<ProjectSlug, number>>;
const at = (slug: ProjectSlug) => X[slug] ?? 0;

const POS = (slug: ProjectSlug) => new THREE.Vector3(at(slug), 0, 0.02);
/** Labels sit on one line above the row. */
const LABEL_ANCHOR = (slug: ProjectSlug) => new THREE.Vector3(at(slug), 0.56, -0.05);

const OVERVIEW = { pos: new THREE.Vector3(0, 1.45, 4.45), target: new THREE.Vector3(0, 0.42, -0.1) };
// The panel covers the right third of the stage, so each focus shot is
// shifted right (the object appears left of centre).
const FOCUS_SHIFT = 0.4;
const focusFor = (slug: ProjectSlug) => ({
  pos: new THREE.Vector3(at(slug) + FOCUS_SHIFT, 1.2, 2.3),
  target: new THREE.Vector3(at(slug) + FOCUS_SHIFT, 0.2, 0.05),
});

/* ---------- Small helpers -------------------------------------------------- */

function useRounded(w: number, h: number, d: number, r = 0.02) {
  return useMemo(() => new RoundedBoxGeometry(w, h, d, 3, r), [w, h, d, r]);
}

function Tube({ points, radius = 0.008, color = "#20232a" }: { points: THREE.Vector3[]; radius?: number; color?: string }) {
  const geom = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 48, radius, 8, false), [points, radius]);
  return (
    <mesh geometry={geom} castShadow>
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  );
}

/** A glowing dot that runs along a path while `active`, restarting when `runKey` changes. */
function Pulse({ curve, active, runKey, delay = 0, duration = 1.4 }: { curve: THREE.Curve<THREE.Vector3>; active: boolean; runKey: number; delay?: number; duration?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const start = useRef(0);
  useEffect(() => {
    start.current = performance.now() / 1000 + delay;
  }, [runKey, active, delay]);
  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    const t = (performance.now() / 1000 - start.current) / duration;
    const on = active && t >= 0 && t <= 1;
    m.visible = on;
    if (on) m.position.copy(curve.getPointAt(Math.min(1, t)));
  });
  return (
    <mesh ref={ref} visible={false}>
      <sphereGeometry args={[0.022, 16, 16]} />
      <meshBasicMaterial color={ACCENT_HOT} toneMapped={false} />
    </mesh>
  );
}

/** Hover/selection lift and a soft accent disc under the exhibit. */
function Plinth({ slug, selected, hovered, children, onSelect, onHover, radius = 0.42 }: {
  slug: ProjectSlug;
  selected: boolean;
  hovered: boolean;
  children: React.ReactNode;
  onSelect: (s: ProjectSlug) => void;
  onHover: (s: ProjectSlug | null) => void;
  radius?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const disc = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((_, dt) => {
    const g = group.current;
    if (g) g.position.y = THREE.MathUtils.damp(g.position.y, hovered || selected ? 0.025 : 0, 8, dt);
    if (disc.current) disc.current.opacity = THREE.MathUtils.damp(disc.current.opacity, selected ? 0.35 : hovered ? 0.18 : 0, 8, dt);
  });
  return (
    <group
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onSelect(slug);
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onHover(slug);
      }}
      onPointerOut={() => onHover(null)}
    >
      <mesh rotation-x={-Math.PI / 2} position-y={0.002}>
        <circleGeometry args={[radius, 48]} />
        <meshBasicMaterial ref={disc} color={ACCENT} transparent opacity={0} depthWrite={false} />
      </mesh>
      <group ref={group}>{children}</group>
    </group>
  );
}

/* ---------- Room ----------------------------------------------------------- */

function Room({ dark }: { dark: boolean }) {
  const wood = useMemo(() => woodTexture(dark ? "#5b3a26" : "#8a5a3a", dark ? "#2a170c" : "#4a2a16"), [dark]);
  const peg = useMemo(() => pegboardTexture(dark ? "#2a2c31" : "#d6d3cb", dark ? "#15161a" : "#a9a59b"), [dark]);
  const top = useRounded(5.0, 0.1, 1.7, 0.03);
  return (
    <group>
      {/* Wall */}
      <mesh position={[0, 1.4, -1.25]} receiveShadow>
        <planeGeometry args={[14, 6]} />
        <meshStandardMaterial color={dark ? "#1b1d22" : "#e8e6e1"} roughness={0.95} />
      </mesh>
      {/* Pegboard, centred behind the row */}
      <mesh position={[0, 1.02, -1.18]} receiveShadow>
        <boxGeometry args={[4.7, 1.0, 0.03]} />
        <meshStandardMaterial map={peg} roughness={0.85} />
      </mesh>
      {/* Bench top */}
      <mesh geometry={top} position={[0, -0.05, -0.1]} receiveShadow castShadow>
        <meshStandardMaterial map={wood} roughness={0.55} metalness={0.02} />
      </mesh>
      {/* Front apron */}
      <mesh position={[0, -0.24, 0.73]} receiveShadow>
        <boxGeometry args={[4.9, 0.28, 0.04]} />
        <meshStandardMaterial color={dark ? "#3c2618" : "#6f4528"} roughness={0.7} />
      </mesh>
      {/* Floor shadow catcher far below for depth */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -1.6, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={dark ? "#121317" : "#d9d6cf"} />
      </mesh>
    </group>
  );
}

/** One soft pool of light per exhibit, from the light bar above. No shadows: the key light casts those. */
function BenchLights({ dark, selected }: { dark: boolean; selected: ProjectSlug | null }) {
  return (
    <>
      {BENCH_ORDER.map((slug) => (
        <PoolLight key={slug} x={at(slug)} intensity={(dark ? 5.5 : 2.6) * (selected && selected !== slug ? 0.45 : 1)} />
      ))}
    </>
  );
}

function PoolLight({ x, intensity }: { x: number; intensity: number }) {
  const light = useRef<THREE.SpotLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);
  useEffect(() => {
    target.position.set(x, 0, 0.05);
    if (light.current) light.current.target = target;
  }, [target, x]);
  useFrame((_, dt) => {
    if (light.current) light.current.intensity = THREE.MathUtils.damp(light.current.intensity, intensity, 4, dt);
  });
  return (
    <>
      <primitive object={target} />
      <spotLight ref={light} position={[x, 1.6, -0.75]} angle={0.42} penumbra={0.9} intensity={intensity} distance={4} decay={1.4} color="#fff1dc" />
    </>
  );
}

/** Tent card in front of each exhibit: number, name, and what the object is. */
function Placard({ slug, index, dark }: { slug: ProjectSlug; index: number; dark: boolean }) {
  const tex = useMemo(() => placardTexture(String(index + 1).padStart(2, "0"), featured[slug].name, exhibits[slug].object, dark), [slug, index, dark]);
  return (
    <group position={[at(slug), 0, 0.5]} rotation-x={-0.42}>
      <mesh position-y={0.07} castShadow>
        <boxGeometry args={[0.46, 0.148, 0.006]} />
        <meshStandardMaterial color={dark ? "#23262c" : "#fbfaf6"} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.07, 0.0035]}>
        <planeGeometry args={[0.45, 0.14]} />
        <meshStandardMaterial map={tex} roughness={0.8} />
      </mesh>
    </group>
  );
}

/* ---------- Exhibits ------------------------------------------------------- */

function SignLinkExhibit({ active, runKey }: { active: boolean; runKey: number }) {
  const transcript = useMemo(() => transcriptTexture(), []);
  const screen = useMemo(() => signScreenTexture(), []);
  const body = useRounded(0.62, 0.38, 0.05, 0.015);
  const disp = useRounded(0.42, 0.28, 0.035, 0.012);
  // Cables: mic → transcript display → monitor
  const c1 = useMemo(() => [new THREE.Vector3(-0.32, 0.03, 0.22), new THREE.Vector3(-0.2, 0.01, 0.32), new THREE.Vector3(-0.02, 0.01, 0.3), new THREE.Vector3(0.05, 0.03, 0.2)], []);
  const c2 = useMemo(() => [new THREE.Vector3(0.18, 0.03, 0.18), new THREE.Vector3(0.3, 0.01, 0.12), new THREE.Vector3(0.36, 0.01, -0.05), new THREE.Vector3(0.36, 0.05, -0.16)], []);
  const pulsePath = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.32, 0.42, 0.22),
        new THREE.Vector3(-0.32, 0.05, 0.22),
        ...c1,
        new THREE.Vector3(0.1, 0.22, 0.17),
        new THREE.Vector3(0.18, 0.05, 0.18),
        ...c2,
        new THREE.Vector3(0.36, 0.42, -0.2),
      ]),
    [c1, c2],
  );
  return (
    <group>
      {/* Microphone */}
      <group position={[-0.32, 0, 0.22]}>
        <mesh position-y={0.012} castShadow receiveShadow>
          <cylinderGeometry args={[0.09, 0.1, 0.024, 32]} />
          <meshStandardMaterial color="#25282e" metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh position-y={0.18} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.32, 12]} />
          <meshStandardMaterial color="#9aa0aa" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position-y={0.38} castShadow>
          <cylinderGeometry args={[0.045, 0.04, 0.13, 24]} />
          <meshStandardMaterial color="#2a2d33" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position-y={0.47} castShadow>
          <sphereGeometry args={[0.055, 24, 24]} />
          <meshStandardMaterial color="#5b616b" metalness={0.85} roughness={0.45} wireframe />
        </mesh>
        <mesh position-y={0.47}>
          <sphereGeometry args={[0.05, 24, 24]} />
          <meshStandardMaterial color="#181a1f" roughness={0.8} />
        </mesh>
      </group>
      {/* Transcript display */}
      <group position={[0.1, 0.17, 0.17]} rotation-x={-0.35}>
        <mesh geometry={disp} castShadow>
          <meshStandardMaterial color="#1c1f26" roughness={0.5} />
        </mesh>
        <mesh position-z={0.019}>
          <planeGeometry args={[0.39, 0.25]} />
          <meshStandardMaterial map={transcript} emissive="#ffffff" emissiveMap={transcript} emissiveIntensity={0.55} roughness={0.3} />
        </mesh>
      </group>
      <mesh position={[0.1, 0.05, 0.12]} rotation-x={0.4} castShadow>
        <boxGeometry args={[0.22, 0.12, 0.02]} />
        <meshStandardMaterial color="#2a2d33" />
      </mesh>
      {/* Monitor */}
      <group position={[0.36, 0, -0.2]}>
        <mesh position-y={0.012} castShadow receiveShadow>
          <boxGeometry args={[0.24, 0.024, 0.16]} />
          <meshStandardMaterial color="#2a2d33" metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh position-y={0.13} castShadow>
          <boxGeometry args={[0.04, 0.22, 0.03]} />
          <meshStandardMaterial color="#2a2d33" metalness={0.4} roughness={0.4} />
        </mesh>
        <group position-y={0.43}>
          <mesh geometry={body} castShadow>
            <meshStandardMaterial color="#17191e" roughness={0.45} />
          </mesh>
          <mesh position-z={0.026}>
            <planeGeometry args={[0.58, 0.345]} />
            <meshStandardMaterial map={screen} emissive="#ffffff" emissiveMap={screen} emissiveIntensity={0.6} roughness={0.25} />
          </mesh>
        </group>
      </group>
      <Tube points={c1} />
      <Tube points={c2} />
      <Pulse curve={pulsePath} active={active} runKey={runKey} duration={2.6} />
    </group>
  );
}

function VisionaryExhibit({ part, onPart }: { part: string | null; onPart: (p: string) => void }) {
  const palm = useRounded(0.3, 0.07, 0.3, 0.035);
  const mcu = useRounded(0.26, 0.025, 0.18, 0.006);
  const glowFor = (id: string) => (part === id ? ACCENT : new THREE.Color("#000000"));
  const fingers: [number, number, number][] = [
    [-0.115, 0.15, 0.26],
    [-0.04, 0.19, 0.3],
    [0.035, 0.2, 0.31],
    [0.11, 0.17, 0.28],
  ];
  const pick = (id: string) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onPart(id);
  };
  const fabric = <meshStandardMaterial color="#e9e4d8" roughness={0.9} />;
  return (
    <group position={[0, 0.06, 0]}>
      {/* Display riser */}
      <mesh position={[0, -0.035, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.3, 0.32, 0.05, 48]} />
        <meshStandardMaterial color="#2d3037" roughness={0.6} />
      </mesh>
      <group rotation={[-0.15, 0.25, 0]}>
        <mesh geometry={palm} position={[0, 0.04, 0]} castShadow>
          {fabric}
        </mesh>
        {fingers.map(([x, len], i) => (
          <group key={i} position={[x, 0.04, -0.15]} rotation-x={-Math.PI / 2 + 0.12}>
            <mesh position-y={len / 2} castShadow>
              <capsuleGeometry args={[0.03, len, 6, 16]} />
              {fabric}
            </mesh>
            {/* Flex sensor strip along the finger */}
            <mesh position={[0, len / 2, 0.031]} onClick={pick("flex")}>
              <boxGeometry args={[0.014, len * 0.95, 0.006]} />
              <meshStandardMaterial color={part === "flex" ? "#3d6bff" : "#3a3d44"} emissive={glowFor("flex")} emissiveIntensity={0.9} roughness={0.4} />
            </mesh>
          </group>
        ))}
        {/* Thumb */}
        <group position={[0.17, 0.04, 0.02]} rotation={[-Math.PI / 2 + 0.2, 0, -0.9]}>
          <mesh position-y={0.07} castShadow>
            <capsuleGeometry args={[0.032, 0.12, 6, 16]} />
            {fabric}
          </mesh>
          <mesh position={[0, 0.07, 0.033]} onClick={pick("flex")}>
            <boxGeometry args={[0.014, 0.12, 0.006]} />
            <meshStandardMaterial color={part === "flex" ? "#3d6bff" : "#3a3d44"} emissive={glowFor("flex")} emissiveIntensity={0.9} />
          </mesh>
        </group>
        {/* IMU on the back of the hand */}
        <mesh position={[0, 0.085, 0.03]} onClick={pick("imu")} castShadow>
          <boxGeometry args={[0.07, 0.016, 0.07]} />
          <meshStandardMaterial color={part === "imu" ? "#3d6bff" : "#1f5e3a"} emissive={glowFor("imu")} emissiveIntensity={0.9} roughness={0.5} />
        </mesh>
      </group>
      {/* Microcontroller board with ribbon cable */}
      <group position={[0.42, -0.005, 0.12]} rotation-y={-0.4} onClick={pick("mcu")}>
        <mesh geometry={mcu} castShadow receiveShadow>
          <meshStandardMaterial color={part === "mcu" ? "#2a4fd0" : "#1e5a37"} emissive={glowFor("mcu")} emissiveIntensity={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.02, 0]} castShadow>
          <boxGeometry args={[0.08, 0.014, 0.08]} />
          <meshStandardMaterial color="#14161a" roughness={0.4} />
        </mesh>
        {[-0.1, -0.06, 0.06, 0.1].map((x) => (
          <mesh key={x} position={[x, 0.02, -0.07]}>
            <boxGeometry args={[0.02, 0.016, 0.02]} />
            <meshStandardMaterial color="#c9a227" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
      </group>
      <Tube
        points={[new THREE.Vector3(0.05, 0.06, 0.12), new THREE.Vector3(0.2, 0.0, 0.2), new THREE.Vector3(0.32, -0.0, 0.17), new THREE.Vector3(0.38, 0.02, 0.12)]}
        radius={0.012}
        color="#3a3d44"
      />
    </group>
  );
}

/** Baseline: a terminal with a deep housing, a ledger feeding in, and the brief coming out. */
function BaselineTerminal({ active, runKey }: { active: boolean; runKey: number }) {
  const screen = useMemo(() => terminalScreenTexture(), []);
  const ledger = useMemo(() => paperTexture("ledger.csv"), []);
  const brief = useMemo(() => paperTexture("BRIEF", 6), []);
  const housing = useRounded(0.46, 0.34, 0.34, 0.03);
  const bezel = useRounded(0.42, 0.29, 0.02, 0.012);
  const kb = useRounded(0.42, 0.025, 0.14, 0.01);
  const into = useMemo(() => new THREE.CatmullRomCurve3([new THREE.Vector3(-0.33, 0.04, 0.12), new THREE.Vector3(-0.28, 0.22, 0.1), new THREE.Vector3(-0.08, 0.3, 0.12)]), []);
  const out = useMemo(() => new THREE.CatmullRomCurve3([new THREE.Vector3(0.08, 0.3, 0.12), new THREE.Vector3(0.28, 0.2, 0.14), new THREE.Vector3(0.32, 0.04, 0.2)]), []);
  return (
    <group>
      {/* Housing, tilted back slightly */}
      <group position={[0, 0.2, -0.08]} rotation-x={-0.08}>
        <mesh geometry={housing} castShadow receiveShadow>
          <meshStandardMaterial color="#2a2d34" metalness={0.3} roughness={0.5} />
        </mesh>
        <mesh geometry={bezel} position-z={0.17}>
          <meshStandardMaterial color="#17191e" roughness={0.5} />
        </mesh>
        <mesh position-z={0.181}>
          <planeGeometry args={[0.38, 0.25]} />
          <meshStandardMaterial map={screen} emissive="#ffffff" emissiveMap={screen} emissiveIntensity={active ? 0.8 : 0.55} roughness={0.3} />
        </mesh>
      </group>
      <mesh position={[0, 0.015, -0.08]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.03, 0.22]} />
        <meshStandardMaterial color="#22252b" roughness={0.6} />
      </mesh>
      {/* Keyboard */}
      <mesh geometry={kb} position={[0, 0.013, 0.2]} rotation-x={0.06} castShadow receiveShadow>
        <meshStandardMaterial color="#3a3f48" roughness={0.6} />
      </mesh>
      {/* Ledger in, brief out */}
      <group position={[-0.33, 0, 0.14]} rotation-y={0.18}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[i * 0.004, 0.003 + i * 0.005, -i * 0.003]} rotation-x={-Math.PI / 2} receiveShadow castShadow>
            <planeGeometry args={[0.15, 0.2]} />
            <meshStandardMaterial map={i === 2 ? ledger : undefined} color={i === 2 ? "#ffffff" : "#ece8de"} roughness={0.9} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
      <group position={[0.33, 0, 0.2]} rotation-y={-0.18}>
        <mesh position-y={0.01} castShadow receiveShadow>
          <boxGeometry args={[0.17, 0.02, 0.22]} />
          <meshStandardMaterial color="#3a3d44" roughness={0.5} />
        </mesh>
        <mesh position-y={0.022} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[0.14, 0.19]} />
          <meshStandardMaterial map={brief} roughness={0.9} />
        </mesh>
      </group>
      <Pulse curve={into} active={active} runKey={runKey} duration={0.8} />
      <Pulse curve={out} active={active} runKey={runKey} delay={1.0} duration={0.8} />
    </group>
  );
}

const dialAngle = (v: number) => ((120 - 240 * v) * Math.PI) / 180;

/** Bellwether: an instrument with two dials and a gate lamp. Selecting it plays prompt_v1 → prompt_v2. */
function BellwetherInstrument({ active, runKey, part }: { active: boolean; runKey: number; part: string | null }) {
  const face = useMemo(() => instrumentFaceTexture(), []);
  const body = useRounded(0.62, 0.3, 0.26, 0.03);
  const safety = useRef<THREE.Group>(null);
  const recall = useRef<THREE.Group>(null);
  const lamp = useRef<THREE.MeshStandardMaterial>(null);
  const start = useRef(0);
  useEffect(() => {
    start.current = performance.now() / 1000;
  }, [runKey, active]);
  useFrame((_, dt) => {
    const t = performance.now() / 1000 - start.current;
    const k = active ? THREE.MathUtils.smoothstep(t, 0.5, 1.7) : 0;
    const v = 0.977 + (0.825 - 0.977) * k;
    if (safety.current) safety.current.rotation.z = THREE.MathUtils.damp(safety.current.rotation.z, dialAngle(v), 10, dt);
    if (recall.current) recall.current.rotation.z = dialAngle(1) + (active && t < 1.7 ? Math.sin(t * 18) * 0.015 : 0);
    const m = lamp.current;
    if (m) {
      const red = active && t > 1.8;
      m.color.set(red ? "#d8412f" : "#7d828b");
      m.emissive.set(red ? "#ff3b24" : part === "gate" ? "#3d6bff" : "#000000");
      m.emissiveIntensity = red ? 1.4 : part === "gate" ? 0.6 : 0;
    }
  });
  // Face is 0.56 × 0.28; dial centres from the texture layout.
  const W = 0.56;
  const H = 0.28;
  const u = (px: number) => (px / 768 - 0.5) * W;
  const v = (py: number) => (0.5 - py / 384) * H;
  const ring = (cx: number, id: string) =>
    part === id ? (
      <mesh position={[u(cx), v(190), 0.004]}>
        <ringGeometry args={[0.088, 0.096, 48]} />
        <meshBasicMaterial color={ACCENT} toneMapped={false} />
      </mesh>
    ) : null;
  const needle = (ref: React.RefObject<THREE.Group | null>, cx: number) => (
    <group ref={ref} position={[u(cx), v(190), 0.008]}>
      <mesh position-y={0.032}>
        <boxGeometry args={[0.006, 0.066, 0.004]} />
        <meshStandardMaterial color="#1d2026" roughness={0.4} />
      </mesh>
      <mesh rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.009, 0.009, 0.008, 16]} />
        <meshStandardMaterial color="#1d2026" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
  return (
    <group>
      <group position={[0, 0.17, -0.02]} rotation-x={-0.32}>
        <mesh geometry={body} castShadow receiveShadow>
          <meshStandardMaterial color="#2a2d34" metalness={0.3} roughness={0.5} />
        </mesh>
        <group position-z={0.131}>
          <mesh>
            <planeGeometry args={[W, H]} />
            <meshStandardMaterial map={face} roughness={0.7} />
          </mesh>
          {ring(150, "recall")}
          {ring(430, "safety")}
          {needle(recall, 150)}
          {needle(safety, 430)}
          <mesh position={[u(650), v(190), 0.012]}>
            <sphereGeometry args={[0.026, 24, 24]} />
            <meshStandardMaterial ref={lamp} color="#7d828b" roughness={0.3} />
          </mesh>
        </group>
      </group>
      {/* Strip-chart roll on top */}
      <mesh position={[0.17, 0.36, -0.12]} rotation-z={Math.PI / 2} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.2, 24]} />
        <meshStandardMaterial color="#e9e5da" roughness={0.9} />
      </mesh>
      <mesh position={[0.17, 0.3, -0.07]} rotation-x={-1.1}>
        <planeGeometry args={[0.18, 0.1]} />
        <meshStandardMaterial color="#fbfaf6" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.012, 0.02]} receiveShadow>
        <boxGeometry args={[0.66, 0.024, 0.34]} />
        <meshStandardMaterial color="#1f2126" roughness={0.6} />
      </mesh>
    </group>
  );
}

/** OSINT: an open dossier, a card file of excerpts, and a magnifier that travels from a citation to its excerpt. */
function OsintDossier({ active, runKey, part }: { active: boolean; runKey: number; part: string | null }) {
  const pages = useMemo(() => dossierTexture(), []);
  const lens = useRef<THREE.Group>(null);
  const start = useRef(0);
  useEffect(() => {
    start.current = performance.now() / 1000;
  }, [runKey, active]);
  const from = useMemo(() => new THREE.Vector3(-0.06, 0.06, 0.04), []);
  const to = useMemo(() => new THREE.Vector3(0.14, 0.06, -0.06), []);
  useFrame(() => {
    const g = lens.current;
    if (!g) return;
    const t = performance.now() / 1000 - start.current;
    const k = active ? THREE.MathUtils.smootherstep(t, 0.4, 1.6) : 0;
    g.position.lerpVectors(from, to, k);
    g.position.y = 0.06 + Math.sin(Math.PI * k) * 0.06;
  });
  const hl = (id: string) => (part === id ? ACCENT : new THREE.Color("#000000"));
  return (
    <group rotation-y={-0.06}>
      {/* Folder */}
      <mesh position={[0, 0.006, 0.02]} rotation-x={-Math.PI / 2} receiveShadow castShadow>
        <planeGeometry args={[0.66, 0.44]} />
        <meshStandardMaterial color="#c8a76a" roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.012, 0.02]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[0.6, 0.375]} />
        <meshStandardMaterial map={pages} roughness={0.9} emissive={hl("report")} emissiveIntensity={0.25} />
      </mesh>
      {/* Card file of excerpts */}
      <group position={[0.24, 0, -0.27]}>
        <mesh position-y={0.04} castShadow receiveShadow>
          <boxGeometry args={[0.18, 0.08, 0.12]} />
          <meshStandardMaterial color="#3a3f48" roughness={0.5} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[0, 0.1, -0.04 + i * 0.02]} rotation-x={-0.12} castShadow>
            <boxGeometry args={[0.16, 0.08, 0.003]} />
            <meshStandardMaterial color={i === 1 ? "#dfe7ff" : "#fbfaf6"} emissive={hl("excerpts")} emissiveIntensity={0.3} roughness={0.9} />
          </mesh>
        ))}
      </group>
      {/* Magnifier */}
      <group ref={lens} position={from.toArray()}>
        <mesh rotation-x={-Math.PI / 2}>
          <torusGeometry args={[0.065, 0.011, 12, 40]} />
          <meshStandardMaterial color={part === "lens" ? "#3d6bff" : "#1d2026"} metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.062, 40]} />
          <meshStandardMaterial color="#dfe8ff" transparent opacity={0.28} roughness={0.05} metalness={0.1} />
        </mesh>
        <mesh position={[0.1, -0.01, 0.06]} rotation={[Math.PI / 2, 0, -1.0]} castShadow>
          <cylinderGeometry args={[0.012, 0.014, 0.12, 12]} />
          <meshStandardMaterial color="#1d2026" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

/* ---------- Camera & labels ------------------------------------------------ */

function CameraRig({ selected, labelRefs }: { selected: ProjectSlug | null; labelRefs: SceneProps["labelRefs"] }) {
  const target = useRef(OVERVIEW.target.clone());
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame((state, dt) => {
    const { camera, size, pointer } = state;
    const goal = selected ? focusFor(selected) : OVERVIEW;
    // Gentle parallax with the pointer adds depth without free orbiting.
    const px = selected ? 0.06 : 0.28;
    const goalPos = v.copy(goal.pos).add(new THREE.Vector3(pointer.x * px, pointer.y * px * 0.5, 0));
    camera.position.x = THREE.MathUtils.damp(camera.position.x, goalPos.x, 3.2, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, goalPos.y, 3.2, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, goalPos.z, 3.2, dt);
    target.current.lerp(goal.target, 1 - Math.exp(-3.2 * dt));
    camera.lookAt(target.current);

    // Project label anchors to screen space and position the DOM labels.
    const refs = labelRefs.current;
    if (!refs) return;
    BENCH_ORDER.forEach((slug) => {
      const el = refs[slug];
      if (!el) return;
      const p = LABEL_ANCHOR(slug).project(camera);
      const x = (p.x * 0.5 + 0.5) * size.width;
      const y = (-p.y * 0.5 + 0.5) * size.height;
      const show = p.z < 1 && (!selected || selected === slug);
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
      el.style.opacity = show ? "1" : "0";
    });
  });
  return null;
}

function Ready({ onReady }: { onReady: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (!done.current) {
      done.current = true;
      requestAnimationFrame(onReady);
    }
  });
  return null;
}

/* ---------- Scene ---------------------------------------------------------- */

export default function Scene3D(props: SceneProps) {
  const { selected, hovered, part, motionKey, dark, onSelect, onHover, onPart, labelRefs, onReady } = props;
  const [visible, setVisible] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);

  // Pause rendering when the scene is scrolled out of view.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const plinth = (slug: ProjectSlug, children: React.ReactNode, radius = 0.42) => (
    <group position={POS(slug)}>
      <Plinth slug={slug} selected={selected === slug} hovered={hovered === slug} onSelect={onSelect} onHover={onHover} radius={radius}>
        {children}
      </Plinth>
    </group>
  );

  return (
    <div ref={wrap} className="absolute inset-0" style={{ cursor: hovered ? "pointer" : "default" }}>
      <Canvas
        shadows={{ type: THREE.PCFShadowMap }}
        dpr={[1, 1.75]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: OVERVIEW.pos.toArray(), fov: 36, near: 0.1, far: 40 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onPointerMissed={() => onHover(null)}
        aria-hidden
      >
        <color attach="background" args={[dark ? "#1b1d22" : "#e8e6e1"]} />
        <fog attach="fog" args={[dark ? "#1b1d22" : "#e8e6e1", 6, 12]} />
        <hemisphereLight args={[dark ? "#b9c4ff" : "#ffffff", dark ? "#2a1d14" : "#b6a48f", dark ? 0.6 : 1.05]} />
        {/* Key light from above and in front, matching the light bar; the only shadow caster. */}
        <directionalLight
          position={[0.6, 4.2, 2.6]}
          intensity={dark ? 0.55 : 1.0}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={1024}
          shadow-camera-left={-2.8}
          shadow-camera-right={2.8}
          shadow-camera-top={1.6}
          shadow-camera-bottom={-1.6}
          shadow-bias={-0.0004}
        />
        <Room dark={dark} />
        <BenchLights dark={dark} selected={selected} />
        {BENCH_ORDER.map((slug, i) => (
          <Placard key={slug} slug={slug} index={i} dark={dark} />
        ))}
        {plinth("baseline", <BaselineTerminal active={selected === "baseline"} runKey={motionKey} />)}
        {plinth("bellwether", <BellwetherInstrument active={selected === "bellwether"} runKey={motionKey} part={selected === "bellwether" ? part : null} />)}
        {plinth("osint", <OsintDossier active={selected === "osint"} runKey={motionKey} part={selected === "osint" ? part : null} />)}
        {plinth("signlink", <group scale={0.74} position-x={-0.12}><SignLinkExhibit active={selected === "signlink"} runKey={motionKey} /></group>)}
        {plinth(
          "visionary",
          <group scale={1.08} position-x={-0.12}>
            <VisionaryExhibit part={selected === "visionary" ? part : null} onPart={(p) => { onSelect("visionary"); onPart(p); }} />
          </group>,
        )}
        <CameraRig selected={selected} labelRefs={labelRefs} />
        <Ready onReady={onReady} />
      </Canvas>
    </div>
  );
}
