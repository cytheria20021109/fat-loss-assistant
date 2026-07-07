"use client";

import { create } from "zustand";
import type {
  EpilogueGroup,
  NarrativeLine,
  PortfolioPayload,
  Profile,
  SectionMeta,
  WorldNode,
} from "@/server/modules/portfolio/types";

/**
 * 全局空间状态 — zustand。
 * 渲染循环（useFrame）通过 useSpace.getState() 读取，避免每帧重渲染；
 * DOM 层通过 selector 订阅，只在关心的值变化时更新。
 */
interface SpaceState {
  profile: Profile | null;
  sections: SectionMeta[];
  nodes: WorldNode[];
  narrative: NarrativeLine[];
  epilogue: EpilogueGroup[];

  hoveredId: string | null;
  focusedId: string | null;
  /** 虚拟滚动进度 [0, 1]，由 wheel / touch 驱动 */
  scroll: number;
  hasScrolled: boolean;

  setData: (payload: PortfolioPayload) => void;
  setHovered: (id: string | null) => void;
  setFocused: (id: string | null) => void;
  addScroll: (delta: number) => void;
  setScroll: (value: number) => void;
}

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

export const useSpace = create<SpaceState>((set) => ({
  profile: null,
  sections: [],
  nodes: [],
  narrative: [],
  epilogue: [],

  hoveredId: null,
  focusedId: null,
  scroll: 0,
  hasScrolled: false,

  setData: (payload) =>
    set({
      profile: payload.profile,
      sections: payload.sections,
      nodes: payload.nodes,
      narrative: payload.narrative,
      epilogue: payload.epilogue,
    }),

  setHovered: (id) => set({ hoveredId: id }),

  // 聚焦某个节点；传 null 返回漫游模式
  setFocused: (id) => set({ focusedId: id }),

  // 滚动会同时解除聚焦 —— “继续前行”即离开当前节点
  addScroll: (delta) =>
    set((s) => ({
      scroll: clamp01(s.scroll + delta),
      hasScrolled: true,
      focusedId: null,
    })),

  setScroll: (value) => set({ scroll: clamp01(value), hasScrolled: true }),
}));
