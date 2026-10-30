import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { cards } from "@/db/schema";
import { PublicCard } from "@/components/public-card";
import type { CardData, CardTheme } from "@/lib/card";

export default async function CardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [card] = await getDb().select().from(cards).where(eq(cards.id, id)).limit(1);

  if (!card) notFound();

  const data: CardData = {
    name: card.name,
    nameKana: card.nameKana,
    role: card.role,
    company: card.company,
    bio: card.bio,
    currentProjects: card.currentProjects,
    pastProjects: card.pastProjects,
    email: card.email,
    phone: card.phone,
    website: card.website,
    social: card.social,
    theme: card.theme as CardTheme,
    customColor: card.customColor,
  };

  return <PublicCard card={data} />;
}
