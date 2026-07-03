import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Espace Sémantique — Yuru Cui",
  description:
    "崔裕茹的个人语义空间：法式复古未来主义的 3D 星云，学业、职场与 AI 实践悬浮为空间中的节点。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh">
      <body className="font-mono antialiased">{children}</body>
    </html>
  );
}
