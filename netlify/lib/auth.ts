import { createHmac, timingSafeEqual } from "node:crypto";

const hmac = (key: string, v: string) => createHmac("sha256", key).update(v).digest();

export function safeEqual(a: string, b: string) {
  return timingSafeEqual(hmac("k", a), hmac("k", b));
}

export function signToken(ttlMs = 6 * 3600 * 1000) {
  const exp = String(Date.now() + ttlMs);
  return `${exp}.${hmac(process.env.SESSION_SECRET!, exp).toString("hex")}`;
}

export function isAdmin(req: Request) {
  const t = (req.headers.get("authorization") || "").replace("Bearer ", "");
  const [exp, sig] = t.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const good = hmac(process.env.SESSION_SECRET!, exp).toString("hex");
  return sig.length === good.length && safeEqual(sig, good);
}
