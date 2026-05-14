"use client";

import { useId } from "react";
import type { TarotCard as TarotCardType } from "@/types/tarot";

const suitMark: Record<string, string> = {
  major: "秘",
  wands: "权",
  cups: "杯",
  swords: "剑",
  pentacles: "币",
};

const suitColor: Record<string, { a: string; b: string; stroke: string }> = {
  major: { a: "#5b21b6", b: "#1e1b4b", stroke: "#fbbf24" },
  wands: { a: "#9a3412", b: "#431407", stroke: "#fdba74" },
  cups: { a: "#075985", b: "#0c4a6e", stroke: "#7dd3fc" },
  swords: { a: "#475569", b: "#1e293b", stroke: "#e2e8f0" },
  pentacles: { a: "#166534", b: "#14532d", stroke: "#86efac" },
};

export function TarotCardSvgFace({
  card,
  reversed,
}: {
  card: TarotCardType;
  reversed: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const gId = `tg-${uid}`;
  const c = suitColor[card.suit] ?? suitColor.major;
  const mark = suitMark[card.suit] ?? "秘";
  const line1 = card.nameZh;
  const line2 = card.nameEn;
  const center =
    card.arcana === "major" ? (card.rank ? String(card.rank) : String(card.index)) : (card.rank ?? "");
  const zhSize = Math.max(11, 18 - Math.floor(line1.length / 2));
  const sub = `${card.arcana === "major" ? "大阿卡纳" : "小阿卡纳"} · ${reversed ? "逆位" : "正位"}`;

  return (
    <svg
      viewBox="0 0 200 320"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id={gId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.a} />
          <stop offset="100%" stopColor={c.b} />
        </linearGradient>
      </defs>
      <rect width="200" height="320" rx="14" fill={`url(#${gId})`} />
      <rect
        x="10"
        y="10"
        width="180"
        height="300"
        rx="10"
        fill="none"
        stroke={c.stroke}
        strokeWidth="1.2"
        opacity="0.55"
      />
      <rect
        x="16"
        y="16"
        width="168"
        height="288"
        rx="8"
        fill="none"
        stroke={c.stroke}
        strokeWidth="0.5"
        opacity="0.35"
      />
      <text
        x="100"
        y="38"
        textAnchor="middle"
        fill={c.stroke}
        fontSize="13"
        fontFamily="ui-serif, Georgia, serif"
        letterSpacing="0.35em"
        opacity="0.85"
      >
        {mark}
      </text>
      <circle cx="100" cy="88" r="36" fill="rgba(0,0,0,0.22)" stroke={c.stroke} strokeWidth="0.8" opacity="0.9" />
      <text
        x="100"
        y="96"
        textAnchor="middle"
        fill="#fefce8"
        fontSize="12"
        fontFamily="Georgia, 'Times New Roman', serif"
        opacity="0.95"
      >
        {center}
      </text>
      <text
        x="100"
        y="168"
        textAnchor="middle"
        fill="#fafafa"
        fontSize={zhSize}
        fontFamily="ui-serif, 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', serif"
      >
        {line1}
      </text>
      <text
        x="100"
        y="192"
        textAnchor="middle"
        fill={c.stroke}
        fontSize="9"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        opacity="0.9"
      >
        {line2.length > 24 ? `${line2.slice(0, 24)}…` : line2}
      </text>
      <text
        x="100"
        y="228"
        textAnchor="middle"
        fill="#e7e5e4"
        fontSize="8"
        fontFamily="system-ui, sans-serif"
        opacity="0.75"
      >
        {sub}
      </text>
      <text
        x="100"
        y="258"
        textAnchor="middle"
        fill="#d6d3d1"
        fontSize="7.5"
        fontFamily="system-ui, sans-serif"
        opacity="0.65"
      >
        {card.keywords.slice(0, 4).join(" · ")}
      </text>
      <text
        x="100"
        y="298"
        textAnchor="middle"
        fill={c.stroke}
        fontSize="7"
        fontFamily="ui-serif, serif"
        letterSpacing="0.5em"
        opacity="0.5"
      >
        ASTRA
      </text>
    </svg>
  );
}
