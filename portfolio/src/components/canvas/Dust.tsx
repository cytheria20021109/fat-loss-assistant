"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { dustVertex, dustFragment } from "@/shaders/dust";
import { CAMERA_PATH } from "@/lib/palette";

const COUNT = 260;

/** 光尘的粉彩色候选 —— 与三个版块的天色同源，外加象牙白 */
const MOTE_COLORS = ["#f4d5cd", "#d2dff0", "#efe1b8", "#ffffff", "#fbf8f2"];

/** 沿相机路径散布的柔焦光尘，提供纵深参照 */
export function Dust() {
  const material = useRef<THREE.ShaderMaterial>(null);

  const { positions, phases, scales, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const phases = new Float32Array(COUNT);
    const scales = new Float32Array(COUNT);
    const colors = new Float32Array(COUNT * 3);
    const c = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 11;
      positions[i * 3 + 2] =
        CAMERA_PATH.start + Math.random() * (CAMERA_PATH.end - 10 - CAMERA_PATH.start);
      phases[i] = Math.random();
      scales[i] = 1.0 + Math.random() * 2.6;
      c.set(MOTE_COLORS[Math.floor(Math.random() * MOTE_COLORS.length)]);
      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, phases, scales, colors };
  }, []);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    if (material.current) {
      material.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={dustVertex}
        fragmentShader={dustFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}
