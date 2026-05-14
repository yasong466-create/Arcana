"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TAROT_DECK } from "@/data/deck";
import { localDateKey, stableIndex } from "@/lib/dailySeed";
import { getDailyDraw, setDailyDraw } from "@/lib/storage";
import { TarotCardVisual } from "@/components/TarotCardVisual";
import { ParticleField } from "@/components/ParticleField";
import { MouseAura } from "@/components/MouseAura";
import type { TarotCard } from "@/types/tarot";

type DailyState = { date: string; card: TarotCard; reversed: boolean };

export default function DailyPage() {
  const [state, setState] = useState<DailyState | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      const date = localDateKey();
      const cached = getDailyDraw();
      if (cached?.date === date) {
        const card = TAROT_DECK.find((c) => c.id === cached.cardId) ?? TAROT_DECK[0];
        setState({ date, card, reversed: cached.reversed });
        return;
      }
      const idx = stableIndex(`daily-${date}`, TAROT_DECK.length);
      const card = TAROT_DECK[idx];
      const reversed = stableIndex(`daily-rev-${date}`, 100) < 28;
      setDailyDraw({ date, cardId: card.id, reversed });
      setState({ date, card, reversed });
    });
  }, []);

  const line = state
    ? state.reversed
      ? state.card.reversedZh
      : state.card.uprightZh
    : "";

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#07060d] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.22),transparent_55%)]" />
      <ParticleField density={60} />
      <MouseAura />
      <header className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-8">
        <Link href="/" className="text-sm tracking-[0.25em] text-amber-100/80">
          ← 返回
        </Link>
      </header>
      <main className="relative z-10 mx-auto flex max-w-lg flex-col items-center gap-8 px-4 pb-20 pt-6 text-center">
        {!state ? (
          <p className="animate-pulse text-sm text-zinc-400">与今日星辰对齐中…</p>
        ) : (
          <>
            <div>
              <p className="text-xs tracking-[0.4em] text-amber-100/60">DAILY</p>
              <h1 className="mt-2 font-serif text-3xl text-amber-50">今日星辰牌</h1>
              <p className="mt-2 text-sm text-zinc-400">{state.date} · 本地每日一次</p>
            </div>
            <TarotCardVisual card={state.card} faceUp reversed={state.reversed} />
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-left backdrop-blur">
              <p className="text-xs text-amber-100/70">{state.reversed ? "逆位" : "正位"}</p>
              <p className="mt-2 font-serif text-xl text-amber-50">
                {state.card.nameZh} · {state.card.nameEn}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">{line}</p>
            </div>
            <Link
              href="/oracle"
              className="rounded-full border border-amber-200/30 px-6 py-2 text-sm text-amber-50 hover:bg-amber-200/10"
            >
              进行完整占卜 →
            </Link>
          </>
        )}
      </main>
    </div>
  );
}
