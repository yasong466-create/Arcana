/**
 * Tarot deck schema — extend by adding imageUrl assets or localization packs.
 */
export type TarotSuit = "major" | "wands" | "cups" | "swords" | "pentacles";

export type ElementAttr = "fire" | "water" | "air" | "earth" | "spirit";

export interface TarotCard {
  id: string;
  /** 0–21 major; minor uses suit+rank */
  index: number;
  arcana: "major" | "minor";
  suit: TarotSuit;
  rank?: string;
  nameZh: string;
  nameEn: string;
  uprightZh: string;
  reversedZh: string;
  keywords: string[];
  element: ElementAttr;
  /** Remote or static asset; may be empty for CSS-rendered faces */
  imageUrl: string;
}

export type SpreadType = "single" | "three_past_present_future" | "celtic_cross";

export interface SpreadSlot {
  id: string;
  labelZh: string;
  labelEn: string;
}

export interface DrawnCard {
  card: TarotCard;
  reversed: boolean;
  slot: SpreadSlot;
}

export interface ReadingSession {
  themeId: string;
  question: string;
  spread: SpreadType;
  draws: DrawnCard[];
  shuffledOrder: string[];
  createdAt: number;
}

export interface InterpretationPayload {
  overview: string;
  perCard: { slot: string; title: string; text: string }[];
  synthesis: string;
  love: string;
  career: string;
  action: string;
}
