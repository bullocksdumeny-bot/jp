/**
 * 登录失败限流。进程内 Map，重启即清空——serverless 上多实例还各算各的，
 * 挡不住有组织的分布式爆破。但它的目标只是让「拿字典慢慢试」变得不划算，
 * 配合 bcrypt 本身的计算成本已经够用。真正的防线是密码强度。
 */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 8;

type Bucket = { failures: number; windowStart: number };

const buckets = new Map<string, Bucket>();

function currentBucket(key: string): Bucket | null {
  const bucket = buckets.get(key);
  if (!bucket) return null;
  if (Date.now() - bucket.windowStart > WINDOW_MS) {
    buckets.delete(key);
    return null;
  }
  return bucket;
}

export function isLockedOut(key: string): boolean {
  return (currentBucket(key)?.failures ?? 0) >= MAX_FAILURES;
}

export function recordFailure(key: string): void {
  const bucket = currentBucket(key);
  if (bucket) {
    bucket.failures += 1;
  } else {
    buckets.set(key, { failures: 1, windowStart: Date.now() });
  }
}

export function clearFailures(key: string): void {
  buckets.delete(key);
}

export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}
