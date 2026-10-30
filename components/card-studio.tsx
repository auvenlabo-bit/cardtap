"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Check, Copy, ExternalLink, Loader2, Nfc, Sparkles } from "lucide-react";
import { CardVisual } from "@/components/card-visual";
import { defaultCard, type CardData, type CardTheme } from "@/lib/card";

const themeOptions: Array<{ id: CardTheme; label: string; colors: string[] }> = [
  { id: "cobalt", label: "Cobalt", colors: ["#2356e8", "#b8ff4f"] },
  { id: "ink", label: "Ink", colors: ["#171717", "#ff6a3d"] },
  { id: "sand", label: "Sand", colors: ["#eee7d7", "#0f766e"] },
];

export function CardStudio() {
  const [card, setCard] = useState<CardData>(defaultCard);
  const [isCreating, setIsCreating] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const hostHint = useMemo(() => {
    if (shareUrl) return shareUrl.replace(/^https?:\/\//, "");
    return "tapme…/c/7文字";
  }, [shareUrl]);

  const update = (key: keyof CardData, value: string) => {
    setCard((current) => ({ ...current, [key]: value }));
    setShareUrl("");
    setError("");
  };

  async function createCard(event: FormEvent) {
    event.preventDefault();
    if (!card.name.trim()) {
      setError("お名前を入力してください。");
      return;
    }

    setIsCreating(true);
    setError("");
    try {
      const response = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(card),
      });
      const result = (await response.json()) as { path?: string; error?: string };
      if (!response.ok || !result.path) throw new Error(result.error || "名刺を作成できませんでした。");
      const url = new URL(result.path, window.location.origin).toString();
      setShareUrl(url);
      window.setTimeout(() => document.getElementById("share-result")?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "名刺を作成できませんでした。");
    } finally {
      setIsCreating(false);
    }
  }

  async function copyUrl() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="min-h-screen bg-[#f4f1ea] text-[#171717]">
      <header className="border-b border-black/10 bg-[#f4f1ea]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-5 py-4 sm:px-8">
          <a href="/" className="flex items-center gap-2.5" aria-label="CardTap ホーム">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#2356e8] text-[#b8ff4f] shadow-sm">
              <Nfc className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-[-.04em]">CardTap</span>
          </a>
          <div className="hidden items-center gap-5 text-xs font-semibold text-black/45 sm:flex">
            <Step active number="01" label="入力" />
            <span className="h-px w-8 bg-black/15" />
            <Step number="02" label="確認" />
            <span className="h-px w-8 bg-black/15" />
            <Step number="03" label="シェア" />
          </div>
          <span className="rounded-full border border-black/10 bg-white/55 px-3 py-1.5 text-[10px] font-bold tracking-wide text-black/50">
            FREE BETA
          </span>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1380px] lg:grid-cols-[minmax(0,1.05fr)_minmax(440px,.95fr)]">
        <section className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14 xl:px-20">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#2356e8]/15 bg-[#2356e8]/7 px-3 py-1.5 text-[11px] font-bold text-[#2356e8]">
              <Sparkles className="h-3.5 w-3.5" />
              3分で完成・アプリ不要
            </div>
            <h1 className="max-w-xl text-[clamp(2.8rem,6vw,5.2rem)] font-extrabold leading-[.94] tracking-[-.065em]">
              会った瞬間を、<br />つながりに変える。
            </h1>
            <p className="mt-6 max-w-lg text-sm leading-7 text-black/55 sm:text-base">
              あなたらしいデジタル名刺をつくって、短いURLでシェア。NFCタグにも、そのまま書き込めます。
            </p>
          </div>

          <form onSubmit={createCard} className="mt-12 max-w-2xl space-y-9">
            <fieldset>
              <legend className="mb-4 flex items-center gap-3 text-sm font-bold">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-black text-[10px] text-white">1</span>
                基本プロフィール
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="お名前" required value={card.name} onChange={(value) => update("name", value)} placeholder="山田 太郎" />
                <Field label="英字・ふりがな" value={card.nameKana} onChange={(value) => update("nameKana", value)} placeholder="TARO YAMADA" />
                <Field label="肩書き" value={card.role} onChange={(value) => update("role", value)} placeholder="Creative Director" />
                <Field label="会社名・屋号" value={card.company} onChange={(value) => update("company", value)} placeholder="Studio Ripple" />
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-xs font-bold text-black/55">ひとこと紹介</span>
                  <textarea
                    value={card.bio}
                    onChange={(event) => update("bio", event.target.value)}
                    maxLength={180}
                    rows={3}
                    className="w-full resize-none rounded-2xl border border-black/10 bg-white/65 px-4 py-3.5 text-sm outline-none transition placeholder:text-black/25 focus:border-[#2356e8] focus:bg-white focus:ring-4 focus:ring-[#2356e8]/10"
                    placeholder="どんな仕事をしているか、短く伝えましょう"
                  />
                </label>
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-4 flex items-center gap-3 text-sm font-bold">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-black text-[10px] text-white">2</span>
                連絡先
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="メール" type="email" value={card.email} onChange={(value) => update("email", value)} placeholder="hello@example.jp" />
                <Field label="電話番号" type="tel" value={card.phone} onChange={(value) => update("phone", value)} placeholder="090-1234-5678" />
                <Field label="Webサイト" value={card.website} onChange={(value) => update("website", value)} placeholder="example.jp" />
                <Field label="SNSアカウント" value={card.social} onChange={(value) => update("social", value)} placeholder="@username" />
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-4 flex items-center gap-3 text-sm font-bold">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-black text-[10px] text-white">3</span>
                カラーテーマ
              </legend>
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => update("theme", theme.id)}
                    className={`flex items-center justify-between rounded-2xl border p-3 text-left text-xs font-bold transition ${card.theme === theme.id ? "border-black bg-white shadow-sm" : "border-black/10 bg-white/45 hover:bg-white/75"}`}
                    aria-pressed={card.theme === theme.id}
                  >
                    <span className="flex -space-x-1">
                      {theme.colors.map((color) => <span key={color} className="h-5 w-5 rounded-full border-2 border-white" style={{ background: color }} />)}
                    </span>
                    <span className="hidden sm:inline">{theme.label}</span>
                    {card.theme === theme.id && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </fieldset>

            {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={isCreating}
              className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#171717] px-5 py-4 text-sm font-bold text-white shadow-[0_16px_35px_rgba(0,0,0,.18)] transition hover:-translate-y-0.5 hover:bg-[#2356e8] disabled:cursor-wait disabled:opacity-65 sm:w-auto sm:min-w-64"
            >
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {isCreating ? "名刺を作成中…" : "この内容で名刺をつくる"}
            </button>
          </form>
        </section>

        <aside className="border-t border-black/10 bg-[#e9e5dc] px-5 py-10 sm:px-8 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-l lg:border-t-0 lg:px-10 lg:py-12">
          <div className="mx-auto max-w-[490px]">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[11px] font-extrabold uppercase tracking-[.18em] text-black/45">Live preview</p>
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />自動保存</span>
            </div>
            <CardVisual card={card} compact />

            <div id="share-result" className={`mt-5 overflow-hidden rounded-3xl border transition-all ${shareUrl ? "border-[#2356e8]/25 bg-white shadow-[0_20px_45px_rgba(35,86,232,.12)]" : "border-black/10 bg-white/55"}`}>
              <div className="flex items-start gap-3 p-5">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${shareUrl ? "bg-[#b8ff4f] text-[#173db2]" : "bg-black/5 text-black/35"}`}>
                  <Nfc className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold">{shareUrl ? "シェアURLができました" : "NFC対応の短いURL"}</p>
                  <p className="mt-1 truncate font-mono text-[11px] text-black/45">{hostHint}</p>
                </div>
              </div>
              {shareUrl ? (
                <div className="grid grid-cols-[1fr_auto] border-t border-black/8">
                  <button type="button" onClick={copyUrl} className="flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-bold transition hover:bg-[#b8ff4f]/35">
                    {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    {copied ? "コピーしました" : "URLをコピー"}
                  </button>
                  <a href={shareUrl} target="_blank" rel="noreferrer" className="grid place-items-center border-l border-black/8 px-5 transition hover:bg-black/5" aria-label="名刺ページを開く">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ) : (
                <p className="border-t border-black/8 px-5 py-3 text-[10px] leading-5 text-black/45">名刺を作成すると、7文字のIDを使った短いURLが発行されます。</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Step({ number, label, active = false }: { number: string; label: string; active?: boolean }) {
  return <span className={`flex items-center gap-2 ${active ? "text-black" : "text-black/35"}`}><b className="font-mono text-[10px]">{number}</b>{label}</span>;
}

function Field({ label, value, onChange, placeholder, required = false, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; required?: boolean; type?: string }) {
  return (
    <label>
      <span className="mb-2 block text-xs font-bold text-black/55">{label}{required && <em className="ml-1 not-italic text-[#2356e8]">*</em>}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        maxLength={120}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-black/10 bg-white/65 px-4 py-3.5 text-sm outline-none transition placeholder:text-black/25 focus:border-[#2356e8] focus:bg-white focus:ring-4 focus:ring-[#2356e8]/10"
      />
    </label>
  );
}
