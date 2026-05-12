import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const font = readFileSync(
    join(process.cwd(), "public/fonts/Fraunces-LightItalic-static.ttf")
  );
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F5F2EC",
          fontFamily: "Fraunces",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: 72,
          color: "#1A1814",
          letterSpacing: "-1.5px",
        }}
      >
        AM
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Fraunces", data: font, style: "italic", weight: 300 }],
    }
  );
}
