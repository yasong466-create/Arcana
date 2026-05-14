"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { TarotCard as TarotCardType } from "@/types/tarot";
import { riderWaiteFaceUrlCandidates } from "@/lib/cardImage";
import { TarotCardSvgFace } from "@/components/TarotCardSvgFace";

function SinglePhotoAttempt({
  src,
  faceUp,
  onFail,
}: {
  src: string;
  faceUp: boolean;
  onFail: () => void;
}) {
  const [visible, setVisible] = useState(false);
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt=""
      className={`absolute inset-0 z-[1] h-full w-full object-cover [transform:translateZ(0)] transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      loading={faceUp ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      draggable={false}
      onLoad={() => setVisible(true)}
      onError={onFail}
    />
  );
}

function TarotPhotoOverlay({ urls, faceUp }: { urls: string[]; faceUp: boolean }) {
  const [idx, setIdx] = useState(0);
  if (idx >= urls.length) return null;
  const src = urls[idx];
  return (
    <SinglePhotoAttempt
      key={`${idx}-${src}`}
      src={src}
      faceUp={faceUp}
      onFail={() => setIdx((i) => i + 1)}
    />
  );
}

export function TarotCardVisual({
  card,
  faceUp,
  reversed,
  rare,
  compact,
}: {
  card: TarotCardType;
  faceUp: boolean;
  reversed: boolean;
  rare?: boolean;
  compact?: boolean;
}) {
  const box = compact ? "h-40 w-24 sm:h-48 sm:w-28" : "h-52 w-32 sm:h-64 sm:w-40";
  const candidates = useMemo(() => riderWaiteFaceUrlCandidates(card), [card]);

  return (
    <div key={card.id} className={`relative ${box}`} style={{ perspective: 1100 }}>
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{ rotateY: faceUp ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 72, damping: 15 }}
      >
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl border border-amber-200/25 bg-zinc-950 shadow-[0_0_40px_rgba(212,175,55,0.12)]"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(212,175,55,0.18),transparent_50%)]" />
          <div className="absolute inset-3 rounded-xl border border-amber-100/10" />
          <div className="absolute inset-0 flex items-center justify-center text-amber-100/70">
            <span className="text-3xl">☾</span>
          </div>
          {rare ? (
            <motion.div
              className="pointer-events-none absolute inset-0 bg-[conic-gradient(from_0deg,rgba(255,215,120,0.35),transparent,rgba(120,200,255,0.25),transparent)]"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          ) : null}
        </div>

        <div
          className="absolute inset-0 overflow-hidden rounded-2xl border border-amber-200/30 bg-zinc-950 shadow-[0_0_50px_rgba(99,102,241,0.18)]"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg) translateZ(1px)",
          }}
        >
          <div
            className="relative h-full w-full"
            style={{ transform: reversed ? "rotate(180deg)" : undefined }}
          >
            <TarotCardSvgFace card={card} reversed={reversed} />

            <TarotPhotoOverlay key={card.id} urls={candidates} faceUp={faceUp} />

            <div className="pointer-events-none absolute right-1 top-1 z-[2] rounded bg-black/55 px-1.5 py-0.5 text-[9px] font-medium text-amber-100/95 shadow-sm backdrop-blur-sm">
              {reversed ? "逆" : "正"}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
