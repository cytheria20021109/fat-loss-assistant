/**
 * 领域类型 — portfolio 模块。
 * 前端与 API 共用这一份类型定义，保证端到端类型安全。
 */

export type SectionId = "etudes" | "carriere" | "intelligence";

/** 数据源中的节点（位置为相对于版块中心的局部偏移） */
export interface NodeSeed {
  id: string;
  title: string;
  subtitle?: string;
  period?: string;
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
  /** 版块星团中心的世界坐标 */
  center: [number, number, number];
  nodes: NodeSeed[];
}

export interface Profile {
  name: string;
  role: string;
  motto: string;
  email?: string;
  linkedin?: string;
  location?: string;
}

/** —— 以下为 service 层输出的“已展开”结构 —— */

export interface WorldNode {
  id: string;
  section: SectionId;
  title: string;
  subtitle?: string;
  period?: string;
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
  center: [number, number, number];
}

export interface PortfolioPayload {
  profile: Profile;
  sections: SectionMeta[];
  nodes: WorldNode[];
}
