import type { SectionId, SectionMeta } from "@/server/modules/portfolio/types";

/**
 * 色板「porcelaine」— 浅色系：瓷白底、冷墨字，
 * 三个版块各持一种低饱和彩度（玫瑰粉 / 雾蓝 / 褪金），
 * 背景柔光随穿行渐次换色。
 */
export const palette = {
  fond: "#f0ede6", // 瓷白 — 空间底色
  ivoire: "#faf7f1", // 象牙 — 高光与面板
  encre: "#3a3f4b", // 冷墨 — 主文字
  gris: "#8b909c", // 雾灰 — 次级文字
  rose: "#cf8d84", // 玫瑰粉 — 学业
  bleu: "#85a0c4", // 雾蓝 — 职场
  dore: "#c9a964", // 暖金 — AI
} as const;

/** 节点轮廓光（较深，浅底上可读） */
export const sectionAccent: Record<SectionId, string> = {
  etudes: palette.rose,
  carriere: palette.bleu,
  intelligence: palette.dore,
};

/** 背景柔光（粉彩版，明亮通透） */
export const sectionGlow: Record<SectionId, string> = {
  etudes: "#f2cfc8",
  carriere: "#cfdded",
  intelligence: "#eee0b4",
};

/** 相机漫游的纵深范围（世界坐标 z）。end 停在最深星团之前。 */
export const CAMERA_PATH = { start: 8, end: -36 } as const;

/** 由版块中心推算它在滚动进度 [0,1] 上的位置 */
export function sectionScrollTarget(centerZ: number): number {
  const t = (centerZ + 6 - CAMERA_PATH.start) / (CAMERA_PATH.end - CAMERA_PATH.start);
  return Math.min(Math.max(t, 0), 1);
}

/** 当前滚动进度对应的版块（用于层次：淡化非当前星团） */
export function activeSectionAt(sections: SectionMeta[], scroll: number): SectionId | null {
  let active: SectionId | null = sections[0]?.id ?? null;
  for (const s of sections) {
    if (scroll >= sectionScrollTarget(s.center[2]) - 0.14) active = s.id;
  }
  return active;
}
