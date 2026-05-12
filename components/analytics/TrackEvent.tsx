"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

interface TrackEventProps {
  event: string;
  properties?: Record<string, string>;
}

export function TrackEvent({ event, properties }: TrackEventProps) {
  useEffect(() => {
    track(event, properties);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
