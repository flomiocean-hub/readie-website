import { ImageResponse } from "next/og";

export const alt = "Readie — AI 導入顧問｜幫台灣中小企業真正用起來 AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// satori 需要 TTF 字型資料；向 Google Fonts 抓「只含用到字元」的子集
async function loadGoogleFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family
  )}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+?)\) format\('(opentype|truetype)'\)/
  );
  if (!resource) throw new Error(`og-image font fetch failed: ${family}`);
  const res = await fetch(resource[1]);
  return res.arrayBuffer();
}

export default async function OgImage() {
  const headline = "你的公司導入 AI 了嗎？";
  const subline = "不換系統、不改習慣，從 LINE 開始。";
  const tag = "AI 導入顧問";
  const brand = "Readie.";
  const site = "readie.ai";

  const [serifData, sansData] = await Promise.all([
    loadGoogleFont("Noto Serif TC", 900, headline + brand),
    loadGoogleFont("Noto Sans TC", 400, subline + tag + site),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #223535 0%, #1C2B2B 60%)",
          color: "#FAF8F4",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "serif-tc",
              fontSize: 44,
              fontWeight: 900,
              display: "flex",
            }}
          >
            Readie
            <span style={{ color: "#D46B2F" }}>.</span>
          </div>
          <div
            style={{
              fontFamily: "sans-tc",
              fontSize: 22,
              letterSpacing: 8,
              opacity: 0.65,
            }}
          >
            {tag}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "serif-tc",
              fontSize: 84,
              fontWeight: 900,
              lineHeight: 1.25,
            }}
          >
            {headline}
          </div>
          <div
            style={{
              marginTop: 28,
              fontFamily: "sans-tc",
              fontSize: 32,
              color: "rgba(250,248,244,.78)",
            }}
          >
            {subline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              width: 220,
              height: 4,
              background: "#D46B2F",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              fontFamily: "sans-tc",
              fontSize: 24,
              opacity: 0.7,
            }}
          >
            {site}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "serif-tc", data: serifData, weight: 900, style: "normal" },
        { name: "sans-tc", data: sansData, weight: 400, style: "normal" },
      ],
    }
  );
}
