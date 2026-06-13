const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

interface Record {
  count: number;
  lockedUntil: number | null;
}

const store = new Map<string, Record>();

function keyFor(email: string) {
  return email.trim().toLowerCase();
}

export function recordFailure(email: string): void {
  const key = keyFor(email);
  const rec = store.get(key) ?? { count: 0, lockedUntil: null };
  rec.count += 1;
  if (rec.count >= MAX_ATTEMPTS) {
    rec.lockedUntil = Date.now() + LOCKOUT_MS;
  }
  store.set(key, rec);
}

export function recordSuccess(email: string): void {
  store.delete(keyFor(email));
}

/** Returns remaining lockout ms (> 0) if locked, otherwise 0. */
export function checkLocked(email: string): number {
  const key = keyFor(email);
  const rec = store.get(key);
  if (!rec?.lockedUntil) return 0;
  const remaining = rec.lockedUntil - Date.now();
  if (remaining <= 0) {
    store.delete(key);
    return 0;
  }
  return remaining;
}
