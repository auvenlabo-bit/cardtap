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

function isLightColor(hex: string) {
  const color = hex.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(color)) return false;
  const [r, g, b] = [0, 2, 4].map((index) => Number.parseInt(color.slice(index, index + 2), 16));
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}

export function CardVisual({ card, compact = false }: { card: CardData; compact?: boolean }) {
  const custom = card.theme === "custom";
  const lightCustom = custom && isLightColor(card.customColor);
  const theme = custom
    ? {
        shell: lightCustom ? "text-[#171717]" : "text-white",
        glow: "",
        avatar: lightCustom ? "text-white" : "text-[#171717]",
        muted: lightCustom ? "text-black/60" : "text-white/70",
        line: lightCustom ? "border-black/15" : "border-white/20",
        chip: lightCustom ? "bg-white/35 text-black border-black/10" : "bg-white/10 text-white border-white/15",
      }
    : themes[card.theme];
  const customAccent = lightCustom ? "#171717" : "#ffffff";
  return (
    <article
      className={`${theme.shell} relative isolate overflow-hidden rounded-[30px] shadow-[0_32px_80px_rgba(17,24,39,.24)] ${compact ? "min-h-[520px] p-7" : "min-h-[570px] p-8 sm:p-10"}`}
      style={custom ? { backgroundColor: card.customColor } : undefined}
    >
      <div
        className={`${theme.glow} absolute -right-24 -top-24 -z-10 h-64 w-64 rounded-full opacity-90 blur-[1px]`}
        style={custom ? { backgroundColor: customAccent, opacity: 0.24 } : undefined}
      />
      <div className="absolute -bottom-28 -left-16 -z-10 h-72 w-72 rounded-full border-[46px] border-white/8" />

      <div className="flex items-start justify-between">
        <div
          className={`${theme.avatar} grid h-20 w-20 place-items-center rounded-[24px] text-2xl font-bold tracking-tight shadow-lg`}
          style={custom ? { backgroundColor: customAccent } : undefined}
        >
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

      {(card.currentProjects || card.pastProjects) && (
        <div className={`mt-8 grid gap-5 border-t pt-6 ${theme.line}`}>
          {card.currentProjects && (
            <ProjectBlock label="Now / Next" title="現在・これから" text={card.currentProjects} muted={theme.muted} />
          )}
          {card.pastProjects && (
            <ProjectBlock label="Archive" title="これまでのプロジェクト" text={card.pastProjects} muted={theme.muted} />
          )}
        </div>
      )}

      <div className={`mt-8 grid gap-2 border-t pt-6 text-xs ${theme.line}`}>
        {card.email && <ContactLine icon={Mail} text={card.email} />}
        {card.phone && <ContactLine icon={Phone} text={card.phone} />}
        {card.website && <ContactLine icon={Globe2} text={card.website.replace(/^https?:\/\//, "")} />}
        {card.social && <ContactLine icon={AtSign} text={card.social.replace(/^@/, "")} />}
      </div>
    </article>
  );
}

function ProjectBlock({ label, title, text, muted }: { label: string; title: string; text: string; muted: string }) {
  return (
    <div>
      <p className={`text-[9px] font-bold uppercase tracking-[.2em] ${muted}`}>{label}</p>
      <p className="mt-1 text-xs font-bold">{title}</p>
      <p className={`mt-1.5 whitespace-pre-line text-xs leading-5 ${muted}`}>{text}</p>
    </div>
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
