import type { Config } from "tailwindcss";

/**
 * Design system — « porcelaine » :
 * 浅色系、低饱和、清冷。瓷白底、冷墨字，
 * 玫瑰粉 / 雾蓝 / 褪金作为三个版块的点缀色。
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        fond: "#ece9e1", // 瓷白底
        ivoire: "#f7f4ed", // 象牙高光
        encre: "#3a3f4b", // 冷墨主文字
        gris: "#8b909c", // 雾灰次级文字
        rose: "#c4857c", // 玫瑰粉 · 学业
        bleu: "#7e97b8", // 雾蓝 · 职场
        dore: "#c0a35e", // 褪金 · AI
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
