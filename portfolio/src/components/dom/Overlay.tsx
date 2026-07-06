"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSpace } from "@/lib/store";
import { sectionAccent, sectionScrollTarget } from "@/lib/palette";

/**
 * DOM 覆盖层 — 纯排版，无按钮。
 * · 左上：字标
 * · 右缘：版块索引（悬停浮现说明，单击滑行至该星团）
 * · 左缘：滚动进度发丝线
 * · 左下：当前章节指示（层次的常驻锚点）
 * · 底部：首次访问的引导语，一旦滚动即隐去
 */
export function Overlay() {
  const profile = useSpace((s) => s.profile);
  const sections = useSpace((s) => s.sections);
  const scroll = useSpace((s) => s.scroll);
  const hasScrolled = useSpace((s) => s.hasScrolled);
  const setScroll = useSpace((s) => s.setScroll);
  const setFocused = useSpace((s) => s.setFocused);

  const activeIndex = sections.reduce((acc, s, i) => {
    return scroll >= sectionScrollTarget(s.center[2]) - 0.14 ? i : acc;
  }, 0);
  const active = sections[activeIndex];

  return (
    <div className="pointer-events-none fixed inset-0 z-20 select-none">
      {/* 字标 —— Hero 期间隐身，入云后浮现 */}
      <header
        className="absolute left-8 top-8 transition-opacity duration-700"
        style={{ opacity: Math.min(1, Math.max(0, (scroll - 0.05) / 0.05)) }}
      >
        <h1 className="font-display text-2xl tracking-vaste text-encre">
          {profile?.name ?? ""}
        </h1>
        <p className="mt-2 font-mono text-[10px] tracking-air text-gris">
          {profile?.role} · Espace Sémantique
        </p>
      </header>

      {/* 滚动进度发丝线 */}
      <div className="absolute left-8 top-1/2 h-40 w-px -translate-y-1/2 bg-gris/25">
        <div
          className="w-px bg-encre/70 transition-[height] duration-300 ease-out"
          style={{ height: `${scroll * 100}%` }}
        />
      </div>

      {/* 当前章节指示 —— 左下角常驻，随穿行换字换色 */}
      <div className="absolute bottom-10 left-8">
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-baseline gap-3"
            >
              <span
                className="inline-block h-2 w-2 -translate-y-px rounded-full"
                style={{ backgroundColor: sectionAccent[active.id] }}
              />
              <span className="font-mono text-[10px] tracking-vaste text-encre/80">
                {String(active.index).padStart(2, "0")} {active.nom}
              </span>
              <span className="font-mono text-[10px] tracking-air text-gris">
                {active.titre}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 版块索引 —— 悬停浮现中文名，单击滑行 */}
      <nav className="pointer-events-auto absolute right-8 top-1/2 -translate-y-1/2">
        <ul className="flex flex-col items-end gap-7">
          {sections.map((s, i) => (
            <li key={s.id}>
              <div
                className="group cursor-pointer text-right"
                onClick={() => {
                  setFocused(null);
                  setScroll(sectionScrollTarget(s.center[2]));
                }}
              >
                <span
                  className={`font-mono text-[10px] tracking-vaste transition-colors duration-500 ${
                    i === activeIndex ? "text-encre" : "text-gris/60"
                  }`}
                  style={
                    i === activeIndex ? { color: sectionAccent[s.id] } : undefined
                  }
                >
                  {String(s.index).padStart(2, "0")} {s.nom}
                </span>
                <span className="block max-h-0 overflow-hidden font-mono text-[9px] tracking-air text-gris opacity-0 transition-all duration-500 group-hover:max-h-6 group-hover:pt-1 group-hover:opacity-100">
                  {s.titre} · {s.tagline}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* 交互提示 —— 进入星云后短暂陪伴，聚焦过一次即隐去 */}
      <motion.footer
        animate={{ opacity: hasScrolled && scroll > 0.06 && scroll < 0.9 ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center"
      >
        <p className="font-mono text-[9px] uppercase tracking-vaste text-gris/60">
          survoler pour lire · cliquer pour approcher —— 悬停阅读 · 单击靠近
        </p>
      </motion.footer>

      {/* 联络坐标 —— 右下角，纯文字，悬停显影 */}
      <motion.address
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 1.2 }}
        className="pointer-events-auto absolute bottom-8 right-8 text-right not-italic"
      >
        {profile?.location && (
          <p className="font-mono text-[9px] tracking-air text-gris/70">
            {profile.location}
          </p>
        )}
        <p className="mt-1 space-x-4 font-mono text-[9px] tracking-air">
          {profile?.email && (
            <a
              href={`mailto:${profile.email}`}
              className="text-gris transition-colors duration-500 hover:text-rose"
            >
              courriel
            </a>
          )}
          {profile?.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-gris transition-colors duration-500 hover:text-rose"
            >
              linkedin
            </a>
          )}
        </p>
      </motion.address>
    </div>
  );
}
