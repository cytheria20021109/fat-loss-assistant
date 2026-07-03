"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { SemanticNode } from "./SemanticNode";
import { palette } from "@/lib/palette";
import { useSpace } from "@/lib/store";
import type { SectionMeta, WorldNode } from "@/server/modules/portfolio/types";

/**
 * 语义星云场 — 节点、节点间的“语义连线”、版块题名。
 * 连线规则：同版块内每个节点连向其最近的两枚邻居（去重），
 * 版块中心之间再以一条暗线相续，构成穿越全场的隐约路径。
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

  // 版块之间的隐约脉络
  for (let i = 0; i < sections.length - 1; i++) {
    segments.push(...sections[i].center, ...sections[i + 1].center);
  }

  return new Float32Array(segments);
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

  // 题名随相机远近淡入淡出 —— 走到版块门口才看清它
  useFrame((state) => {
    if (!el.current) return;
    const dist = Math.abs(state.camera.position.z - anchor.z);
    const opacity = THREE.MathUtils.clamp(1 - (dist - 6) / 12, 0, 0.9);
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
        <i>{String(section.index).padStart(2, "0")}</i>
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
      {/* 语义连线 */}
      <lineSegments frustumCulled={false}>
        <bufferGeometry key={edges.length}>
          <bufferAttribute attach="attributes-position" args={[edges, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color={palette.acier}
          transparent
          opacity={0.38}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {sections.map((s) => (
        <ClusterLabel key={s.id} section={s} />
      ))}

      {nodes.map((n) => (
        <SemanticNode key={n.id} node={n} />
      ))}
    </group>
  );
}
