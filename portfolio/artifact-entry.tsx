/**
 * Artifact 预览入口 — 不经 Next.js，直接把 Experience 装配进单文件页面。
 * 仅用于打包自包含预览，不参与站点构建。
 */
import { StrictMode, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Scene } from "@/components/canvas/Scene";
import { Overlay } from "@/components/dom/Overlay";
import { NodeDossier } from "@/components/dom/NodeDossier";
import { useSpace } from "@/lib/store";
import { getPortfolio } from "@/server/modules/portfolio/service";

function App({ data }: { data: Awaited<ReturnType<typeof getPortfolio>> }) {
  const setData = useSpace((s) => s.setData);
  const touchY = useRef<number | null>(null);

  useEffect(() => {
    setData(data);
  }, [data, setData]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      useSpace.getState().addScroll(e.deltaY * 0.00045);
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY.current = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
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

const data = await getPortfolio();
document.body.classList.add("font-mono", "antialiased");
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App data={data} />
  </StrictMode>
);
