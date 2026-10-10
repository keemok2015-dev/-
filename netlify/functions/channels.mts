import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";

export default async () => {
  const map = (await getStore("config").get("channels", { type: "json" })) ?? {};
  return Response.json(map, { headers: { "cache-control": "public, max-age=60" } });
};
export const config: Config = { path: "/api/channels" };
