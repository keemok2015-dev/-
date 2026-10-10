import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";

export default async (req: Request) => {
  if (req.method !== "POST") return new Response(null, { status: 405 });
  const { email } = await req.json().catch(() => ({}));
  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email) || email.length > 120)
    return new Response("invalid", { status: 400 });
  await getStore("subs").set(email.toLowerCase(), new Date().toISOString());
  return new Response("ok");
};
export const config: Config = { path: "/api/subscribe" };
