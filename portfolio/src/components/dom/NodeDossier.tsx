"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSpace } from "@/lib/store";
import { sectionAccent } from "@/lib/palette";

/**
 * 节点档案 — 「流水席」式无边框侧幕。
 *
 * 结构借鉴成熟作品集的制式：
 *   眉题（章节） → 题名 → 一句话总结 → 大数字指标行 → 细节 → 标签
 *   → 上一枚 / 下一枚（沿故事线继续走，不必退回星云）
 * 没有关闭按钮：点击虚空、或 Esc 即离开。
 */

const curtain = {
  hidden: { opacity: 0, x: 80 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1] as const,
      staggerChildren: 0.08,
      delayChildren: 0.22,
    },
  },
  exit: { opacity: 0, x: 60, transition: { duration: 0.5 } },
};

const line = {
  hidden: { opacity: 0, y: 26, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function NodeDossier() {
  const focusedId = useSpace((s) => s.focusedId);
  const nodes = useSpace((s) => s.nodes);
  const sections = useSpace((s) => s.sections);
  const setFocused = useSpace((s) => s.setFocused);

  const index = nodes.findIndex((n) => n.id === focusedId);
  const node = index >= 0 ? nodes[index] : undefined;
  const section = node && sections.find((s) => s.id === node.section);
  const accent = node ? sectionAccent[node.section] : undefined;
  const prev = index > 0 ? nodes[index - 1] : undefined;
  const next = index >= 0 && index < nodes.length - 1 ? nodes[index + 1] : undefined;

  return (
    <AnimatePresence>
      {node && section && (
        <motion.aside
          key={node.id}
          data-dossier
          variants={curtain}
          initial="hidden"
          animate="show"
          exit="exit"
          className="dossier-scroll fixed inset-y-0 right-0 z-30 w-full max-w-xl overflow-y-auto"
          style={{
            background:
              "linear-gradient(to left, rgba(250,247,241,0.97) 62%, rgba(250,247,241,0.82) 82%, rgba(250,247,241,0))",
          }}
        >
          {/* 从顶部自然流下的排版：内容可长可短，滚动手感与普通页面一致 */}
          <div className="px-10 pb-28 pt-[14vh] md:px-16">
            {/* 章节眉题 */}
            <motion.p
              variants={line}
              className="font-mono text-[10px] uppercase tracking-vaste"
              style={{ color: accent }}
            >
              {String(section.index).padStart(2, "0")} · {section.nom} —— {section.titre}
            </motion.p>

            {/* 题名 */}
            <motion.h2
              variants={line}
              className="mt-6 font-display text-4xl leading-tight tracking-wide text-encre md:text-5xl"
            >
              {node.title}
            </motion.h2>

            {(node.subtitle || node.period) && (
              <motion.p
                variants={line}
                className="mt-4 font-mono text-xs tracking-air text-gris"
              >
                {node.subtitle}
                {node.subtitle && node.period && <span className="mx-3">·</span>}
                {node.period}
              </motion.p>
            )}

            {/* 一句话总结 —— 这段经历为什么值得记住 */}
            {node.summary && (
              <motion.p
                variants={line}
                className="mt-8 max-w-[40ch] font-display text-[15px] leading-[1.95] tracking-wide text-encre/90"
              >
                {node.summary}
              </motion.p>
            )}

            {/* 大数字指标行 —— HR 能带走的东西 */}
            {node.metrics && node.metrics.length > 0 && (
              <motion.div
                variants={line}
                className="mt-10 grid grid-cols-3 gap-6 border-y border-gris/15 py-7"
              >
                {node.metrics.map((m) => (
                  <div key={m.label}>
                    <p
                      className="font-display text-2xl tracking-wide md:text-3xl"
                      style={{ color: accent }}
                    >
                      {m.value}
                    </p>
                    <p className="mt-2 font-mono text-[9px] leading-relaxed tracking-air text-gris">
                      {m.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* 流水正文 —— 每一道依次上席 */}
            <div className="mt-10 space-y-8">
              {node.details.map((d, i) => (
                <motion.div key={i} variants={line} className="flex gap-5">
                  <span
                    className="mt-[0.6em] block h-px w-6 shrink-0"
                    style={{ backgroundColor: accent, opacity: 0.7 }}
                  />
                  <p className="max-w-[40ch] font-mono text-[13px] leading-[1.9] tracking-wide text-encre/85">
                    {d}
                  </p>
                </motion.div>
              ))}
            </div>

            {node.tags && node.tags.length > 0 && (
              <motion.p
                variants={line}
                className="mt-12 font-mono text-[9px] uppercase tracking-vaste text-gris"
              >
                {node.tags.join(" · ")}
              </motion.p>
            )}

            {/* 故事线导航 —— 不回星云也能继续走 */}
            <motion.nav
              variants={line}
              className="mt-14 flex items-center justify-between gap-6 border-t border-gris/15 pt-8"
            >
              {prev ? (
                <span
                  className="cursor-pointer text-left font-mono text-[10px] leading-relaxed tracking-air text-gris transition-colors hover:text-encre"
                  onClick={() => setFocused(prev.id)}
                >
                  ← 上一枚
                  <em className="mt-1 block not-italic text-encre/70">{prev.title}</em>
                </span>
              ) : (
                <span />
              )}
              {next ? (
                <span
                  className="cursor-pointer text-right font-mono text-[10px] leading-relaxed tracking-air text-gris transition-colors hover:text-encre"
                  onClick={() => setFocused(next.id)}
                >
                  下一枚 →
                  <em className="mt-1 block not-italic text-encre/70">{next.title}</em>
                </span>
              ) : (
                <span />
              )}
            </motion.nav>

            <motion.p
              variants={line}
              className="mt-10 font-display text-xs italic tracking-air text-gris/60"
            >
              cliquer dans le vide pour repartir —— 点击虚空即可离开
            </motion.p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
