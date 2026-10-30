import { AtSign, Globe2, Mail, Phone } from "lucide-react";
import type { CardData } from "@/lib/card";
import { initials } from "@/lib/card";

const themes = {
  cobalt: {
    shell: "bg-[#2356e8] text-white",
    glow: "bg-[#b8ff4f]",
    avatar: "bg-[#b8ff4f] text-[#173db2]",
    muted: "text-blue-100",
    line: "border-white/20",
    chip: "bg-white/12 text-white border-white/15",
  },
  ink: {
    shell: "bg-[#171717] text-white",
    glow: "bg-[#ff6a3d]",
    avatar: "bg-[#ff6a3d] text-white",
    muted: "text-stone-300",
    line: "border-white/15",
    chip: "bg-white/8 text-white border-white/12",
  },
  sand: {
    shell: "bg-[#eee7d7] text-[#17342f]",
    glow: "bg-[#0f766e]",
    avatar: "bg-[#0f766e] text-white",
    muted: "text-[#5c6f69]",
    line: "border-[#17342f]/15",
    chip: "bg-white/45 text-[#17342f] border-[#17342f]/10",
  },
} as const;

export function CardVisual({ card, compact = false }: { card: CardData; compact?: boolean }) {
  const theme = themes[card.theme];
  return (
    <article
      className={`${theme.shell} relative isolate overflow-hidden rounded-[30px] shadow-[0_32px_80px_rgba(17,24,39,.24)] ${compact ? "min-h-[520px] p-7" : "min-h-[570px] p-8 sm:p-10"}`}
    >
      <div className={`${theme.glow} absolute -right-24 -top-24 -z-10 h-64 w-64 rounded-full opacity-90 blur-[1px]`} />
      <div className="absolute -bottom-28 -left-16 -z-10 h-72 w-72 rounded-full border-[46px] border-white/8" />

      <div className="flex items-start justify-between">
        <div className={`${theme.avatar} grid h-20 w-20 place-items-center rounded-[24px] text-2xl font-bold tracking-tight shadow-lg`}>
          {initials(card.name)}
        </div>
        <span className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] ${theme.chip}`}>
          Digital card
        </span>
      </div>

      <div className="mt-14">
        <p className={`text-[11px] font-bold uppercase tracking-[.2em] ${theme.muted}`}>
          {card.nameKana || "YOUR NAME"}
        </p>
        <h2 className="mt-2 text-[clamp(2.4rem,8vw,4.1rem)] font-bold leading-[.95] tracking-[-.055em]">
          {card.name || "お名前"}
        </h2>
        <div className={`mt-5 border-t pt-5 ${theme.line}`}>
          <p className="text-base font-semibold">{card.role || "肩書き"}</p>
          <p className={`mt-1 text-sm ${theme.muted}`}>{card.company || "会社名・屋号"}</p>
        </div>
        {card.bio && <p className={`mt-7 max-w-sm text-sm leading-7 ${theme.muted}`}>{card.bio}</p>}
      </div>

      <div className={`mt-10 grid gap-2 border-t pt-6 text-xs ${theme.line}`}>
        {card.email && <ContactLine icon={Mail} text={card.email} />}
        {card.phone && <ContactLine icon={Phone} text={card.phone} />}
        {card.website && <ContactLine icon={Globe2} text={card.website.replace(/^https?:\/\//, "")} />}
        {card.social && <ContactLine icon={AtSign} text={card.social.replace(/^@/, "")} />}
      </div>
    </article>
  );
}

function ContactLine({ icon: Icon, text }: { icon: typeof Mail; text: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0 opacity-75" />
      <span className="truncate">{text}</span>
    </div>
  );
}
