"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Overlay } from "./dom/Overlay";
import { NodeDossier } from "./dom/NodeDossier";
import { useSpace } from "@/lib/store";
import type { PortfolioPayload } from "@/server/modules/portfolio/types";

// WebGL 场景仅在客户端渲染
const Scene = dynamic(() => import("./canvas/Scene").then((m) => m.Scene), {
  ssr: false,
});

/**
 * Experience — 首页的总装配层。
 * 负责：注入数据、把 wheel / touch / Esc 转译为空间语言。
 */
export default function Experience({ data }: { data: PortfolioPayload }) {
  const setData = useSpace((s) => s.setData);
  const touchY = useRef<number | null>(null);

  useEffect(() => {
    setData(data);
  }, [data, setData]);

  useEffect(() => {
    // 流水席面板内部的滚动属于面板自己，不推动相机
    const insideDossier = (target: EventTarget | null) =>
      target instanceof Element && target.closest("[data-dossier]") != null;

    const onWheel = (e: WheelEvent) => {
      if (insideDossier(e.target)) return;
      useSpace.getState().addScroll(e.deltaY * 0.00045);
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY.current = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (insideDossier(e.target)) return;
      const y = e.touches[0]?.clientY;
      if (y == null || touchY.current == null) return;
      useSpace.getState().addScroll((touchY.current - y) * 0.0016);
      touchY.current = y;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") useSpace.getState().setFocused(null);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <main className="fixed inset-0">
      <Scene />
      <Overlay />
      <NodeDossier />
    </main>
  );
}
