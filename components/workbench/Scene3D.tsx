"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { accounts, transfers } from "@/content/guardian-graph";
import type { ProjectSlug } from "@/content/types";
import { cardTexture, corkTexture, labelTexture, paperTexture, pegboardTexture, signScreenTexture, transcriptTexture, woodTexture } from "./textures";

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

const POS: Record<ProjectSlug, THREE.Vector3> = {
  signlink: new THREE.Vector3(-1.55, 0, 0.1),
  visionary: new THREE.Vector3(-0.38, 0, 0.32),
  baseline: new THREE.Vector3(0.9, 0, 0.18),
  guardian: new THREE.Vector3(1.62, 1.02, -0.93),
};

const LABEL_ANCHOR: Record<ProjectSlug, THREE.Vector3> = {
  signlink: new THREE.Vector3(-1.2, 0.82, -0.2),
  visionary: new THREE.Vector3(-0.38, 0.5, 0.32),
  baseline: new THREE.Vector3(0.9, 0.55, 0.18),
  guardian: new THREE.Vector3(1.62, 1.5, -0.9),
};

const OVERVIEW = { pos: new THREE.Vector3(0.05, 1.7, 4.4), target: new THREE.Vector3(0.05, 0.5, -0.25) };
// The panel covers the right third of the stage, so each focus shot is
// shifted right (object appears left of centre) by FOCUS_SHIFT.
const FOCUS_SHIFT = new THREE.Vector3(0.42, 0, 0);
const FOCUS_RAW: Record<ProjectSlug, { pos: THREE.Vector3; target: THREE.Vector3 }> = {
  signlink: { pos: new THREE.Vector3(-1.2, 1.15, 2.1), target: new THREE.Vector3(-1.5, 0.42, 0) },
  visionary: { pos: new THREE.Vector3(-0.3, 1.05, 1.75), target: new THREE.Vector3(-0.38, 0.22, 0.28) },
  baseline: { pos: new THREE.Vector3(0.98, 1.05, 1.85), target: new THREE.Vector3(0.9, 0.22, 0.15) },
  guardian: { pos: new THREE.Vector3(1.35, 1.2, 1.25), target: new THREE.Vector3(1.6, 1.0, -0.95) },
};
const FOCUS = Object.fromEntries(
  (Object.keys(FOCUS_RAW) as ProjectSlug[]).map((k) => {
    const shift = FOCUS_SHIFT.clone().multiplyScalar(k === "guardian" ? 1.25 : 1);
    return [k, { pos: FOCUS_RAW[k].pos.clone().add(shift), target: FOCUS_RAW[k].target.clone().add(shift) }];
  }),
) as Record<ProjectSlug, { pos: THREE.Vector3; target: THREE.Vector3 }>;

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
  const top = useRounded(4.6, 0.1, 1.7, 0.03);
  return (
    <group>
      {/* Wall */}
      <mesh position={[0, 1.4, -1.25]} receiveShadow>
        <planeGeometry args={[14, 6]} />
        <meshStandardMaterial color={dark ? "#1b1d22" : "#e8e6e1"} roughness={0.95} />
      </mesh>
      {/* Pegboard */}
      <mesh position={[0.75, 1.0, -1.18]} receiveShadow>
        <boxGeometry args={[3.2, 1.05, 0.03]} />
        <meshStandardMaterial map={peg} roughness={0.85} />
      </mesh>
      {/* Bench top */}
      <mesh geometry={top} position={[0, -0.05, -0.1]} receiveShadow castShadow>
        <meshStandardMaterial map={wood} roughness={0.55} metalness={0.02} />
      </mesh>
      {/* Front apron */}
      <mesh position={[0, -0.24, 0.73]} receiveShadow>
        <boxGeometry args={[4.5, 0.28, 0.04]} />
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

/** Desk lamp: the scene's key light and focal point. */
function Lamp({ dark }: { dark: boolean }) {
  const light = useRef<THREE.SpotLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);
  useEffect(() => {
    target.position.set(-0.1, 0, 0.1);
    if (light.current) light.current.target = target;
  }, [target]);
  const metal = <meshStandardMaterial color={dark ? "#2b2e35" : "#2f3339"} metalness={0.7} roughness={0.35} />;
  return (
    <group position={[-2.05, 0, -0.75]}>
      <primitive object={target} />
      <mesh position={[0, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.18, 0.05, 32]} />
        {metal}
      </mesh>
      <mesh position={[0.08, 0.5, 0]} rotation-z={-0.35} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 1.0, 12]} />
        {metal}
      </mesh>
      <mesh position={[0.48, 1.0, 0.12]} rotation={[0.25, 0, -1.2]} castShadow>
        <cylinderGeometry args={[0.016, 0.016, 0.85, 12]} />
        {metal}
      </mesh>
      <group position={[0.86, 1.05, 0.3]} rotation={[0.55, 0, -0.95]}>
        <mesh castShadow>
          <coneGeometry args={[0.15, 0.22, 32, 1, true]} />
          <meshStandardMaterial color={dark ? "#d6d9de" : "#26292f"} metalness={0.4} roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
        <mesh position-y={-0.07}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#fff2d6" toneMapped={false} />
        </mesh>
      </group>
      <spotLight
        ref={light}
        position={[0.95, 1.0, 0.36]}
        angle={0.95}
        penumbra={0.7}
        intensity={dark ? 38 : 22}
        distance={7}
        decay={1.6}
        color="#ffe2b8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0004}
      />
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

