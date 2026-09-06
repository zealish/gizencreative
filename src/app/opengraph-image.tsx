import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/seo/site-config";

export const alt = `${siteConfig.name} — Website, Social Media & SEO`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #134e4a 100%)",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 72, fontWeight: 700 }}>{siteConfig.name}</div>
      <div style={{ fontSize: 32, marginTop: 24, color: "#99f6e4" }}>
        Website Development · Social Media · SEO
      </div>
    </div>,
    size,
  );
}
