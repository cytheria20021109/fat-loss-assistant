"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { atmosphereVertex, atmosphereFragment } from "@/shaders/atmosphere";
import { palette } from "@/lib/palette";
import { useSpace } from "@/lib/store";

/**
 * 全屏大气背景 — 永远贴在远平面之后渲染，
 * 光影会随虚拟滚动缓缓变化。
 */
export function Backdrop() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const smoothScroll = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uDeep: { value: new THREE.Color(palette.encre) },
      uHaze: { value: new THREE.Color(palette.brume) },
      uGlow: { value: new THREE.Color(palette.os) },
      uRose: { value: new THREE.Color(palette.poudre) },
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
