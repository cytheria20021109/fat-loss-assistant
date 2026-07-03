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
        fond: "#f0ede6", // 瓷白底
        ivoire: "#faf7f1", // 象牙高光
        encre: "#3a3f4b", // 冷墨主文字
        gris: "#8b909c", // 雾灰次级文字
        rose: "#cf8d84", // 玫瑰粉 · 学业
        bleu: "#85a0c4", // 雾蓝 · 职场
        dore: "#c9a964", // 暖金 · AI
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
