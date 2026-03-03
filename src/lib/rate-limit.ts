const LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

const requests = new Map<string, number[]>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

function pruneOldTimestamps(timestamps: number[]): number[] {
  const cutoff = Date.now() - WINDOW_MS;
  return timestamps.filter((t) => t > cutoff);
}

export function checkRateLimit(request: Request): { allowed: boolean; remaining: number } {
  const ip = getClientIp(request);
  const now = Date.now();

  let timestamps = requests.get(ip) ?? [];
  timestamps = pruneOldTimestamps(timestamps);

  if (timestamps.length >= LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  timestamps.push(now);
  requests.set(ip, timestamps);

  return { allowed: true, remaining: LIMIT - timestamps.length };
}
