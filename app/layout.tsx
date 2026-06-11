import type { Metadata } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const serif = Noto_Serif_TC({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://readie.ai"),
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
  authors: [{ name: "Marco Liu", url: "https://readie.ai" }],
  creator: "Marco Liu",
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "https://readie.ai",
    siteName: "Readie AI 導入顧問",
    title: "Readie — AI 導入顧問｜幫台灣中小企業真正用起來 AI",
    description:
      "不換系統、不買新軟體，從 LINE 開始。幫你找出第一件真正值得做的 AI 事。",
  },
  twitter: {
    card: "summary_large_image",
    title: "Readie — AI 導入顧問",
    description: "不換系統、不買新軟體，從 LINE 開始。",
  },
  alternates: {
    canonical: "https://readie.ai",
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
    <html lang="zh-TW" className={`${serif.variable} ${sans.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
