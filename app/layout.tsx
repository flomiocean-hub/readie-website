import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://readie.tw"),
  title: "Readie — AI 導入顧問｜幫台灣中小企業真正用起來 AI",
  description:
    "Readie 是台灣 AI 導入顧問服務，創辦人 Marco Liu 擁有 19 年產業經驗。不換系統、不買新軟體，從 LINE 開始，幫中小企業找出第一件真正值得做的 AI 事。",
  keywords: [
    "AI 導入顧問",
    "台灣 AI 顧問",
    "中小企業 AI",
    "LINE Bot 建置",
    "AI 工作流程",
    "企業數位化",
    "Readie",
    "Marco Liu",
  ],
  authors: [{ name: "Marco Liu", url: "https://readie.tw" }],
  creator: "Marco Liu",
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "https://readie.tw",
    siteName: "Readie AI 導入顧問",
    title: "Readie — AI 導入顧問｜幫台灣中小企業真正用起來 AI",
    description:
      "不換系統、不買新軟體，從 LINE 開始。幫你找出第一件真正值得做的 AI 事。",
    images: [
      {
        url: "/marco.jpg",
        width: 1254,
        height: 1254,
        alt: "Marco Liu — Readie AI 導入顧問",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Readie — AI 導入顧問",
    description: "不換系統、不買新軟體，從 LINE 開始。",
    images: ["/marco.jpg"],
  },
  alternates: {
    canonical: "https://readie.tw",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
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
