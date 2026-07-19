import { buildOgImage } from "@/lib/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return buildOgImage("About", "Aurajeet Mahapatra · Product Manager");
}
