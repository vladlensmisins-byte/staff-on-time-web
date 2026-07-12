import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 220,
          fontWeight: 800,
          letterSpacing: "-0.04em",
        }}
      >
        s<span style={{ color: "#D9A441" }}>.</span>
      </div>
    ),
    { ...size },
  );
}
