import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";

export default async (req: Request) => {
  if (req.method !== "POST") return new Response(null, { status: 405 });
  const { id } = await req.json().catch(() => ({}));
  if (typeof id !== "string" || id.length > 64) return new Response(null, { status: 400 });

  const stats = getStore("stats");
  const day = new Date().toISOString().slice(0, 10);
  const t: any = (await stats.get("totals", { type: "json" })) ?? { visits: 0, unique: 0, daily: {} };
  t.visits++;
  t.daily[day] = (t.daily[day] || 0) + 1;

  const seen = getStore("visitors");
  if (!(await seen.get(id))) {
    await seen.set(id, "1");
    t.unique++;
  }
  await stats.setJSON("totals", t);
  return new Response(null, { status: 204 });
};
export const config: Config = { path: "/api/track" };