function BaselineExhibit({ active, runKey }: { active: boolean; runKey: number }) {
  const ledger = useMemo(() => paperTexture("ledger.csv"), []);
  const brief = useMemo(() => paperTexture("BRIEF", 6), []);
  const labels = useMemo(() => ({
    cat: labelTexture("CATEGORIZE", "#1f3fa8", "#ffffff"),
    anom: labelTexture("ANOMALIES", "#1f3fa8", "#ffffff"),
    run: labelTexture("RUNWAY·PY", "#2b2e35", "#ffffff"),
  }), []);
  const housing = useRounded(0.46, 0.12, 0.3, 0.02);
  const carts: { x: number; tex: THREE.Texture; llm: boolean }[] = [
    { x: -0.14, tex: labels.cat, llm: true },
    { x: 0, tex: labels.anom, llm: true },
    { x: 0.14, tex: labels.run, llm: false },
  ];
  const start = new THREE.Vector3(-0.36, 0.08, 0.05);
  const end = new THREE.Vector3(0.44, 0.04, 0.05);
  const fan = useMemo(
    () =>
      carts.map((c) => ({
        in: new THREE.CatmullRomCurve3([start, new THREE.Vector3(-0.3, 0.2, 0.05), new THREE.Vector3(c.x, 0.32, 0)]),
        out: new THREE.CatmullRomCurve3([new THREE.Vector3(c.x, 0.32, 0), new THREE.Vector3(0.3, 0.2, 0.05), end]),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  return (
    <group>
      {/* Ledger stack */}
      <group position={[-0.38, 0, 0.05]} rotation-y={0.12}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[i * 0.004, 0.004 + i * 0.006, -i * 0.003]} rotation-x={-Math.PI / 2} receiveShadow castShadow>
            <planeGeometry args={[0.2, 0.26]} />
            <meshStandardMaterial map={i === 3 ? ledger : undefined} color={i === 3 ? "#ffffff" : "#ece8de"} roughness={0.9} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
      {/* Processor with three cartridges */}
      <mesh geometry={housing} position={[0, 0.06, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#2a2d34" metalness={0.35} roughness={0.45} />
      </mesh>
      {carts.map((c) => (
        <group key={c.x} position={[c.x, 0.2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.1, 0.18, 0.2]} />
            <meshStandardMaterial color={c.llm ? "#2f56e0" : "#3b3f48"} metalness={0.2} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.0, 0.101]}>
            <planeGeometry args={[0.095, 0.024]} />
            <meshBasicMaterial map={c.tex} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0.07, 0.101]}>
            <circleGeometry args={[0.008, 12]} />
            <meshBasicMaterial color={active ? "#9fffc8" : "#5d6270"} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* Output tray with the brief */}
      <group position={[0.44, 0, 0.05]} rotation-y={-0.12}>
        <mesh position-y={0.012} castShadow receiveShadow>
          <boxGeometry args={[0.24, 0.024, 0.3]} />
          <meshStandardMaterial color="#3a3d44" roughness={0.5} />
        </mesh>
        <mesh position-y={0.026} rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[0.19, 0.25]} />
          <meshStandardMaterial map={brief} roughness={0.9} />
        </mesh>
      </group>
      {fan.map((f, i) => (
        <group key={i}>
          <Pulse curve={f.in} active={active} runKey={runKey} duration={0.9} />
          <Pulse curve={f.out} active={active} runKey={runKey} delay={0.9 + (i === 2 ? 0.05 : i * 0.15)} duration={0.9} />
        </group>
      ))}
    </group>
  );
}

function GuardianExhibit({ active, runKey }: { active: boolean; runKey: number }) {
  const cork = useMemo(() => corkTexture(), []);
  const W = 1.0;
  const H = 0.68;
  // Map synthetic graph coordinates (≈ 50..620 × 28..388) onto the board.
  const at = (x: number, y: number) => new THREE.Vector3(((x - 335) / 600) * W * 0.92, (-(y - 208) / 380) * H * 0.92, 0.03);
  const byId = Object.fromEntries(accounts.map((a) => [a.id, a]));
  const cards = useMemo(
    () => accounts.map((a) => ({ id: a.id, pos: at(a.x, a.y), tex: cardTexture(a.label, a.inPattern ? (a.id === "C1" ? "collector" : a.id === "S1" ? "source" : "pass-through") : "ordinary", a.inPattern) })),
    [],
  );
  const strings = useMemo(
    () => transfers.map((t) => ({ t, a: at(byId[t.from].x, byId[t.from].y), b: at(byId[t.to].x, byId[t.to].y) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const mats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const start = useRef(0);
  useEffect(() => {
    start.current = performance.now() / 1000;
  }, [runKey, active]);
  // Light the pattern's strings in order: fan-out first, then fan-in.
  useFrame(() => {
    const t = performance.now() / 1000 - start.current;
    strings.forEach((s, i) => {
      const m = mats.current[i];
      if (!m) return;
      const order = s.t.inPattern ? (s.t.from === "S1" ? 0 : 1) : -1;
      const lit = active && order >= 0 && t > 0.3 + order * 0.9 + (order === 0 ? i * 0.12 : (i - 5) * 0.12);
      m.color.set(lit ? "#e0453a" : s.t.inPattern ? "#8f3a33" : "#7d7466");
      m.emissive.set(lit ? "#e0453a" : "#000000");
      m.emissiveIntensity = lit ? 0.6 : 0;
    });
  });
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[W + 0.06, H + 0.06, 0.04]} />
        <meshStandardMaterial color="#5a3c24" roughness={0.7} />
      </mesh>
      <mesh position-z={0.021} receiveShadow>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial map={cork} roughness={0.95} />
      </mesh>
      {strings.map((s, i) => {
        const mid = s.a.clone().add(s.b).multiplyScalar(0.5);
        const len = s.a.distanceTo(s.b);
        const angle = Math.atan2(s.b.y - s.a.y, s.b.x - s.a.x);
        return (
          <mesh key={s.t.id} position={[mid.x, mid.y, 0.045]} rotation-z={angle - Math.PI / 2}>
            <cylinderGeometry args={[0.0028, 0.0028, len, 6]} />
            <meshStandardMaterial ref={(m) => { mats.current[i] = m; }} color="#7d7466" roughness={0.6} />
          </mesh>
        );
      })}
      {cards.map((c) => (
        <group key={c.id} position={[c.pos.x, c.pos.y, 0.035]}>
          <mesh castShadow>
            <planeGeometry args={[0.12, 0.075]} />
            <meshStandardMaterial map={c.tex} roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.03, 0.012]}>
            <sphereGeometry args={[0.009, 12, 12]} />
            <meshStandardMaterial color="#c0392b" roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------- Camera & labels ------------------------------------------------ */

function CameraRig({ selected, labelRefs }: { selected: ProjectSlug | null; labelRefs: SceneProps["labelRefs"] }) {
  const target = useRef(OVERVIEW.target.clone());
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame((state, dt) => {
    const { camera, size, pointer } = state;
    const goal = selected ? FOCUS[selected] : OVERVIEW;
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
    (Object.keys(LABEL_ANCHOR) as ProjectSlug[]).forEach((slug) => {
      const el = refs[slug];
      if (!el) return;
      const p = LABEL_ANCHOR[slug].clone().project(camera);
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

  const plinth = (slug: ProjectSlug, children: React.ReactNode, radius?: number) => (
    <group position={POS[slug]}>
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
        <hemisphereLight args={[dark ? "#b9c4ff" : "#ffffff", dark ? "#2a1d14" : "#b6a48f", dark ? 0.55 : 1.15]} />
        <directionalLight position={[3, 4, 3]} intensity={dark ? 0.35 : 0.9} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-camera-left={-3} shadow-camera-right={3} shadow-camera-top={2} shadow-camera-bottom={-2} />
        {/* Cool fill on the right so the board and Baseline read at night */}
        <pointLight position={[1.3, 1.9, 0.9]} intensity={dark ? 9 : 2} distance={5} decay={1.5} color={dark ? "#a9bcff" : "#ffffff"} />
        <Room dark={dark} />
        <Lamp dark={dark} />
        {plinth("signlink", <SignLinkExhibit active={selected === "signlink"} runKey={motionKey} />, 0.5)}
        {plinth("visionary", <group scale={1.3}><VisionaryExhibit part={selected === "visionary" ? part : null} onPart={(p) => { onSelect("visionary"); onPart(p); }} /></group>, 0.5)}
        {plinth("baseline", <BaselineExhibit active={selected === "baseline"} runKey={motionKey} />, 0.5)}
        <group position={POS.guardian}>
          <Plinth slug="guardian" selected={selected === "guardian"} hovered={hovered === "guardian"} onSelect={onSelect} onHover={onHover} radius={0.001}>
            <GuardianExhibit active={selected === "guardian"} runKey={motionKey} />
          </Plinth>
        </group>
        <CameraRig selected={selected} labelRefs={labelRefs} />
        <Ready onReady={onReady} />
      </Canvas>
    </div>
  );
}
