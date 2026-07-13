import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0E141C",
          color: "#EDEAE3",
          fontSize: 96,
          fontWeight: 800,
          letterSpacing: "-0.06em",
          fontFamily: "Georgia, Times New Roman, serif",
        }}
      >
        S<span style={{ color: "#D9A441", marginLeft: 1 }}>.</span>
      </div>
    ),
    { ...size },
  );
}
