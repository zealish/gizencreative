import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { waClick } from "@/lib/db/schema";

const VALID_SOURCES = new Set([
  "floating-button",
  "cta-home",
  "cta-about",
  "cta-contact",
  "contact-channel",
  "footer",
]);

export async function POST(request: Request) {
  let body: { source?: unknown; path?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const source = typeof body.source === "string" ? body.source : "";
  const path = typeof body.path === "string" ? body.path.slice(0, 256) : "";

  if (!VALID_SOURCES.has(source) || !path.startsWith("/")) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await db.insert(waClick).values({
    id: randomUUID(),
    source,
    path,
    userAgent: request.headers.get("user-agent")?.slice(0, 512) ?? null,
    referrer: request.headers.get("referer")?.slice(0, 512) ?? null,
  });

  return NextResponse.json({ ok: true });
}
