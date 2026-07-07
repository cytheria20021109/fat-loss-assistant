/**
 * 领域类型 — portfolio 模块。
 * 前端与 API 共用这一份类型定义，保证端到端类型安全。
 */

export type SectionId = "etudes" | "carriere" | "intelligence";

/** 可记忆的指标锚点（大数字 + 说明） */
export interface Metric {
  value: string;
  label: string;
}

/** 数据源中的节点（位置为相对于版块中心的局部偏移） */
export interface NodeSeed {
  id: string;
  title: string;
  subtitle?: string;
  period?: string;
  /** 一句话讲清这段经历的成果与意义 */
  summary?: string;
  /** 2-3 个大数字指标，HR 能带走的记忆点 */
  metrics?: Metric[];
  details: string[];
  tags?: string[];
  /** 相对版块中心的偏移 [x, y, z] */
  offset: [number, number, number];
  /** 节点半径权重（信息重要度 → 视觉体量） */
  weight?: number;
}

export interface SectionSeed {
  id: SectionId;
  index: number;
  /** 法语版块名（视觉主标题） */
  nom: string;
  /** 中文版块名 */
  titre: string;
  tagline: string;
  /** 版块主旨 —— 一句话讲清这一章在讲什么 */
  these?: string;
  /** 版块星团中心的世界坐标 */
  center: [number, number, number];
  nodes: NodeSeed[];
}

export interface Profile {
  name: string;
  role: string;
  motto: string;
  /** Hero 定位陈述 —— 我是谁、凭什么、去哪里 */
  statement?: string;
  /** Hero 记忆锚点（3 个大数字） */
  anchors?: Metric[];
  email?: string;
  linkedin?: string;
  location?: string;
}

/** 星团之间的叙事过渡句（at = 滚动进度 0-1 上的位置） */
export interface NarrativeLine {
  at: number;
  zh: string;
  fr?: string;
}

/** 结尾落脚屏的资质清单 */
export interface EpilogueGroup {
  label: string;
  items: string[];
}

/** —— 以下为 service 层输出的“已展开”结构 —— */

export interface WorldNode {
  id: string;
  section: SectionId;
  title: string;
  subtitle?: string;
  period?: string;
  summary?: string;
  metrics?: Metric[];
  details: string[];
  tags?: string[];
  /** 世界坐标（center + offset 已合成） */
  position: [number, number, number];
  weight: number;
}

export interface SectionMeta {
  id: SectionId;
  index: number;
  nom: string;
  titre: string;
  tagline: string;
  these?: string;
  center: [number, number, number];
}

export interface PortfolioPayload {
  profile: Profile;
  sections: SectionMeta[];
  nodes: WorldNode[];
  narrative: NarrativeLine[];
  epilogue: EpilogueGroup[];
}
