"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { atmosphereVertex, atmosphereFragment } from "@/shaders/atmosphere";
import { palette, sectionGlow } from "@/lib/palette";
import { useSpace } from "@/lib/store";

/** 三个版块的“天色”，按滚动进度插值 —— 穿行时背景缓缓换色 */
const ACCENTS = [
  new THREE.Color(sectionGlow.etudes),
  new THREE.Color(sectionGlow.carriere),
  new THREE.Color(sectionGlow.intelligence),
];

/**
 * 全屏大气背景 — 永远贴在远平面之后渲染。
 * 粉彩柔光漂移；章节光随穿行由玫瑰粉 → 雾蓝 → 褪金。
 */
export function Backdrop() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const smoothScroll = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uHaut: { value: new THREE.Color(palette.ivoire) },
      uBas: { value: new THREE.Color("#e8e4da") },
      uRose: { value: new THREE.Color(sectionGlow.etudes) },
      uBleu: { value: new THREE.Color(sectionGlow.carriere) },
      uDore: { value: new THREE.Color(sectionGlow.intelligence) },
      uAccent: { value: new THREE.Color(sectionGlow.etudes) },
      uOmbre: { value: new THREE.Color("#cfcdc6") },
    }),
    []
  );

  useFrame((state, dt) => {
    if (!material.current) return;
    const { scroll } = useSpace.getState();
    smoothScroll.current = THREE.MathUtils.damp(smoothScroll.current, scroll, 2, dt);

    const u = material.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uScroll.value = smoothScroll.current;
    u.uResolution.value.set(state.size.width, state.size.height);

    // 章节光插值：0→0.5 玫瑰→雾蓝，0.5→1 雾蓝→褪金
    const s = smoothScroll.current;
    const accent = u.uAccent.value as THREE.Color;
    if (s < 0.5) accent.lerpColors(ACCENTS[0], ACCENTS[1], s * 2);
    else accent.lerpColors(ACCENTS[1], ACCENTS[2], (s - 0.5) * 2);
  });

  return (
    <mesh frustumCulled={false} renderOrder={-100}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={atmosphereVertex}
        fragmentShader={atmosphereFragment}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
