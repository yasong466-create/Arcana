import type { DrawnCard } from "@/types/tarot";

export type QuestionDomain =
  | "career"
  | "love"
  | "decision"
  | "growth"
  | "spirit"
  | "general";

const CAREER_RE =
  /offer|字节|面试|笔试|工作|求职|满意|升职|跳槽|薪资|入职|录用|实习|hr/i;
const LOVE_RE =
  /在一起|结婚|老公|老婆|男友|女友|找我|脱单|心里|喜欢|爱|感情|复合|分手|yfl/i;
const DECISION_RE = /会不会|能不能|能否|吗\s*$|吗？|是否/;

export function detectQuestionDomain(
  themeLabel: string,
  question: string,
  themeId?: string | null,
): QuestionDomain {
  const q = question.trim();
  const t = themeLabel;

  if (themeId === "career" || t.includes("事业")) return "career";
  if (themeId === "love" || t.includes("情感")) return "love";
  if (themeId === "decision" || t.includes("抉择")) return "decision";
  if (themeId === "growth" || t.includes("成长") || t.includes("疗愈")) return "growth";
  if (themeId === "spirit" || t.includes("灵性")) return "spirit";

  if (CAREER_RE.test(q)) return "career";
  if (LOVE_RE.test(q)) return "love";
  if (DECISION_RE.test(q)) return "decision";
  return "general";
}

export function orientationLabel(reversed: boolean): string {
  return reversed ? "逆位" : "正位";
}

/** 与用户示例一致：过去：太阳（正位） */
export function formatCardHeadline(d: DrawnCard): string {
  return `${d.slot.labelZh}：${d.card.nameZh}（${orientationLabel(d.reversed)}）`;
}

export function firstSentence(text: string): string {
  const s = text.split(/[。！？]/)[0]?.trim();
  return s ? `${s}。` : text;
}

const SLOT_NARRATIVE: Record<string, string> = {
  过去: "这里记录的是已经发生的惯性、旧剧本，以及仍在影响你的底色。",
  现在: "这是你此刻站着的地面：正在发生的选择、资源与情绪气候。",
  未来: "若沿当前节奏延展，能量最可能倾向的走向——仍可被你的行动改写。",
  核心讯息: "这张牌直接扣住你问题里最紧的那根弦。",
};

export function slotNarrative(label: string): string {
  return SLOT_NARRATIVE[label] ?? "此位置承载牌阵中的一个时间或面向。";
}

export function questionHook(domain: QuestionDomain, question: string): string {
  const q = question.trim();
  if (!q) return "我会把牌义落在你所选主题上，尽量具体到可感知的生活细节。";
  switch (domain) {
    case "career":
      return `就你问的「${truncate(q, 48)}」而言，牌在谈可见的推进、被看见的程度，以及心态是否拖后腿。`;
    case "love":
      return `就你问的「${truncate(q, 48)}」而言，牌在谈吸引、承诺、拉扯与安全感，而不是替对方下判决。`;
    case "decision":
      return `就你问的「${truncate(q, 48)}」而言，牌会给出倾向与条件，但选择权始终在你手里。`;
    default:
      return `你写下的「${truncate(q, 48)}」是这次解读的锚点，下面每张牌都会尽量扣住它。`;
  }
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

/** 把牌义接到问题语境（mock / 辅助 AI 的句式参考） */
export function bridgeCardToQuestion(
  d: DrawnCard,
  domain: QuestionDomain,
): string {
  const core = d.reversed ? d.card.reversedZh : d.card.uprightZh;
  const kw = d.card.keywords[0] ?? "流动";
  const name = d.card.nameZh;
  const ori = orientationLabel(d.reversed);

  if (domain === "career") {
    if (d.card.suit === "wands" || d.card.element === "fire") {
      return `在求职/职场语境里，${name}（${ori}）常对应节奏、行动力与「是否被看见」：${firstSentence(core)}`;
    }
    if (d.card.suit === "pentacles" || d.card.element === "earth") {
      return `落到现实层面，${name}（${ori}）在谈资源、专业度与可交换的价值：${firstSentence(core)}`;
    }
  }
  if (domain === "love") {
    if (d.card.suit === "cups" || d.card.element === "water") {
      return `在关系里，${name}（${ori}）多指向感受、依附与疗愈：${firstSentence(core)}`;
    }
    if (d.card.suit === "swords" || d.card.element === "air") {
      return `关系中的理性面被点亮：${name}（${ori}）提示沟通、边界或内在对话——${firstSentence(core)}`;
    }
  }
  return `${slotNarrative(d.slot.labelZh)} ${firstSentence(core)} 关键词「${kw}」可作为你复盘时的抓手。`;
}

export function spreadTimelineIntro(spread: string, count: number): string {
  if (spread === "three_past_present_future" && count === 3) {
    return "三张牌按时间线展开：先看已写进的惯性，再看当下气候，最后看延续时的可能走向。";
  }
  if (spread === "single" && count === 1) {
    return "单张牌把能量收束在一处，请把它当作此刻最诚实的镜子。";
  }
  return "请按牌阵位置顺序阅读，每一张都在回答你问题的不同切面。";
}
