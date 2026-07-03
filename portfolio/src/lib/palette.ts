import type { SectionId } from "@/server/modules/portfolio/types";

/** 与 tailwind.config 保持同一套「brume française」色板 */
export const palette = {
  encre: "#22252d",
  acier: "#4c586c",
  brume: "#a7aeb9",
  os: "#e7e2d6",
  poudre: "#c9a6a2",
  rose: "#b98e8b",
  dore: "#d3c8a6",
} as const;

/** 每个版块的点缀色 —— 依旧低饱和，仅作轮廓光区分 */
export const sectionAccent: Record<SectionId, string> = {
  etudes: palette.poudre, // 学业 · 枯木粉
  carriere: "#9fb0c2", // 职场 · 冷钢蓝灰
  intelligence: palette.dore, // AI · 褪色金
};

/**
 * 相机漫游的纵深范围（世界坐标 z）。
 * end 必须停在最深星团之前 —— 相机始终从星团前方凝视它们。
 */
export const CAMERA_PATH = { start: 8, end: -36 } as const;

/** 由版块中心推算它在滚动进度 [0,1] 上的位置 */
export function sectionScrollTarget(centerZ: number): number {
  const t = (centerZ + 6 - CAMERA_PATH.start) / (CAMERA_PATH.end - CAMERA_PATH.start);
  return Math.min(Math.max(t, 0), 1);
}
