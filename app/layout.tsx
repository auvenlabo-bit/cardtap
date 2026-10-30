import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CardTap — ひとタップで渡せるデジタル名刺",
  description: "スマホで名刺を作成し、NFCにも登録しやすい短いURLでシェア。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
