"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useCursor } from "@react-three/drei";
import * as THREE from "three";
import { nodeVertex, nodeFragment } from "@/shaders/node";
import { palette, sectionAccent, activeSectionAt } from "@/lib/palette";
import { useSpace } from "@/lib/store";
import type { WorldNode } from "@/server/modules/portfolio/types";

/** 由 id 生成稳定的伪随机相位，保证每次渲染呼吸节奏一致 */
function seedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 997;
  return h / 997;
}

/**
 * 语义节点 — 空间中的一枚“玻璃记忆”。
 * 悬停：轮廓加深、标签清晰；单击：相机滑近并展开档案。
 * 层次：只有当前版块的节点完全显影，其余退成淡影。
 */
export function SemanticNode({ node }: { node: WorldNode }) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const label = useRef<HTMLDivElement>(null);

  const hovered = useSpace((s) => s.hoveredId === node.id);
  const focused = useSpace((s) => s.focusedId === node.id);
  const setHovered = useSpace((s) => s.setHovered);
  const setFocused = useSpace((s) => s.setFocused);

  useCursor(hovered, "pointer", "crosshair");

  const seed = useMemo(() => seedFromId(node.id), [node.id]);
  const radius = node.weight * 1.3;

  const uniforms = useMemo(
    () => ({
      uColorCore: { value: new THREE.Color(palette.ivoire) },
      uColorRim: { value: new THREE.Color(sectionAccent[node.section]) },
      uActivation: { value: 0 },
      uFade: { value: 1 },
      uTime: { value: 0 },
      uSeed: { value: seed },
    }),
    [node.section, seed]
  );

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const { sections, scroll } = useSpace.getState();
    const active = activeSectionAt(sections, scroll);
    // 当前版块 or 被凝视/悬停的节点 → 完全显影
    const inFocusLayer = node.section === active || hovered || focused;

    if (material.current) {
      const u = material.current.uniforms;
      u.uTime.value = t;
      const target = focused ? 1 : hovered ? 0.65 : 0;
      u.uActivation.value = THREE.MathUtils.damp(u.uActivation.value, target, 4, dt);
      u.uFade.value = THREE.MathUtils.damp(u.uFade.value, inFocusLayer ? 1 : 0, 2.2, dt);
    }

    if (group.current) {
      group.current.position.set(
        node.position[0] + Math.sin(t * 0.4 + seed * 9.0) * 0.14,
        node.position[1] + Math.sin(t * 0.55 + seed * 17.0) * 0.2,
        node.position[2]
      );
      const s = THREE.MathUtils.damp(
        group.current.scale.x,
        focused ? 1.22 : hovered ? 1.1 : 1,
        4,
        dt
      );
      group.current.scale.setScalar(s);
    }

    // 标签：仅当前版块 + 近处才浮现，避免远处文字互相干扰
    if (label.current && group.current) {
      const dist = state.camera.position.distanceTo(group.current.position);
      const near = THREE.MathUtils.clamp(1 - (dist - 7) / 7, 0, 1);
      const base = hovered || focused ? 1 : inFocusLayer ? near * 0.8 : 0;
      label.current.style.opacity = String(base);
    }
  });

  return (
    <group ref={group} position={node.position}>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(node.id);
        }}
        onPointerOut={() => setHovered(null)}
        onClick={(e) => {
          e.stopPropagation();
          setFocused(focused ? null : node.id);
        }}
      >
        <icosahedronGeometry args={[radius, 4]} />
        <shaderMaterial
          ref={material}
          vertexShader={nodeVertex}
          fragmentShader={nodeFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>

      <Html
        center
        position={[0, -(radius + 0.55), 0]}
        className="pointer-events-none"
        zIndexRange={[10, 0]}
      >
        <div
          ref={label}
          className={`node-label ${hovered || focused ? "is-active" : ""}`}
          style={{ opacity: 0 }}
        >
          <span>{node.title}</span>
          {node.period && <em>{node.period}</em>}
        </div>
      </Html>
    </group>
  );
}
