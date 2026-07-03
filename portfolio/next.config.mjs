/**
 * 两种运行形态：
 * - 默认：完整 Node.js 服务（本地开发 / Vercel），API 动态可用
 * - NEXT_OUTPUT_EXPORT=1：纯静态导出（GitHub Pages），
 *   页面与 API 全部在构建期固化为静态文件
 */
const isExport = process.env.NEXT_OUTPUT_EXPORT === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(isExport
    ? {
        output: "export",
        basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
