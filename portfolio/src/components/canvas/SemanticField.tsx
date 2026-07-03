"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { SemanticNode } from "./SemanticNode";
import { palette, sectionAccent } from "@/lib/palette";
import { useSpace } from "@/lib/store";
import type { SectionMeta, WorldNode } from "@/server/modules/portfolio/types";

/**
 * 语义星云场 — 节点、语义连线、版块题名与「色环之门」。
 *
 * 层次设计：
 * · 每个版块入口悬着两枚同心色环（该版块的彩度），穿过它 = 进入新章节
 * · 版块之间以一条暗线相续，构成穿越全场的隐约路径
 * · 连线只在版块内部生成（最近的两枚邻居），不跨版块，结构一目了然
 */

function buildEdges(nodes: WorldNode[], sections: SectionMeta[]): Float32Array {
  const segments: number[] = [];
  const seen = new Set<string>();

  for (const section of sections) {
    const members = nodes.filter((n) => n.section === section.id);
    for (const a of members) {
      const neighbours = members
        .filter((b) => b.id !== a.id)
        .map((b) => ({
          b,
          d:
            (a.position[0] - b.position[0]) ** 2 +
            (a.position[1] - b.position[1]) ** 2 +
            (a.position[2] - b.position[2]) ** 2,
        }))
        .sort((x, y) => x.d - y.d)
        .slice(0, 2);

      for (const { b } of neighbours) {
        const key = [a.id, b.id].sort().join("|");
        if (seen.has(key)) continue;
        seen.add(key);
        segments.push(...a.position, ...b.position);
      }
    }
  }

  for (let i = 0; i < sections.length - 1; i++) {
    segments.push(...sections[i].center, ...sections[i + 1].center);
  }

  return new Float32Array(segments);
}

/** 色环之门 — 版块入口的两枚同心圆环，是章节的空间锚点 */
function Gateway({ section }: { section: SectionMeta }) {
  const accent = sectionAccent[section.id];
  const [cx, cy, cz] = section.center;
  const inner = useRef<THREE.Mesh>(null);
  const outer = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (inner.current) inner.current.rotation.z = t * 0.05;
    if (outer.current) outer.current.rotation.z = -t * 0.035;
  });

  return (
    <group position={[cx, cy, cz + 3.4]}>
      <mesh ref={inner}>
        <torusGeometry args={[3.1, 0.012, 8, 160]} />
        <meshBasicMaterial color={accent} transparent opacity={0.55} />
      </mesh>
      <mesh ref={outer} position={[0, 0, -0.6]}>
        <torusGeometry args={[3.55, 0.006, 8, 160]} />
        <meshBasicMaterial color={accent} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function ClusterLabel({ section }: { section: SectionMeta }) {
  const el = useRef<HTMLDivElement>(null);
  const anchor = useMemo(
    () =>
      new THREE.Vector3(
        section.center[0],
        section.center[1] + 2.8,
        section.center[2] + 1.5
      ),
    [section]
  );

  useFrame((state) => {
    if (!el.current) return;
    const dist = Math.abs(state.camera.position.z - anchor.z);
    const opacity = THREE.MathUtils.clamp(1 - (dist - 6) / 12, 0, 0.92);
    el.current.style.opacity = String(opacity);
  });

  return (
    <Html
      center
      position={anchor.toArray()}
      className="pointer-events-none"
      zIndexRange={[5, 0]}
    >
      <div ref={el} className="cluster-label" style={{ opacity: 0 }}>
        <i style={{ color: sectionAccent[section.id] }}>
          {String(section.index).padStart(2, "0")}
        </i>
        <b>{section.nom}</b>
        <span>{section.titre}</span>
      </div>
    </Html>
  );
}

export function SemanticField() {
  const nodes = useSpace((s) => s.nodes);
  const sections = useSpace((s) => s.sections);

  const edges = useMemo(() => buildEdges(nodes, sections), [nodes, sections]);

  if (nodes.length === 0) return null;

  return (
    <group>
      {/* 语义连线 —— 浅底上用墨灰细线 */}
      <lineSegments frustumCulled={false}>
        <bufferGeometry key={edges.length}>
          <bufferAttribute attach="attributes-position" args={[edges, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={palette.gris}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </lineSegments>

      {sections.map((s) => (
        <group key={s.id}>
          <Gateway section={s} />
          <ClusterLabel section={s} />
        </group>
      ))}

      {nodes.map((n) => (
        <SemanticNode key={n.id} node={n} />
      ))}
    </group>
  );
}
