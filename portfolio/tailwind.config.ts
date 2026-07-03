import type { Config } from "tailwindcss";

/**
 * Design system — « brume française » :
 * 低饱和、清冷、克制。所有颜色都压低了饱和度，
 * 命名沿用法语以保持整个项目的语汇一致。
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        encre: "#22252d", // 墨蓝黑 — 空间深处
        acier: "#4c586c", // 冷钢蓝
        brume: "#a7aeb9", // 雾灰
        os: "#e7e2d6", // 骨白（暖调的纸感白）
        poudre: "#c9a6a2", // 枯木粉
        rose: "#b98e8b", // 更深一档的枯玫瑰
        dore: "#d3c8a6", // 褪色金 — AI 版块点缀
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Didot", '"Songti SC"', "Georgia", "serif"],
        mono: ['"Space Grotesk"', '"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        vaste: "0.35em",
        air: "0.18em",
      },
    },
  },
  plugins: [],
};
export default config;
