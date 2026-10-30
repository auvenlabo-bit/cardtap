"use client";

import { useState } from "react";
import { Check, ContactRound, Copy, Mail, Nfc, Phone, Share2 } from "lucide-react";
import { CardVisual } from "@/components/card-visual";
import type { CardData } from "@/lib/card";
import { normalizeUrl } from "@/lib/card";

function escapeVCard(value: string) {
  return value.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
}

export function PublicCard({ card }: { card: CardData }) {
  const [copied, setCopied] = useState(false);

  const vCard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCard(card.name)}`,
    card.company && `ORG:${escapeVCard(card.company)}`,
    card.role && `TITLE:${escapeVCard(card.role)}`,
    card.email && `EMAIL;TYPE=INTERNET:${escapeVCard(card.email)}`,
    card.phone && `TEL;TYPE=CELL:${escapeVCard(card.phone)}`,
    card.website && `URL:${escapeVCard(normalizeUrl(card.website))}`,
    "END:VCARD",
  ].filter(Boolean).join("\r\n");
  const vCardHref = `data:text/vcard;charset=utf-8,${encodeURIComponent(vCard)}`;

  async function share() {
    const data = { title: `${card.name}｜${card.company}`, text: `${card.name}さんのデジタル名刺`, url: window.location.href };
    if (navigator.share) {
      await navigator.share(data);
      return;
    }
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="min-h-screen bg-[#e9e5dc] px-4 py-5 text-[#171717] sm:px-8 sm:py-10">
      <div className="mx-auto max-w-[520px]">
        <header className="mb-4 flex items-center justify-between px-1">
          <a href="/" className="flex items-center gap-2 text-sm font-extrabold tracking-[-.04em]">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#2356e8] text-[#b8ff4f]"><Nfc className="h-4 w-4" /></span>
            CardTap
          </a>
          <button type="button" onClick={share} className="flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3.5 py-2 text-xs font-bold transition hover:bg-white">
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
            {copied ? "コピー済み" : "シェア"}
          </button>
        </header>

        <CardVisual card={card} />

        <div className="mt-4 grid grid-cols-2 gap-3">
          <a
            href={vCardHref}
            download={`${card.name || "contact"}.vcf`}
            className="col-span-2 flex items-center justify-center gap-2.5 rounded-2xl bg-[#171717] px-5 py-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#2356e8]"
          >
            <ContactRound className="h-4 w-4" />連絡先に追加
          </a>
          {card.email && <a href={`mailto:${card.email}`} className="flex items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white/70 px-4 py-3.5 text-xs font-bold transition hover:bg-white"><Mail className="h-4 w-4" />メール</a>}
          {card.phone && <a href={`tel:${card.phone.replace(/[^\d+]/g, "")}`} className="flex items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white/70 px-4 py-3.5 text-xs font-bold transition hover:bg-white"><Phone className="h-4 w-4" />電話する</a>}
        </div>

        <div className="mt-7 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-black/35">Made with CardTap</p>
          <a href="/" className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#2356e8] hover:underline">
            <Copy className="h-3.5 w-3.5" />自分の名刺をつくる
          </a>
        </div>
      </div>
    </main>
  );
}
