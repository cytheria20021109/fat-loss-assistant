import * as repository from "./repository";
import type {
  PortfolioPayload,
  SectionMeta,
  SectionSeed,
  WorldNode,
} from "./types";

/**
 * Service 层 — 领域逻辑。
 * 把数据源中的“局部偏移”展开为 3D 场景可直接使用的世界坐标，
 * 并整理出前端需要的扁平结构。
 */

function toMeta(section: SectionSeed): SectionMeta {
  const { nodes: _nodes, ...meta } = section;
  return meta;
}

function toWorldNodes(section: SectionSeed): WorldNode[] {
  const [cx, cy, cz] = section.center;
  return section.nodes.map((n) => ({
    id: n.id,
    section: section.id,
    title: n.title,
    subtitle: n.subtitle,
    period: n.period,
    summary: n.summary,
    metrics: n.metrics,
    details: n.details,
    tags: n.tags,
    position: [cx + n.offset[0], cy + n.offset[1], cz + n.offset[2]],
    weight: n.weight ?? 0.5,
  }));
}

export async function getPortfolio(): Promise<PortfolioPayload> {
  const [profile, sections, narrative, epilogue] = await Promise.all([
    repository.findProfile(),
    repository.findAllSections(),
    repository.findNarrative(),
    repository.findEpilogue(),
  ]);
  return {
    profile,
    sections: sections.map(toMeta),
    nodes: sections.flatMap(toWorldNodes),
    narrative,
    epilogue,
  };
}

export async function getSection(id: string) {
  const section = await repository.findSectionById(id);
  if (!section) return null;
  return { meta: toMeta(section), nodes: toWorldNodes(section) };
}
