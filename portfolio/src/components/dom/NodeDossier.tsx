"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSpace } from "@/lib/store";

/**
 * 节点档案 — 聚焦某枚节点时，从右侧雾中浮现的卡片。
 * 没有关闭按钮：点击虚空、滚动、或 Esc 即离开。
 */
export function NodeDossier() {
  const focusedId = useSpace((s) => s.focusedId);
  const nodes = useSpace((s) => s.nodes);
  const sections = useSpace((s) => s.sections);

  const node = nodes.find((n) => n.id === focusedId);
  const section = node && sections.find((s) => s.id === node.section);

  return (
    <AnimatePresence>
      {node && section && (
        <motion.aside
          key={node.id}
          initial={{ opacity: 0, x: 48, filter: "blur(6px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: 32, filter: "blur(6px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="fixed right-10 top-1/2 z-30 w-[22rem] -translate-y-1/2 border-l border-brume/20 bg-encre/40 p-8 backdrop-blur-md"
        >
          <p className="font-mono text-[9px] uppercase tracking-vaste text-poudre">
            {String(section.index).padStart(2, "0")} · {section.nom}
          </p>

          <h2 className="mt-4 font-display text-2xl leading-snug tracking-wide text-os">
            {node.title}
          </h2>
          {node.subtitle && (
            <p className="mt-1 font-mono text-xs tracking-air text-brume">
              {node.subtitle}
            </p>
          )}
          {node.period && (
            <p className="mt-3 font-mono text-[10px] tracking-vaste text-brume/70">
              {node.period}
            </p>
          )}

          <ul className="mt-6 space-y-3 border-t border-brume/15 pt-6">
            {node.details.map((d, i) => (
              <li
                key={i}
                className="font-mono text-[11px] leading-relaxed tracking-wide text-os/85"
              >
                {d}
              </li>
            ))}
          </ul>

          {node.tags && node.tags.length > 0 && (
            <p className="mt-6 font-mono text-[9px] uppercase tracking-vaste text-brume/60">
              {node.tags.join(" · ")}
            </p>
          )}

          <p className="mt-8 font-mono text-[9px] italic tracking-air text-brume/40">
            cliquer dans le vide pour repartir —— 点击虚空即可离开
          </p>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
