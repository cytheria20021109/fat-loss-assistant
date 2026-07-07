"use client";

import { motion } from "framer-motion";
import { useSpace } from "@/lib/store";

/**
 * 叙事层 — 让漫游有故事的递进。
 *
 * · Prologue（Hero）：进场即给出「我是谁 + 凭什么」，
 *   三个记忆锚点数字是给 HR 的五秒答案；下滑后让位于星云。
 * · 章节过渡句：星团之间的空档不再是空白，
 *   而是一句话的转场 —— 起点 → 业务 → 杠杆。
 * · Épilogue：滚到尽头的落脚屏，联络方式与资质清单，
 *   看完的人知道下一步找谁、怎么找。
 */

/** 以 center 为峰值的山形淡入淡出 */
function peak(scroll: number, center: number, width: number): number {
  const d = Math.abs(scroll - center) / width;
  return Math.max(0, 1 - d * d);
}

export function NarrativeLayer() {
  const profile = useSpace((s) => s.profile);
  const narrative = useSpace((s) => s.narrative);
  const epilogue = useSpace((s) => s.epilogue);
  const scroll = useSpace((s) => s.scroll);
  const focusedId = useSpace((s) => s.focusedId);

  if (!profile) return null;

  // 聚焦节点时叙事层整体退场，把舞台让给档案
  const stage = focusedId ? 0 : 1;

  const heroOpacity = Math.max(0, 1 - scroll / 0.04) * stage;
  const epilogueOpacity =
    Math.max(0, (scroll - 0.955) / 0.045) * stage;

  return (
    <div className="pointer-events-none fixed inset-0 z-10 select-none">
      {/* ——— Prologue · Hero ——— */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        style={{ opacity: heroOpacity, display: heroOpacity < 0.01 ? "none" : undefined }}
        className="absolute inset-x-0 top-[16vh] mx-auto max-w-3xl px-8 text-center"
      >
        <p className="font-mono text-[10px] uppercase tracking-vaste text-rose">
          Espace Sémantique · 个人语义空间
        </p>
        <h1 className="mt-5 font-display text-6xl tracking-[0.18em] text-encre md:text-7xl">
          {profile.name}
        </h1>
        <p className="mt-3 font-mono text-[11px] tracking-vaste text-gris">
          {profile.role}
        </p>

        {profile.statement && (
          <p className="mx-auto mt-8 max-w-[36ch] font-display text-lg leading-relaxed tracking-wide text-encre/85">
            {profile.statement}
          </p>
        )}

        {profile.anchors && (
          <div className="mx-auto mt-12 flex max-w-2xl items-start justify-center gap-10 md:gap-16">
            {profile.anchors.map((a) => (
              <div key={a.value} className="text-center">
                <p className="font-display text-3xl tracking-wide text-encre md:text-4xl">
                  {a.value}
                </p>
                <p className="mx-auto mt-2 max-w-[16ch] font-mono text-[9px] leading-relaxed tracking-air text-gris">
                  {a.label}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 flex flex-col items-center gap-3">
          <p className="font-mono text-[9px] uppercase tracking-vaste text-gris/70">
            défiler pour entrer —— 向下滑动，走进星云
          </p>
          <div className="hairline h-12" />
        </div>
      </motion.section>

      {/* ——— 章节过渡句 ——— */}
      {narrative.map((line) => {
        const o = peak(scroll, line.at, 0.055) * stage;
        if (o < 0.02) return null;
        return (
          <div
            key={line.at}
            style={{ opacity: o }}
            className="absolute inset-x-0 top-[42vh] mx-auto max-w-2xl px-8 text-center"
          >
            <p className="font-display text-2xl leading-relaxed tracking-[0.08em] text-encre/90 md:text-3xl">
              {line.zh}
            </p>
            {line.fr && (
              <p className="mt-4 font-mono text-[9px] uppercase tracking-vaste text-gris">
                {line.fr}
              </p>
            )}
          </div>
        );
      })}

      {/* ——— Épilogue · 落脚屏 ——— */}
      <section
        style={{
          opacity: epilogueOpacity,
          display: epilogueOpacity < 0.01 ? "none" : undefined,
        }}
        className="pointer-events-auto absolute inset-x-0 top-[18vh] mx-auto max-w-2xl px-8 text-center"
      >
        <p className="font-mono text-[10px] uppercase tracking-vaste text-dore">
          Épilogue —— 尾声
        </p>
        <h2 className="mt-5 font-display text-4xl tracking-[0.1em] text-encre md:text-5xl">
          期待与你相遇
        </h2>
        <p className="mt-4 font-display text-base italic tracking-wide text-gris">
          金融 × 数据 × AI 的下一站，正在寻找同路人
        </p>

        <div className="mt-10 flex items-center justify-center gap-8">
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="font-mono text-xs tracking-air text-encre underline decoration-rose/60 underline-offset-4 transition-colors hover:text-rose"
            >
              {profile.email}
            </a>
          )}
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs tracking-air text-encre underline decoration-bleu/60 underline-offset-4 transition-colors hover:text-bleu"
            >
              LinkedIn
            </a>
          )}
        </div>

        <div className="mx-auto mt-12 grid max-w-xl grid-cols-1 gap-8 text-left md:grid-cols-3">
          {epilogue.map((g) => (
            <div key={g.label}>
              <p className="font-mono text-[9px] uppercase tracking-vaste text-gris">
                {g.label}
              </p>
              <ul className="mt-3 space-y-2">
                {g.items.map((item, i) => (
                  <li
                    key={i}
                    className="font-mono text-[10px] leading-relaxed tracking-wide text-encre/80"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {profile.location && (
          <p className="mt-10 font-mono text-[9px] tracking-vaste text-gris/70">
            {profile.location}
          </p>
        )}
      </section>
    </div>
  );
}
