import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Astra 塔罗 · 沉浸式占卜",
  description: "神秘、温柔、可分享的 Web 塔罗体验",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hans" className="h-full antialiased">
      <body className="min-h-full bg-[#07060d] text-zinc-100">{children}</body>
    </html>
  );
}
