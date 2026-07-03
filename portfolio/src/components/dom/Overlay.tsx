"use client";

import { motion } from "framer-motion";
import { useSpace } from "@/lib/store";
import { sectionScrollTarget } from "@/lib/palette";

/**
 * DOM 覆盖层 — 纯排版，无按钮。
 * · 左上：字标
 * · 右缘：版块索引（悬停浮现说明，单击滑行至该星团）
 * · 左缘：滚动进度发丝线
 * · 底部：首次访问的引导语，一旦滚动即隐去
 */
export function Overlay() {
  const profile = useSpace((s) => s.profile);
  const sections = useSpace((s) => s.sections);
  const scroll = useSpace((s) => s.scroll);
  const hasScrolled = useSpace((s) => s.hasScrolled);
  const setScroll = useSpace((s) => s.setScroll);
  const setFocused = useSpace((s) => s.setFocused);

  // 依据滚动进度推断当前所在版块
  const activeIndex = sections.reduce((acc, s, i) => {
    return scroll >= sectionScrollTarget(s.center[2]) - 0.12 ? i : acc;
  }, 0);

  return (
    <div className="pointer-events-none fixed inset-0 z-20 select-none">
      {/* 字标 */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        className="absolute left-8 top-8"
      >
        <h1 className="font-display text-xl tracking-vaste text-os">
          {profile?.name ?? ""}
        </h1>
        <p className="mt-2 font-mono text-[10px] tracking-air text-brume">
          {profile?.role} · Espace Sémantique
        </p>
      </motion.header>

      {/* 滚动进度发丝线 */}
      <div className="absolute left-8 top-1/2 h-40 w-px -translate-y-1/2 bg-acier/30">
        <div
          className="w-px bg-os/80 transition-[height] duration-300 ease-out"
          style={{ height: `${scroll * 100}%` }}
        />
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
                    i === activeIndex ? "text-os" : "text-brume/50"
                  } group-hover:text-poudre`}
                >
                  {String(s.index).padStart(2, "0")} {s.nom}
                </span>
                <span className="block max-h-0 overflow-hidden font-mono text-[9px] tracking-air text-brume/70 opacity-0 transition-all duration-500 group-hover:max-h-6 group-hover:pt-1 group-hover:opacity-100">
                  {s.titre} · {s.tagline}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* 引导语 —— 一旦开始滚动即告别 */}
      <motion.footer
        animate={{ opacity: hasScrolled ? 0 : 1 }}
        transition={{ duration: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center"
      >
        <p className="font-display text-sm italic tracking-air text-brume">
          {profile?.motto}
        </p>
        <p className="mt-4 font-mono text-[9px] uppercase tracking-vaste text-brume/60">
          défiler pour dériver · survoler pour lire · cliquer pour approcher
        </p>
        <div className="mx-auto mt-4 hairline h-10" />
      </motion.footer>

      {/* 联络坐标 —— 右下角，纯文字，悬停显影 */}
      <motion.address
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 1.2 }}
        className="pointer-events-auto absolute bottom-8 right-8 text-right not-italic"
      >
        {profile?.location && (
          <p className="font-mono text-[9px] tracking-air text-brume/50">
            {profile.location}
          </p>
        )}
        <p className="mt-1 space-x-4 font-mono text-[9px] tracking-air">
          {profile?.email && (
            <a
              href={`mailto:${profile.email}`}
              className="text-brume/60 transition-colors duration-500 hover:text-poudre"
            >
              courriel
            </a>
          )}
          {profile?.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-brume/60 transition-colors duration-500 hover:text-poudre"
            >
              linkedin
            </a>
          )}
        </p>
      </motion.address>
    </div>
  );
}
