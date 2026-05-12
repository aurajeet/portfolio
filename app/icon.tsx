import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 13,
          color: "#1A1814",
          letterSpacing: "-0.5px",
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
