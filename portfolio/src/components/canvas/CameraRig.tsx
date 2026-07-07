"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { useSpace } from "@/lib/store";
import { CAMERA_PATH } from "@/lib/palette";

/**
 * 相机运镜 — 两种模式：
 *
 * 漫游（默认）：虚拟滚动推进 z 轴纵深，鼠标位置提供细微视差，
 *              一切都经过阻尼，像在浓雾里缓慢滑行。
 * 凝视（聚焦）：点击节点后 GSAP 将相机滑近节点侧前方，
 *              视线锁定节点；滚动或点击虚空即释放。
 */
export function CameraRig() {
  const { camera } = useThree();
  const focusedId = useSpace((s) => s.focusedId);

  const smooth = useRef({ scroll: 0, x: 0, y: 0 });
  const lookAt = useRef(new THREE.Vector3(0, 0, 0));
  const roamTarget = useRef(new THREE.Vector3());

  useEffect(() => {
    const { nodes, setScroll } = useSpace.getState();

    if (focusedId) {
      const node = nodes.find((n) => n.id === focusedId);
      if (!node) return;
      const [nx, ny, nz] = node.position;
      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(lookAt.current);
      gsap.to(camera.position, {
        x: nx + 1.1,
        y: ny + 0.45,
        z: nz + 3.6,
        duration: 1.7,
        ease: "power3.inOut",
      });
      gsap.to(lookAt.current, {
        x: nx,
        y: ny,
        z: nz,
        duration: 1.7,
        ease: "power3.inOut",
      });
    } else {
      // 释放聚焦：把当前相机深度换算回滚动进度，避免跳变
      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(lookAt.current);
      const t =
        (camera.position.z - CAMERA_PATH.start) /
        (CAMERA_PATH.end - CAMERA_PATH.start);
      const clamped = Math.min(Math.max(t, 0), 1);
      smooth.current.scroll = clamped;
      smooth.current.x = camera.position.x;
      smooth.current.y = camera.position.y;
      setScroll(clamped);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedId]);

  useFrame((state, dt) => {
    const { scroll, focusedId: focused } = useSpace.getState();

    if (!focused) {
      smooth.current.scroll = THREE.MathUtils.damp(
        smooth.current.scroll,
        scroll,
        2.4,
        dt
      );
      const z = THREE.MathUtils.lerp(
        CAMERA_PATH.start,
        CAMERA_PATH.end,
        smooth.current.scroll
      );
      // 鼠标视差 —— 幅度克制
      smooth.current.x = THREE.MathUtils.damp(
        smooth.current.x,
        state.pointer.x * 1.5,
        1.8,
        dt
      );
      smooth.current.y = THREE.MathUtils.damp(
        smooth.current.y,
        state.pointer.y * 0.9,
        1.8,
        dt
      );
      camera.position.set(smooth.current.x, smooth.current.y, z);

      roamTarget.current.set(
        state.pointer.x * 0.6,
        state.pointer.y * 0.4,
        z - 14
      );
      lookAt.current.lerp(roamTarget.current, 1 - Math.exp(-2.5 * dt));
    }

    camera.lookAt(lookAt.current);
  });

  return null;
}
