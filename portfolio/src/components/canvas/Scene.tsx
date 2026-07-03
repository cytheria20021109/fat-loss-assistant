"use client";

import { Canvas } from "@react-three/fiber";
import { Backdrop } from "./Backdrop";
import { Dust } from "./Dust";
import { SemanticField } from "./SemanticField";
import { CameraRig } from "./CameraRig";
import { palette, CAMERA_PATH } from "@/lib/palette";
import { useSpace } from "@/lib/store";

/**
 * 3D 舞台 — 雾、尘、光、节点。
 * onPointerMissed：点击虚空即释放聚焦（无按钮的“返回”）。
 */
export function Scene() {
  const setFocused = useSpace((s) => s.setFocused);

  return (
    <Canvas
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      dpr={[1, 1.75]}
      camera={{ fov: 55, near: 0.1, far: 140, position: [0, 0, CAMERA_PATH.start] }}
      onPointerMissed={() => setFocused(null)}
    >
      <color attach="background" args={[palette.fond]} />
      <fog attach="fog" args={[palette.fond, 18, 64]} />
      <Backdrop />
      <Dust />
      <SemanticField />
      <CameraRig />
    </Canvas>
  );
}
