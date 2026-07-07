import type {
  EpilogueGroup,
  NarrativeLine,
  Profile,
  SectionSeed,
} from "./types";
import raw from "@/server/data/portfolio.json";

/**
 * Repository 层 — 数据访问的唯一入口。
 *
 * 当前实现：读取打包进构建的 JSON 文件（零依赖、零延迟）。
 * 未来接入数据库（Postgres / Supabase / CMS）时，只需在此文件
 * 替换实现并保持返回类型不变，service 层与 API 层完全无感。
 */

interface PortfolioSource {
  profile: Profile;
  sections: SectionSeed[];
  narrative: NarrativeLine[];
  epilogue: EpilogueGroup[];
}

export async function findProfile(): Promise<Profile> {
  return (raw as PortfolioSource).profile;
}

export async function findAllSections(): Promise<SectionSeed[]> {
  return (raw as PortfolioSource).sections;
}

export async function findSectionById(id: string): Promise<SectionSeed | undefined> {
  return (raw as PortfolioSource).sections.find((s) => s.id === id);
}

export async function findNarrative(): Promise<NarrativeLine[]> {
  return (raw as PortfolioSource).narrative ?? [];
}

export async function findEpilogue(): Promise<EpilogueGroup[]> {
  return (raw as PortfolioSource).epilogue ?? [];
}
