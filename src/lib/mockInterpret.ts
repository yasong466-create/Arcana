import type { DrawnCard, InterpretationPayload, SpreadType } from "@/types/tarot";
import { buildRuleInterpretation } from "@/lib/ruleInterpret";

export function mockInterpretation(
  theme: string,
  question: string,
  cards: DrawnCard[],
  spread: SpreadType = "single",
  themeId?: string | null,
): InterpretationPayload {
  const built = buildRuleInterpretation({
    themeLabel: theme,
    themeId,
    question,
    spread,
    cards,
  });

  return {
    overview: built.overview,
    perCard: built.perCard,
    synthesis: built.synthesis,
    love: built.love,
    career: built.career,
    action: built.action,
  };
}
