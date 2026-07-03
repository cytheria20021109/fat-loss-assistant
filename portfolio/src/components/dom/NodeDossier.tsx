"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSpace } from "@/lib/store";
import { sectionAccent } from "@/lib/palette";

/**
 * 节点档案 — 「流水席」式无边框侧幕。
 *
 * 聚焦某枚节点时，右侧浮起一幕由象牙色雾气构成的纱帘
 * （渐变遮罩，无边框、无卡片），文字逐行流入，
 * 内容长时可在幕内独立滚动（滚轮/触摸不再推动相机）。
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
      staggerChildren: 0.09,
      delayChildren: 0.25,
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

  const node = nodes.find((n) => n.id === focusedId);
  const section = node && sections.find((s) => s.id === node.section);
  const accent = node ? sectionAccent[node.section] : undefined;

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
              "linear-gradient(to left, rgba(250,247,241,0.96) 62%, rgba(250,247,241,0.8) 82%, rgba(250,247,241,0))",
          }}
        >
          {/* 从顶部自然流下的排版：内容可长可短，滚动手感与普通页面一致 */}
          <div className="px-10 pb-32 pt-[18vh] md:px-16">
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

            {/* 流水正文 —— 每一道依次上席 */}
            <div className="mt-14 space-y-10">
              {node.details.map((d, i) => (
                <motion.div key={i} variants={line} className="flex gap-5">
                  <span
                    className="mt-[0.6em] block h-px w-6 shrink-0"
                    style={{ backgroundColor: accent, opacity: 0.7 }}
                  />
                  <p className="max-w-[38ch] font-mono text-[13px] leading-[1.9] tracking-wide text-encre/85">
                    {d}
                  </p>
                </motion.div>
              ))}
            </div>

            {node.tags && node.tags.length > 0 && (
              <motion.p
                variants={line}
                className="mt-14 font-mono text-[9px] uppercase tracking-vaste text-gris"
              >
                {node.tags.join(" · ")}
              </motion.p>
            )}

            <motion.p
              variants={line}
              className="mt-16 font-display text-xs italic tracking-air text-gris/70"
            >
              cliquer dans le vide pour repartir —— 点击虚空即可离开
            </motion.p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
