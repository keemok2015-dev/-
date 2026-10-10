import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";
import { isAdmin, safeEqual, signToken } from "../lib/auth";

export default async (req: Request) => {
  const path = new URL(req.url).pathname.replace("/api/admin/", "");

  if (path === "login" && req.method === "POST") {
    const { password } = await req.json().catch(() => ({}));
    if (typeof password === "string" && safeEqual(password, process.env.ADMIN_PASSWORD!))
      return Response.json({ token: signToken() });
    await new Promise((r) => setTimeout(r, 800));
    return new Response("unauthorized", { status: 401 });
  }

  if (!isAdmin(req)) return new Response("unauthorized", { status: 401 });
  const cfg = getStore("config");

  if (path === "stats") {
    const t: any = (await getStore("stats").get("totals", { type: "json" })) ?? { visits: 0, unique: 0, daily: {} };
    const subs = (await getStore("subs").list()).blobs.length;
    const rev: any[] = (await cfg.get("revenue", { type: "json" })) ?? [];
    const channels = (await cfg.get("channels", { type: "json" })) ?? {};
    return Response.json({
      visits: t.visits, unique: t.unique, daily: t.daily, subscribers: subs,
      revenue: rev, revenueTotal: rev.reduce((s, r) => s + r.amount, 0), channels,
    });
  }

  if (path === "channels" && req.method === "POST") {
    const map = await req.json();
    await cfg.setJSON("channels", map);
    return new Response("ok");
  }

  if (path === "revenue" && req.method === "POST") {
    const { amount, note } = await req.json();
    if (typeof amount !== "number") return new Response("bad", { status: 400 });
    const rev: any[] = (await cfg.get("revenue", { type: "json" })) ?? [];
    rev.push({ amount, note: String(note || ""), date: new Date().toISOString().slice(0, 10) });
    await cfg.setJSON("revenue", rev);
    return new Response("ok");
  }

  return new Response("not found", { status: 404 });
};
export const config: Config = { path: "/api/admin/*" };
