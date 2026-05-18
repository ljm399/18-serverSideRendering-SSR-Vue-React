import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";

// next/font 会在构建/渲染时自动做字体优化：生成字体文件、自动 preload、并产出一个可复用的 className
// subsets 用来声明你需要的字符子集（越小越好），这里只加载 latin 子集
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 把 next/font 生成的 className 挂到 html（或 body）上：让全站都继承该字体
    <html lang="zh-CN" className={inter.className}>
      {/* App Router 的 layout 相当于“全局外壳”，children 就是当前匹配到的 page.tsx 渲染结果 */}
      <body>{children}</body>
    </html>
  );
}
