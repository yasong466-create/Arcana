"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ORACLE_THEMES } from "@/data/themes";
import { SPREAD_LABELS } from "@/data/spreads";
import { slotsForSpread } from "@/data/spreads";
import { useTarotGame } from "@/context/tarot-game-context";
import {
  playFlipSound,
  playShuffleTick,
  resumeAudio,
  startAmbientDrone,
  stopAmbientDrone,
} from "@/lib/audio";
import { saveHistory } from "@/lib/storage";
import { MouseAura } from "@/components/MouseAura";
import { ParticleField } from "@/components/ParticleField";
import { TarotCardVisual } from "@/components/TarotCardVisual";
import type { SpreadType } from "@/types/tarot";

const MUTE_KEY = "oracle_sound_muted";

export function OracleFlow() {
  const g = useTarotGame();
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    queueMicrotask(() => {
      setMuted(localStorage.getItem(MUTE_KEY) === "1");
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
    if (muted) stopAmbientDrone();
    else {
      void resumeAudio().then(() => startAmbientDrone());
    }
  }, [muted]);

  useEffect(() => {
    if (g.phase !== "shuffle") return;
    if (muted) return;
    const id = window.setInterval(() => {
      playShuffleTick();
    }, 220);
    return () => clearInterval(id);
  }, [g.phase, muted]);

  const slots = useMemo(() => slotsForSpread(g.spread), [g.spread]);
  const total = slots.length;
  const doneDraw = g.draws.length >= total;
  const stackPeek = g.deck[g.draws.length];

  const handlePick = () => {
    if (doneDraw) return;
    if (!muted) void resumeAudio().then(() => playFlipSound());
    g.pickTopCard();
  };

  const finishToResult = async () => {
    const summary =
      g.draws.map((d) => `${d.card.nameZh}${d.reversed ? "逆" : "正"}`).join("、") || "";
    g.setPhase("result");
    await g.requestInterpretation();
    saveHistory({
      id: `${Date.now()}`,
      at: Date.now(),
      theme: g.themeLabel,
      spread: g.spread,
      summary,
    });
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#07060d] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.22),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(212,175,55,0.12),transparent_50%)]" />
      <ParticleField density={85} />
      <MouseAura />

      <header className="relative z-20 flex items-center justify-between px-4 py-4 sm:px-8">
        <Link href="/" className="font-serif text-sm tracking-[0.25em] text-amber-100/80">
          ASTRA / 塔罗
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200 backdrop-blur"
          >
            {muted ? "开启氛围音" : "静音"}
          </button>
          <button
            type="button"
            onClick={() => g.reset()}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200 backdrop-blur"
          >
            重来
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-3xl flex-col gap-8 px-4 pb-24 pt-6 sm:px-6">
        <AnimatePresence mode="wait">
          {g.phase === "theme" ? (
            <motion.section
              key="theme"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              <div className="text-center">
                <p className="text-xs tracking-[0.4em] text-amber-100/60">RITUAL</p>
                <h1 className="mt-3 font-serif text-3xl text-amber-50 sm:text-4xl">
                  选择你的占卜主题
                </h1>
                <p className="mt-2 text-sm text-zinc-400">
                  像把一枚月亮投进井里——主题会改变牌面的回声。
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {ORACLE_THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => g.setThemeId(t.id)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      g.themeId === t.id
                        ? "border-amber-200/50 bg-amber-200/10"
                        : "border-white/10 bg-white/5 hover:border-amber-200/30"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-amber-100/90">
                      <span>{t.emoji}</span>
                      <span className="font-medium">{t.label}</span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-400">{t.sub}</p>
                  </button>
                ))}
                <motion.div
                  className="w-full pt-2 sm:col-span-2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <button
                    type="button"
                    disabled={!g.themeId}
                    onClick={() => g.setPhase("spread")}
                    className="mx-auto block w-full max-w-sm rounded-full bg-gradient-to-r from-amber-200/90 to-violet-200/90 py-3 text-center text-sm font-medium text-zinc-900 shadow-[0_0_40px_rgba(212,175,55,0.25)] disabled:opacity-40 sm:max-w-md"
                  >
                    继续
                  </button>
                </motion.div>
              </div>
            </motion.section>
          ) : null}

          {g.phase === "spread" ? (
            <motion.section
              key="spread"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="font-serif text-2xl text-amber-50">牌阵</h2>
                <p className="mt-2 text-sm text-zinc-400">越复杂的牌阵，越像把故事摊开。</p>
              </div>
              <div className="space-y-3">
                {(Object.keys(SPREAD_LABELS) as SpreadType[]).map((key) => {
                  const s = SPREAD_LABELS[key];
                  const disabled = s.comingSoon;
                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={disabled}
                      onClick={() => !disabled && g.setSpread(key)}
                      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left ${
                        disabled
                          ? "cursor-not-allowed border-white/5 bg-white/[0.02] opacity-50"
                          : g.spread === key
                            ? "border-amber-200/50 bg-amber-200/10"
                            : "border-white/10 bg-white/5 hover:border-amber-200/30"
                      }`}
                    >
                      <div>
                        <p className="font-medium text-zinc-100">{s.title}</p>
                        <p className="text-xs text-zinc-400">{s.desc}</p>
                      </div>
                      {disabled ? (
                        <span className="text-[10px] text-zinc-500">Soon</span>
                      ) : (
                        <span className="text-amber-100/70">✦</span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => g.setPhase("theme")}
                  className="flex-1 rounded-full border border-white/10 py-3 text-sm text-zinc-200"
                >
                  返回
                </button>
                <button
                  type="button"
                  onClick={() => g.setPhase("question")}
                  className="flex-1 rounded-full bg-gradient-to-r from-amber-200/90 to-violet-200/90 py-3 text-sm font-medium text-zinc-900"
                >
                  继续
                </button>
              </div>
            </motion.section>
          ) : null}

          {g.phase === "question" ? (
            <motion.section
              key="question"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-4"
            >
              <div className="text-center">
                <h2 className="font-serif text-2xl text-amber-50">轻轻说出你的问题</h2>
                <p className="mt-2 text-sm text-zinc-400">可以简短，也可以私密；留白亦可。</p>
              </div>
              <textarea
                value={g.question}
                onChange={(e) => g.setQuestion(e.target.value)}
                rows={5}
                placeholder="例如：我该如何与这段关系里的不确定共处？"
                className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-100 outline-none ring-amber-200/30 focus:ring"
              />
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => g.setPhase("spread")}
                  className="flex-1 rounded-full border border-white/10 py-3 text-sm"
                >
                  返回
                </button>
                <button
                  type="button"
                  onClick={() => {
                    g.reshuffle();
                    g.setPhase("shuffle");
                  }}
                  className="flex-1 rounded-full bg-gradient-to-r from-amber-200/90 to-violet-200/90 py-3 text-sm font-medium text-zinc-900"
                >
                  进入洗牌
                </button>
              </div>
            </motion.section>
          ) : null}

          {g.phase === "shuffle" ? (
            <motion.section
              key="shuffle"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="flex flex-col items-center gap-8 py-10"
            >
              <motion.div
                className="relative h-40 w-28 rounded-2xl border border-amber-200/30 bg-zinc-950 shadow-[0_0_60px_rgba(212,175,55,0.25)]"
                animate={{
                  y: [0, -6, 0],
                  rotateZ: [0, -2, 2, 0],
                }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_45%)]" />
                <div className="absolute inset-0 flex items-center justify-center text-4xl text-amber-100/80">
                  ✧
                </div>
              </motion.div>
              <div className="text-center">
                <h2 className="font-serif text-2xl text-amber-50">洗牌中</h2>
                <p className="mt-2 text-sm text-zinc-400">星尘在指缝间流动…</p>
              </div>
              <button
                type="button"
                onClick={() => g.setPhase("draw")}
                className="rounded-full bg-gradient-to-r from-amber-200/90 to-violet-200/90 px-10 py-3 text-sm font-medium text-zinc-900"
              >
                我准备好了
              </button>
            </motion.section>
          ) : null}

          {g.phase === "draw" ? (
            <motion.section
              key="draw"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="font-serif text-2xl text-amber-50">抽牌</h2>
                <p className="mt-2 text-sm text-zinc-400">
                  轻触牌堆顶端，依次揭开 {total} 张牌位。
                </p>
              </div>

              <div className="flex flex-col items-center gap-6">
                <motion.button
                  type="button"
                  onClick={handlePick}
                  disabled={doneDraw || !stackPeek}
                  whileHover={{ y: -4 }}
                  className="relative"
                >
                  {stackPeek ? (
                    <TarotCardVisual
                      card={stackPeek.card}
                      faceUp={false}
                      reversed={false}
                      rare={g.rareGlow && g.draws.length === 0}
                      compact
                    />
                  ) : (
                    <div className="h-40 w-24 rounded-2xl border border-white/10 bg-black/30 sm:h-48 sm:w-28" />
                  )}
                  <span className="mt-3 block text-center text-xs text-zinc-400">
                    {doneDraw ? "已完成抽牌" : "点击抽牌"}
                  </span>
                </motion.button>

                <div
                  className={
                    total === 1
                      ? "mx-auto grid max-w-xs gap-4"
                      : "grid w-full gap-4 sm:grid-cols-3"
                  }
                >
                  {slots.map((slot, idx) => {
                    const d = g.draws[idx];
                    return (
                      <div key={slot.id} className="flex flex-col items-center gap-2">
                        <p className="text-xs tracking-[0.2em] text-amber-100/70">
                          {slot.labelZh}
                        </p>
                        {d ? (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center gap-1"
                          >
                            <TarotCardVisual
                              card={d.card}
                              faceUp
                              reversed={d.reversed}
                              rare={g.rareGlow && idx === 0}
                              compact
                            />
                            <p className="text-[11px] text-zinc-400">
                              {d.reversed ? "逆位" : "正位"}
                            </p>
                          </motion.div>
                        ) : (
                          <div className="flex h-40 w-24 items-center justify-center rounded-2xl border border-dashed border-white/10 text-xs text-zinc-500 sm:h-48 sm:w-28">
                            等待
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex w-full justify-center px-2">
                <button
                  type="button"
                  disabled={!doneDraw}
                  onClick={() => void finishToResult()}
                  className="w-full max-w-xs rounded-full bg-gradient-to-r from-amber-200/90 to-violet-200/90 py-3 text-sm font-medium text-zinc-900 disabled:opacity-40"
                >
                  生成 AI 解读
                </button>
              </motion.div>
            </motion.section>
          ) : null}

          {g.phase === "result" ? (
            <motion.section
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="mx-auto max-w-xl text-center">
                <p className="text-xs tracking-[0.35em] text-amber-100/60">QUESTION · 所问</p>
                {g.question.trim() ? (
                  <h2 className="mt-3 whitespace-pre-wrap font-serif text-xl leading-snug text-amber-50 sm:text-2xl">
                    {g.question.trim()}
                  </h2>
                ) : (
                  <h2 className="mt-3 font-serif text-lg leading-relaxed text-zinc-400 sm:text-xl">
                    未填写具体问题；本次以主题「{g.themeLabel}」与牌阵为脉络解读。
                  </h2>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                {g.draws.map((d) => (
                  <div key={d.slot.id} className="flex flex-col items-center gap-2">
                    <p className="text-[11px] text-amber-100/70">{d.slot.labelZh}</p>
                    <TarotCardVisual
                      card={d.card}
                      faceUp
                      reversed={d.reversed}
                      rare={g.rareGlow}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur">
                {g.loadingAi ? (
                  <p className="animate-pulse text-sm text-zinc-300">神谕在编织中…</p>
                ) : g.interpretation ? (
                  <>
                    <div>
                      <h3 className="text-xs tracking-[0.3em] text-amber-100/70">总览</h3>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-200">
                        {g.interpretation.overview}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xs tracking-[0.3em] text-amber-100/70">逐张</h3>
                      {g.interpretation.perCard.map((p) => (
                        <div key={p.title} className="rounded-2xl bg-black/20 p-3">
                          <p className="text-xs text-amber-100/80">
                            {p.slot} · {p.title}
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-zinc-200">
                            {p.text}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h3 className="text-xs tracking-[0.3em] text-amber-100/70">综合</h3>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-200">
                        {g.interpretation.synthesis}
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl bg-black/20 p-3">
                        <p className="text-[11px] text-amber-100/70">情感</p>
                        <p className="mt-1 text-sm text-zinc-200">{g.interpretation.love}</p>
                      </div>
                      <div className="rounded-2xl bg-black/20 p-3">
                        <p className="text-[11px] text-amber-100/70">事业</p>
                        <p className="mt-1 text-sm text-zinc-200">{g.interpretation.career}</p>
                      </div>
                      <div className="rounded-2xl bg-black/20 p-3">
                        <p className="text-[11px] text-amber-100/70">行动</p>
                        <p className="mt-1 text-sm text-zinc-200">{g.interpretation.action}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-zinc-400">解读尚未返回。</p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={async () => {
                    const text = [
                      g.interpretation?.overview,
                      ...(g.interpretation?.perCard.map((p) => `${p.title}: ${p.text}`) ||
                        []),
                      g.interpretation?.synthesis,
                    ]
                      .filter(Boolean)
                      .join("\n\n");
                    try {
                      await navigator.clipboard.writeText(text || "");
                    } catch {
                      /* noop */
                    }
                  }}
                  className="flex-1 rounded-full border border-white/15 py-3 text-sm"
                >
                  复制解读
                </button>
                <button
                  type="button"
                  onClick={() => {
                    g.reset();
                    g.setPhase("theme");
                  }}
                  className="flex-1 rounded-full bg-gradient-to-r from-amber-200/90 to-violet-200/90 py-3 text-sm font-medium text-zinc-900"
                >
                  再抽一次
                </button>
              </div>
            </motion.section>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}
