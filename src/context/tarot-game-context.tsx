"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { TAROT_DECK } from "@/data/deck";
import { ORACLE_THEMES } from "@/data/themes";
import { slotsForSpread } from "@/data/spreads";
import { prepareDeck, type ShuffledPhysicalCard } from "@/lib/shuffle";
import type { DrawnCard, InterpretationPayload, SpreadType } from "@/types/tarot";

type Phase = "theme" | "spread" | "question" | "shuffle" | "draw" | "result";

type GameCtx = {
  phase: Phase;
  setPhase: (p: Phase) => void;
  themeId: string | null;
  setThemeId: (id: string) => void;
  themeLabel: string;
  spread: SpreadType;
  setSpread: (s: SpreadType) => void;
  question: string;
  setQuestion: (q: string) => void;
  deck: ShuffledPhysicalCard[];
  reshuffle: () => void;
  draws: DrawnCard[];
  drawIndex: number;
  pickTopCard: () => void;
  reset: () => void;
  interpretation: InterpretationPayload | null;
  setInterpretation: (v: InterpretationPayload | null) => void;
  loadingAi: boolean;
  requestInterpretation: () => Promise<void>;
  rareGlow: boolean;
};

const Ctx = createContext<GameCtx | null>(null);

export function TarotGameProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("theme");
  const [themeId, setThemeId] = useState<string | null>(null);
  const [spread, setSpread] = useState<SpreadType>("single");
  const [question, setQuestion] = useState("");
  const [deck, setDeck] = useState<ShuffledPhysicalCard[]>(() =>
    prepareDeck(TAROT_DECK),
  );
  const [draws, setDraws] = useState<DrawnCard[]>([]);
  const [interpretation, setInterpretation] = useState<InterpretationPayload | null>(
    null,
  );
  const [loadingAi, setLoadingAi] = useState(false);
  const [rareGlow, setRareGlow] = useState(false);

  const themeLabel = useMemo(() => {
    return ORACLE_THEMES.find((t) => t.id === themeId)?.label || "未选择主题";
  }, [themeId]);

  const reshuffle = useCallback(() => {
    setDeck(prepareDeck(TAROT_DECK));
    setDraws([]);
    setInterpretation(null);
    setRareGlow(false);
  }, []);

  const reset = useCallback(() => {
    setPhase("theme");
    setThemeId(null);
    setSpread("single");
    setQuestion("");
    reshuffle();
  }, [reshuffle]);

  const pickTopCard = useCallback(() => {
    const slots = slotsForSpread(spread);
    if (draws.length >= slots.length) return;
    const next = deck[draws.length];
    if (!next) return;
    const slot = slots[draws.length];
    const d: DrawnCard = { card: next.card, reversed: next.reversed, slot };
    setDraws((prev) => [...prev, d]);
    /* rare shimmer ~1.5% */
    if (typeof crypto !== "undefined") {
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      if (buf[0] / 2 ** 32 < 0.015) setRareGlow(true);
    }
  }, [deck, spread, draws]);

  const requestInterpretation = useCallback(async () => {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          themeLabel,
          question,
          spread,
          cards: draws,
        }),
      });
      const data = (await res.json()) as InterpretationPayload;
      setInterpretation(data);
    } finally {
      setLoadingAi(false);
    }
  }, [draws, question, spread, themeLabel]);

  const value: GameCtx = {
    phase,
    setPhase,
    themeId,
    setThemeId,
    themeLabel,
    spread,
    setSpread,
    question,
    setQuestion,
    deck,
    reshuffle,
    draws,
    drawIndex: draws.length,
    pickTopCard,
    reset,
    interpretation,
    setInterpretation,
    loadingAi,
    requestInterpretation,
    rareGlow,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTarotGame(): GameCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTarotGame must be inside TarotGameProvider");
  return v;
}
