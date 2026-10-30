import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { cards } from "@/db/schema";

const allowedOrigins = new Set([
  "https://auvenlabo-bit.github.io",
  "http://127.0.0.1:4173",
  "http://localhost:4173",
]);

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": allowedOrigins.has(origin)
      ? origin
      : "https://auvenlabo-bit.github.io",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

const payloadSchema = z.object({
  name: z.string().trim().min(1).max(60),
  nameKana: z.string().trim().max(80).default(""),
  role: z.string().trim().max(80).default(""),
  company: z.string().trim().max(80).default(""),
  bio: z.string().trim().max(180).default(""),
  currentProjects: z.string().trim().max(500).default(""),
  pastProjects: z.string().trim().max(500).default(""),
  email: z.string().trim().max(120).default(""),
  phone: z.string().trim().max(40).default(""),
  website: z.string().trim().max(180).default(""),
  social: z.string().trim().max(80).default(""),
  theme: z.enum(["cobalt", "ink", "sand", "custom"]).default("cobalt"),
  customColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#7c3aed"),
});

const alphabet = "23456789abcdefghjkmnpqrstuvwxyz";

function shortId() {
  const values = crypto.getRandomValues(new Uint8Array(7));
  return Array.from(values, (value) => alphabet[value % alphabet.length]).join("");
}

export async function POST(request: Request) {
  try {
    const parsed = payloadSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "入力内容を確認してください。" },
        { status: 400, headers: corsHeaders(request) },
      );
    }

    const id = shortId();
    await getDb().insert(cards).values({
      id,
      ...parsed.data,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { id, path: `/c/${id}` },
      { status: 201, headers: corsHeaders(request) },
    );
  } catch (error) {
    console.error("card_create_failed", error);
    return NextResponse.json(
      { error: "名刺を作成できませんでした。少し待ってからもう一度お試しください。" },
      { status: 500, headers: corsHeaders(request) },
    );
  }
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id")?.trim() ?? "";
  if (!/^[23456789abcdefghjkmnpqrstuvwxyz]{7}$/.test(id)) {
    return NextResponse.json(
      { error: "名刺IDを確認してください。" },
      { status: 400, headers: corsHeaders(request) },
    );
  }

  const [card] = await getDb().select().from(cards).where(eq(cards.id, id)).limit(1);
  if (!card) {
    return NextResponse.json(
      { error: "名刺が見つかりませんでした。" },
      { status: 404, headers: corsHeaders(request) },
    );
  }

  return NextResponse.json(card, { headers: corsHeaders(request) });
}

export function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}
