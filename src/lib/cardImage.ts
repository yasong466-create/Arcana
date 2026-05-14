import type { TarotCard } from "@/types/tarot";

/**
 * Rider–Waite 风格扫描图（JPEG），来自 metabismuth/tarot-json（cards 目录）。
 * @see https://github.com/metabismuth/tarot-json
 *
 * 旧源 nkappler/tarot/img/jpg 已 404，故迁移至此命名：m00–m21，w/c/s/p + 01–14。
 */

export const RW_UPSTREAM_BASES: readonly string[] = [
  "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards",
  "https://cdn.jsdelivr.net/gh/metabismuth/tarot-json@master/cards",
];

function customImageBase(): string | undefined {
  if (typeof process === "undefined") return undefined;
  const b = process.env.NEXT_PUBLIC_TAROT_IMAGE_BASE?.trim();
  return b ? b.replace(/\/$/, "") : undefined;
}

const MINOR_RANK_FILE: Record<string, string> = {
  Ace: "01",
  Two: "02",
  Three: "03",
  Four: "04",
  Five: "05",
  Six: "06",
  Seven: "07",
  Eight: "08",
  Nine: "09",
  Ten: "10",
  Page: "11",
  Knight: "12",
  Queen: "13",
  King: "14",
};

const SUIT_LETTER: Record<string, string> = {
  wands: "w",
  cups: "c",
  swords: "s",
  pentacles: "p",
};

/** 与 tarot-json 中 img 字段一致，如 m00.jpg、w01.jpg */
export function riderWaiteImageFile(card: TarotCard): string {
  if (card.arcana === "major") {
    return `m${String(card.index).padStart(2, "0")}.jpg`;
  }
  const letter = SUIT_LETTER[card.suit] ?? "w";
  const n = MINOR_RANK_FILE[card.rank ?? "Ace"] ?? "01";
  return `${letter}${n}.jpg`;
}

/**
 * 加载顺序：可选镜像 → 本地 public/cards → raw GitHub → jsDelivr → 同源代理
 */
export function riderWaiteFaceUrlCandidates(card: TarotCard): string[] {
  const file = riderWaiteImageFile(card);
  const custom = customImageBase();
  const remote = RW_UPSTREAM_BASES.map((b) => `${b}/${file}`);
  return [
    ...(custom ? [`${custom}/${file}`] : []),
    `/cards/${file}`,
    ...remote,
    `/api/card-image/${file}`,
  ];
}

export function riderWaiteFaceUrl(card: TarotCard): string {
  return riderWaiteFaceUrlCandidates(card)[0];
}
