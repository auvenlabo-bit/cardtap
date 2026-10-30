import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { cards } from "@/db/schema";

const payloadSchema = z.object({
  name: z.string().trim().min(1).max(60),
  nameKana: z.string().trim().max(80).default(""),
  role: z.string().trim().max(80).default(""),
  company: z.string().trim().max(80).default(""),
  bio: z.string().trim().max(180).default(""),
  email: z.string().trim().max(120).default(""),
  phone: z.string().trim().max(40).default(""),
  website: z.string().trim().max(180).default(""),
  social: z.string().trim().max(80).default(""),
  theme: z.enum(["cobalt", "ink", "sand"]).default("cobalt"),
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
      return NextResponse.json({ error: "入力内容を確認してください。" }, { status: 400 });
    }

    const id = shortId();
    await getDb().insert(cards).values({
      id,
      ...parsed.data,
      createdAt: new Date(),
    });

    return NextResponse.json({ id, path: `/c/${id}` }, { status: 201 });
  } catch (error) {
    console.error("card_create_failed", error);
    return NextResponse.json(
      { error: "名刺を作成できませんでした。少し待ってからもう一度お試しください。" },
      { status: 500 },
    );
  }
}
