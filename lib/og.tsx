import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

const fraunces = readFileSync(
  join(process.cwd(), "public/fonts/Fraunces-LightItalic.ttf")
);

// Geist is optional — fall back to system-ui if the file isn't present.
let geist: Buffer | null = null;
try {
  geist = readFileSync(
    join(process.cwd(), "public/fonts/GeistSans-Regular.ttf")
  );
} catch {
  // system-ui fallback
}

const activeFonts: {
  name: string;
  data: Buffer;
  style: "italic" | "normal";
  weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
}[] = [{ name: "Fraunces", data: fraunces, style: "italic", weight: 300 }];
if (geist) {
  activeFonts.push({ name: "Geist", data: geist, style: "normal", weight: 400 });
}

const bodyFont = geist ? "Geist" : "system-ui";

export function buildOgImage(title: string, subtitle?: string): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#F5F2EC",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* AM monogram — top-left */}
        <div
          style={{
            fontFamily: "Fraunces",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: 36,
            color: "#1A1814",
            letterSpacing: "-0.5px",
          }}
        >
          AM
        </div>

        {/* Push title to lower half */}
        <div style={{ flex: 1 }} />

        {/* Title */}
        <div
          style={{
            fontFamily: "Fraunces",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: 72,
            color: "#1A1814",
            lineHeight: 1.0,
            letterSpacing: "-1px",
            maxWidth: "900px",
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        {subtitle ? (
          <div
            style={{
              fontFamily: bodyFont,
              fontSize: 28,
              color: "#6B6560",
              marginTop: "24px",
              fontWeight: 400,
            }}
          >
            {subtitle}
          </div>
        ) : null}

        {/* Byline — bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            right: "80px",
            fontFamily: bodyFont,
            fontSize: 20,
            color: "#6B6560",
            fontWeight: 400,
          }}
        >
          aurajeet mahapatra
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: activeFonts,
    }
  );
}
