// AI Recruiter Bot — per-IP rate limiter.
//
// Per `AI Bot.md` §14: 20 messages per IP per 24-hour sliding window. The
// window is sliding (not fixed) so a recruiter who hits the cap at 11pm
// doesn't get the entire 20 back at midnight — they wait the full 24h
// from the offending request.
//
// ## Graceful no-op when env vars are missing
//
// The plan permits deploying the code before the Upstash instance is
// provisioned (see `AI Bot.md` §16). When `UPSTASH_REDIS_REST_URL` or
// `UPSTASH_REDIS_REST_TOKEN` is missing, this module returns a permissive
// `{ success: true }` response instead of throwing — so the chat route
// keeps working in local dev / preview deploys without Upstash. A single
// dev-only `console.warn` fires the first time the no-op path is taken,
// loud enough to flag the misconfiguration during build-out without
// spamming production logs.
//
// ## Singleton client
//
// The Upstash Redis + Ratelimit clients are constructed lazily on the
// first request and cached at module scope. Edge-runtime workers may
// reuse the same isolate across many requests; rebuilding the client
// per request would burn a TCP/TLS handshake we don't need to pay.

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitResult = {
  /** True if the request may proceed; false if the per-IP cap was hit. */
  success: boolean;
  /** How many requests the IP has remaining in its current window.
   *  Always 20 (the full cap) when the limiter is in no-op mode. */
  remaining: number;
  /** Unix-ms timestamp when the window resets. 0 in no-op mode. */
  reset: number;
};

const MAX_REQUESTS_PER_WINDOW = 20;
const WINDOW = "24 h" as const;
/** Namespace for keys in Redis — keeps the bot's keys distinct from any
 *  other rate-limited surface that ever lands in the same Upstash DB. */
const PREFIX = "ratelimit:bot";

let cachedLimiter: Ratelimit | null = null;
let warnedAboutMissingEnv = false;

/**
 * Lazily build the Upstash limiter. Returns null if either env var is
 * missing — the calling code treats that as "no-op, allow the request."
 *
 * Why we don't use `Redis.fromEnv()`: it throws when env vars are missing,
 * which would crash the route. Constructing manually lets us check the
 * vars first and bail cleanly.
 */
function getLimiter(): Ratelimit | null {
  if (cachedLimiter) return cachedLimiter;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    if (!warnedAboutMissingEnv && process.env.NODE_ENV !== "production") {
      // Single warning per process, dev only. Production stays silent —
      // the missing-vars state is intentional during early deploys, not
      // a per-request error worth logging.
      console.warn(
        "[bot/rate-limit] UPSTASH_REDIS_REST_URL or _TOKEN missing — " +
          "rate limiter is in no-op mode. All requests will pass.",
      );
      warnedAboutMissingEnv = true;
    }
    return null;
  }

  const redis = new Redis({ url, token });
  cachedLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(MAX_REQUESTS_PER_WINDOW, WINDOW),
    prefix: PREFIX,
    // Aggregate-only logging path; we don't need analytics on per-key
    // limit hits, the plan's analytics already captures messages/day at
    // a higher level. Keeping this off avoids extra Redis writes.
    analytics: false,
  });
  return cachedLimiter;
}

/**
 * Check whether a request from this IP can proceed. Always resolves —
 * never throws — so the chat route can call it without a try/catch.
 *
 * If Upstash is unreachable mid-request (network blip on the edge),
 * we fail open and let the request through rather than serving a 429
 * to a real recruiter. The cap is a soft abuse mitigation, not a
 * security boundary.
 */
export async function rateLimit(ip: string): Promise<RateLimitResult> {
  const limiter = getLimiter();
  if (!limiter) {
    return { success: true, remaining: MAX_REQUESTS_PER_WINDOW, reset: 0 };
  }

  try {
    const { success, remaining, reset } = await limiter.limit(ip);
    return { success, remaining, reset };
  } catch (err) {
    // Fail open. We log in dev so the misconfiguration / outage is
    // visible during build-out; production stays quiet.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[bot/rate-limit] Upstash limit() call failed:", err);
    }
    return { success: true, remaining: MAX_REQUESTS_PER_WINDOW, reset: 0 };
  }
}
