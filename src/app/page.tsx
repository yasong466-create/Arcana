"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { loadHistory, type HistoryEntry } from "@/lib/storage";
import { ParticleField } from "@/components/ParticleField";
import { MouseAura } from "@/components/MouseAura";

export default function Home() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      setHistory(loadHistory());
    });
  }, []);

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(139,92,246,0.35),transparent_50%),radial-gradient(ellipse_at_80%_80%,rgba(212,175,55,0.15),transparent_45%)]" />
      <ParticleField density={100} />
      <MouseAura />

      <main className="relative z-10 mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6 pb-16 pt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-xs tracking-[0.55em] text-amber-100/55">LUNA · ORACLE</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[0.2em] text-amber-50 sm:text-5xl">
            ASTRA
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            在星尘与纸牌之间，取一段只属于此刻的回声。
            <br />
            洗牌、抽牌、翻牌——直到语言轻轻落下。
          </p>
        </motion.div>

        <motion.div
          className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          <Link
            href="/oracle"
            className="rounded-full bg-gradient-to-r from-amber-200/95 to-violet-200/90 px-10 py-3.5 text-sm font-medium text-zinc-900 shadow-[0_0_50px_rgba(212,175,55,0.25)]"
          >
            开始占卜
          </Link>
          <Link
            href="/daily"
            className="rounded-full border border-amber-200/25 px-10 py-3.5 text-sm text-amber-50/90 hover:bg-amber-200/5"
          >
            今日星辰牌
          </Link>
        </motion.div>

        {history.length > 0 ? (
          <motion.section
            className="mt-16 text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xs tracking-[0.35em] text-amber-100/50">最近神谕</h2>
            <ul className="mt-3 space-y-2">
              {history.slice(0, 5).map((h) => (
                <li
                  key={h.id}
                  className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 text-xs text-zinc-400"
                >
                  <span className="text-amber-100/80">{h.theme}</span> · {h.summary}
                </li>
              ))}
            </ul>
          </motion.section>
        ) : null}
      </main>
    </div>
  );
}
