import type { TarotCard } from "@/types/tarot";

/** Uniform float in [0,1) using crypto — stronger than Math.random for ritual UX */
export function secureUnit(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 2 ** 32;
}

export function fisherYates<T>(items: T[]): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(secureUnit() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Split deck into two halves and interleave with jitter — simulates riffle */
function riffleInterleave<T>(deck: T[]): T[] {
  if (deck.length < 4) return fisherYates(deck);
  const mid =
    Math.floor(deck.length / 2) +
    Math.floor((secureUnit() - 0.5) * 4); /* slight imperfect cut */
  const left = deck.slice(0, mid);
  const right = deck.slice(mid);
  const out: T[] = [];
  let i = 0;
  let j = 0;
  while (i < left.length || j < right.length) {
    const takeLeft =
      j >= right.length || (i < left.length && secureUnit() < 0.52 + secureUnit() * 0.08);
    if (takeLeft) out.push(left[i++]);
    else out.push(right[j++]);
  }
  return out;
}

/** Multi-pass casino-style mix: riffle × n + FY between passes */
export function ritualShuffle<T>(deck: T[], passes = 7): T[] {
  let d = deck.slice();
  for (let p = 0; p < passes; p++) {
    d = riffleInterleave(d);
    d = fisherYates(d);
  }
  return d;
}

export interface ShuffledPhysicalCard {
  card: TarotCard;
  reversed: boolean;
}

/** Assign upright / reversed with stable ~30% inversion rate */
export function assignReversals(cards: TarotCard[]): ShuffledPhysicalCard[] {
  return cards.map((card) => ({
    card,
    reversed: secureUnit() < 0.3,
  }));
}

export function prepareDeck(deck: TarotCard[]): ShuffledPhysicalCard[] {
  const mixed = ritualShuffle(deck, 8);
  return assignReversals(mixed);
}
