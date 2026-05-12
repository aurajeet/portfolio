"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

interface TrackEventProps {
  event: string;
  properties?: Record<string, string | number | boolean | null | undefined>;
}

export function TrackEvent({ event, properties }: TrackEventProps) {
  useEffect(() => {
    track(event, properties);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
