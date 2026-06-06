import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Readie — AI 導入顧問",
  description:
    "幫每家公司，準備好迎接下一個時代。不換系統、不買新軟體，從你們每天都在用的 LINE 開始。",
  openGraph: {
    title: "Readie — AI 導入顧問",
    description:
      "幫每家公司，準備好迎接下一個時代。不換系統、不買新軟體，從你們每天都在用的 LINE 開始。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
