import "server-only";
import { headers } from "next/headers";

// Counts failed attempts in memory, per key, over a time window. The app
// runs as a single server process, so memory is enough; a restart clears it.

type Bucket = { count: number; resetAt: number };

const store = ((globalThis as { rateLimitStore?: Map<string, Bucket> }).rateLimitStore ??=
  new Map<string, Bucket>());

const live = (key: string) => {
  const bucket = store.get(key);
  if (bucket && bucket.resetAt <= Date.now()) {
    store.delete(key);
    return undefined;
  }
  return bucket;
};

// Minutes until the key may try again, or 0 if it isn't blocked
export const blockedFor = (key: string, limit: number) => {
  const bucket = live(key);
  return bucket && bucket.count >= limit
    ? Math.ceil((bucket.resetAt - Date.now()) / 60_000)
    : 0;
};

export const recordAttempt = (key: string, windowMinutes: number) => {
  const bucket = live(key);
  if (bucket) {
    bucket.count++;
  } else {
    store.set(key, { count: 1, resetAt: Date.now() + windowMinutes * 60_000 });
  }
  if (store.size > 5000) {
    for (const k of store.keys()) live(k);
  }
};

export const clearAttempts = (key: string) => {
  store.delete(key);
};

export const clientIp = async () => {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0].trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
};

export const waitMessage = (what: string, minutes: number) =>
  `Too many ${what}. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`;
