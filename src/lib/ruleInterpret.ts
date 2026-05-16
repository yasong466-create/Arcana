import type { DrawnCard, SpreadType, TarotCard } from "@/types/tarot";
import {
  detectQuestionDomain,
  firstSentence,
  formatCardHeadline,
  questionHook,
  spreadTimelineIntro,
  type QuestionDomain,
} from "@/lib/interpretStyle";

const POSITIVE_HINT =
  /胜利|丰盛|和谐|成功|喜悦|希望|完成|显化|认可|拓展|启程|信任|疗愈|平衡|满足|好消息|机会|热情|清晰|勇气|自由|庆祝|稳定|合作|成长|灵感|显化|连结|温柔|支持|开放|推进|顺利|肯定|收获|光明|复原|和解|吸引|承诺|真实|显才|被看见|富足|欢庆|归属|进展|火种|流动|整合|觉醒|奇迹|愿望|宁静|满足|公平|公正|诚实|真相|洞察|智慧|引导|祝福|恩典|圆满|完成|实现|达成|好转|回升|回暖|回暖|回暖/;
const NEGATIVE_HINT =
  /冲突|结束|延迟|恐惧|失去|僵化|逃避|破裂|背叛|孤独|压抑|停滞|混乱|灾难|打击|失败|否定|怀疑|分散|误用|枯竭|依赖|控制|执念|诱惑|束缚|伤害|焦虑|失眠|担忧|拖延|回避|内伤|争赢|失人心|鲁莽|悬崖|噪音|秘密失衡|过度|匮乏|冷漠|疏离|冷战|误解|争吵|分手|结束|崩塌|突变|意外|伤痛|悲伤|痛苦|绝望|困境|阻碍|卡点|限制|束缚|陷阱|阴影|恐惧|不安|犹豫|摇摆|落空|改主意|信息不足|抢功|摩擦|负担|不合|骄傲反噬|自我否定|迟来|争赢/;

function excerpt(text: string, sentences = 2): string {
  const parts = text.split(/[。！？]/).map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return text;
  const take = parts.slice(0, sentences).join("。");
  return take.endsWith("。") ? take : `${take}。`;
}

function activeMeaning(d: DrawnCard): string {
  return d.reversed ? d.card.reversedZh : d.card.uprightZh;
}

function passiveMeaning(d: DrawnCard): string {
  return d.reversed ? d.card.uprightZh : d.card.reversedZh;
}

function scorePolarity(text: string): number {
  let s = 0;
  for (const m of text.matchAll(new RegExp(POSITIVE_HINT.source, "g"))) {
    if (m[0]) s += 1;
  }
  for (const m of text.matchAll(new RegExp(NEGATIVE_HINT.source, "g"))) {
    if (m[0]) s -= 1;
  }
  return s;
}

function cardPolarity(d: DrawnCard): number {
  const base =
    scorePolarity(activeMeaning(d)) +
    d.card.keywords.reduce((n, k) => n + scorePolarity(k), 0);
  return d.reversed ? base - 0.6 : base;
}

function slotOpening(d: DrawnCard): string {
  const ori = d.reversed ? "逆位" : "正位";
  const name = d.card.nameZh;
  const bySlot: Record<string, string> = {
    过去: `在「过去」位，${name}（${ori}）描述你已经历、却仍残留在身体里的惯性：`,
    现在: `在「现在」位，${name}（${ori}）对准你此刻站着的地面——正在发生的选择与情绪气候：`,
    未来: `在「未来」位，${name}（${ori}）提示若维持当下节奏，能量较可能延展的方向（仍可被行动改写）：`,
    核心讯息: `作为核心回应，${name}（${ori}）直接扣住问题最紧的那根弦：`,
  };
  return bySlot[d.slot.labelZh] ?? `在「${d.slot.labelZh}」位，${name}（${ori}）表示：`;
}

function suitDomainLine(d: DrawnCard, domain: QuestionDomain, question: string): string {
  const q = question.trim();
  const qLead = q ? `联系你所问的「${q.length > 32 ? `${q.slice(0, 32)}…` : q}」，` : "";
  const suit = d.card.suit;

  const career: Record<string, string> = {
    wands: "职场里多谈推进节奏、能见度、是否敢举手争取",
    cups: "这里偏团队氛围、归属感与「这份工作是否让你心安」",
    swords: "指向决策压力、沟通成本、考核/面试中的理性博弈",
    pentacles: "落在 offer、薪资、技能兑现、资源与可交换价值",
    major: "大牌把课题抬到人生层面，仍会折射到你的职业叙事",
  };
  const love: Record<string, string> = {
    wands: "关系里的吸引、主动与热情节奏",
    cups: "感受、依附、疗愈与情绪诚实",
    swords: "沟通、边界、误会或内在对话",
    pentacles: "承诺、现实安排、共同生活与安全感",
    major: "关系的人生课题：命运感、转折或深层吸引",
  };
  const decision: Record<string, string> = {
    wands: "若选 A/B，哪边更能点燃行动力与可见进展",
    cups: "哪边更贴合情绪安全与真实连结",
    swords: "哪边更清、更少内耗，或需补信息再定",
    pentacles: "哪边更稳、更可持续、资源更匹配",
    major: "抉择背后的价值与身份认同，而非表面利弊",
  };
  const growth: Record<string, string> = {
    wands: "勇气、边界与把阴影转成行动",
    cups: "情绪整合、自我慈悲与关系模式",
    swords: "信念、叙事与对自己说的话",
    pentacles: "身体、习惯与把疗愈落到日常",
    major: "生命周期课题：旧我脱落与新我成形",
  };
  const spirit: Record<string, string> = {
    wands: "灵感征兆、召唤与是否回应内在火焰",
    cups: "梦境、共感与灵魂层面的情绪讯息",
    swords: "清晰洞见、符号与理性拆解神秘",
    pentacles: "物质世界里的神圣感、仪式与扎根",
    major: "原型与命运主题：此牌常带强烈象征",
  };

  const pick = (map: Record<string, string>) => {
    const key = suit === "major" ? "major" : suit;
    return map[key] ?? map.major;
  };

  let focus = "";
  switch (domain) {
    case "career":
      focus = pick(career);
      break;
    case "love":
      focus = pick(love);
      break;
    case "decision":
      focus = pick(decision);
      break;
    case "growth":
      focus = pick(growth);
      break;
    case "spirit":
      focus = pick(spirit);
      break;
    default:
      focus =
        suit === "major"
          ? "此大牌把问题抬到更深层的人生主题"
          : `小阿卡纳「${suitMetaZh(suit)}」系在谈${suitTheme(suit)}`;
  }
  return `${qLead}${focus}。`;
}

function suitMetaZh(suit: TarotCard["suit"]): string {
  const m: Record<string, string> = {
    wands: "权杖",
    cups: "圣杯",
    swords: "宝剑",
    pentacles: "星币",
    major: "大阿卡纳",
  };
  return m[suit] ?? suit;
}

function suitTheme(suit: TarotCard["suit"]): string {
  const m: Record<string, string> = {
    wands: "意志、行动与热情",
    cups: "情感、关系与直觉",
    swords: "思想、真相与决断",
    pentacles: "资源、身体与长期积累",
    major: "灵魂课题与转折",
  };
  return m[suit] ?? "当下主题";
}

const MAJOR_NUANCE: Partial<Record<string, string>> = {
  恶魔: "常指强烈吸引、执念或难以放手的联结，未必等于传统意义上的细水长流伴侣；留意是否过度依赖。",
  塔: "突变、旧结构崩塌；多是「震醒」而非单纯坏事，逼你看清真相。",
  死神: "结束与重生并存，谈的是阶段更替，而非字面死亡。",
  月亮: "迷雾、投射与潜意识恐惧；宜慢下来核实事实，少脑补。",
  太阳: "明朗、被看见、恢复活力；问结果时多偏积极，但仍需现实步骤配合。",
  恋人: "选择与价值对齐；问感情时强调「是否真心想要这种联结」。",
  正义: "因果、公平与边界；问对错/是否该做时，强调责任与诚实沟通。",
  隐者: "独处、内省与延迟答复；不是拒绝，而是需要更多时间整理。",
  倒吊人: "暂停、换位思考；急不得，换角度后答案会自己浮现。",
  命运之轮: "周期转折；局势在变，抓住能控制的环节即可。",
  星星: "疗愈与希望回归；适合在受挫后重建信心。",
  世界: "阶段完成、闭环；问「能不能成」时常指向「可以收尾或进入下一章」。",
};

function majorNuance(nameZh: string): string {
  return MAJOR_NUANCE[nameZh] ? ` ${MAJOR_NUANCE[nameZh]}` : "";
}

export function composeCardReading(
  d: DrawnCard,
  domain: QuestionDomain,
  question: string,
): string {
  const active = activeMeaning(d);
  const passive = passiveMeaning(d);
  const kws = d.card.keywords.join("、");

  const parts = [
    slotOpening(d),
    excerpt(active, 2),
    suitDomainLine(d, domain, question),
    `关键词可作复盘抓手：${kws}。`,
    d.reversed
      ? `逆位在提醒你检视另一面向：${excerpt(passive, 1)}`
      : `若感到阻滞，可参考逆位意象：${excerpt(passive, 1)}`,
  ];
  if (d.card.arcana === "major") parts.push(majorNuance(d.card.nameZh));
  return parts.join("");
}

function dominantElement(cards: DrawnCard[]): string | null {
  const count: Record<string, number> = {};
  for (const c of cards) {
    const e = c.card.element;
    count[e] = (count[e] ?? 0) + 1;
  }
  let best: string | null = null;
  let max = 0;
  for (const [e, n] of Object.entries(count)) {
    if (n > max) {
      max = n;
      best = e;
    }
  }
  return max >= 2 ? best : null;
}

const ELEMENT_ZH: Record<string, string> = {
  fire: "火（行动、意志）",
  water: "水（情绪、关系）",
  air: "风（思想、沟通）",
  earth: "土（资源、身体）",
  spirit: "灵（课题、转折）",
};

function buildSynergy(cards: DrawnCard[], spread: SpreadType): string {
  if (cards.length === 0) return "";

  const lines: string[] = ["牌与牌之间："];

  if (spread === "three_past_present_future" && cards.length === 3) {
    const [past, now, future] = cards;
    lines.push(
      `时间线读来像一条河——${past.slot.labelZh}的「${past.card.nameZh}」${firstSentence(activeMeaning(past))} 这是河床；` +
        `${now.slot.labelZh}的「${now.card.nameZh}」${firstSentence(activeMeaning(now))} 这是你此刻踩的水温；` +
        `${future.slot.labelZh}的「${future.card.nameZh}」${firstSentence(activeMeaning(future))} 这是水面最可能倾向的方向。`,
    );
    if (past.card.element !== future.card.element) {
      lines.push(
        `从 ${ELEMENT_ZH[past.card.element] ?? past.card.element} 走向 ${ELEMENT_ZH[future.card.element] ?? future.card.element}，内在可能有「${past.card.keywords[0]}」与「${future.card.keywords[0]}」两种声音在谈判，不是矛盾，而是不同阶段的重点切换。`,
      );
    }
  } else if (cards.length >= 2) {
    const names = cards.map((c) => `「${c.card.nameZh}」`).join("、");
    const sameSuit = cards.every((c) => c.card.suit === cards[0].card.suit);
    if (sameSuit && cards[0].card.suit !== "major") {
      lines.push(
        `${names} 同属${suitMetaZh(cards[0].card.suit)}，主题被反复强调——请认真看待「${cards[0].card.keywords[0]}」这条线，它几乎是本次占卜的主旋律。`,
      );
    } else {
      lines.push(
        `${names} 并列时，先看它们是互相加强同一主题，还是在拉扯两个内在声音：${cards.map((c) => `${c.card.nameZh}（${c.card.keywords.slice(0, 2).join("/")}）`).join(" vs ")}。`,
      );
    }
  }

  const dom = dominantElement(cards);
  if (dom) {
    lines.push(`牌组中 ${ELEMENT_ZH[dom] ?? dom} 元素出现较密，整体气质会偏这一面向。`);
  }

  const rev = cards.filter((c) => c.reversed).length;
  if (rev === cards.length && cards.length > 0) {
    lines.push("全部为逆位：不是「坏兆」，而是内在阻滞、未消化课题或时机未到，宜先整理再求结果。");
  } else if (rev === 0) {
    lines.push("全部为正位：能量相对直白，牌义可按字面意象理解，但仍需结合你的现实选择。");
  }

  return lines.join("");
}

type Tendency = "yes" | "no" | "wait" | "mixed";

function aggregateTendency(cards: DrawnCard[]): Tendency {
  if (cards.length === 0) return "mixed";
  const total = cards.reduce((s, c) => s + cardPolarity(c), 0);
  const avg = total / cards.length;
  const waitCards = cards.some(
    (c) =>
      c.card.nameZh === "隐者" ||
      c.card.nameZh === "倒吊人" ||
      c.card.nameZh === "月亮" ||
      (c.reversed && cardPolarity(c) < 0),
  );
  if (waitCards && avg < 1.2) return "wait";
  if (avg >= 1) return "yes";
  if (avg <= -0.8) return "no";
  return "mixed";
}

function buildConclusion(
  domain: QuestionDomain,
  question: string,
  cards: DrawnCard[],
  themeLabel: string,
): { conclusion: string; reminder?: string } {
  const last = cards[cards.length - 1];
  const lastMeaning = last ? activeMeaning(last) : "";
  const names = cards.map((c) => c.card.nameZh).join("、");
  const tendency = aggregateTendency(cards);

  const reminders: string[] = [];
  if (cards.some((c) => c.card.suit === "swords" && /九|十/.test(c.card.nameZh))) {
    reminders.push(
      "宝剑九/十类意象常与忧虑、失眠、反复脑补相关：请把焦虑当作信号去处理，而不是当作预言。",
    );
  }
  const devil = cards.find((c) => c.card.nameZh === "恶魔");
  if (devil) reminders.push(MAJOR_NUANCE["恶魔"]!);

  let conclusion = "";

  if (domain === "decision" && /会不会|能不能|能否|是否|吗/.test(question)) {
    const tMap: Record<Tendency, string> = {
      yes: "倾向「可以推进/更靠近肯定」，但请用最后一张牌核对细节",
      no: "倾向「暂缓或先处理阻滞再定」，并非永久否定",
      wait: "倾向「时机未到，先补信息或整理情绪」",
      mixed: "倾向「两面并存，没有非黑即白的一刀切答案」",
    };
    conclusion = `结论：${tMap[tendency]}。牌组（${names}）中，${last ? `尤以「${last.slot.labelZh}」的「${last.card.nameZh}」为落点：${excerpt(lastMeaning, 2)}` : excerpt(lastMeaning, 2)}`;
  } else if (domain === "career") {
    const chain = cards
      .map(
        (c) =>
          `${c.slot.labelZh}「${c.card.nameZh}」${firstSentence(activeMeaning(c))}`,
      )
      .join(" ");
    conclusion = `结论（事业向）：牌（${names}）——${chain} ${last ? `收束在「${last.card.nameZh}」：${excerpt(lastMeaning, 2)}` : ""}`;
  } else if (domain === "love") {
    conclusion = `结论（情感向）：${cards
      .map(
        (c) =>
          `${c.slot.labelZh}「${c.card.nameZh}」${c.reversed ? "逆位" : "正位"}——${firstSentence(activeMeaning(c))}`,
      )
      .join(" ")} ${last ? `目前能量最落在「${last.card.nameZh}」的意象上：${excerpt(lastMeaning, 2)}` : ""}`;
  } else {
    const chain = cards
      .map(
        (c) =>
          `${c.slot.labelZh}「${c.card.nameZh}」${firstSentence(activeMeaning(c))}`,
      )
      .join(" ");
    conclusion = `结论（主题「${themeLabel}」）：${chain} ${last ? `以「${last.card.nameZh}」收束：${excerpt(lastMeaning, 2)}` : ""}`;
  }

  if (question.trim()) {
    conclusion = conclusion.replace(/^结论[^：]*/, (m) =>
      m.includes("（") ? m : `${m}（回应「${question.trim().slice(0, 36)}${question.length > 36 ? "…" : ""}」）`,
    );
  }

  return {
    conclusion,
    reminder: reminders.length ? reminders.join("\n") : undefined,
  };
}

function buildThemedSection(
  cards: DrawnCard[],
  domain: QuestionDomain,
  kind: "love" | "career",
): string {
  const isLove = kind === "love";
  const match = cards.filter((c) => {
    if (isLove) return c.card.element === "water" || c.card.suit === "cups";
    return c.card.suit === "wands" || c.card.suit === "pentacles";
  });
  const pool = match.length > 0 ? match : cards;
  const readings = pool
    .map(
      (c) =>
        `【${c.slot.labelZh}·${c.card.nameZh}】${excerpt(activeMeaning(c), 2)}`,
    )
    .join(" ");
  const label = isLove ? "情感向" : "事业向";
  if (domain === (isLove ? "love" : "career")) {
    return `${label}：${readings} 请把上述意象对照你的真实关系/处境，而非套用通用情话。`;
  }
  return `${label}（顺带）：${readings || excerpt(activeMeaning(cards[0]), 2)} 若与${isLove ? "感情" : "职场"}无关，可当作自我照料或资源管理的隐喻。`;
}

function buildAction(cards: DrawnCard[], question: string, themeLabel: string): string {
  const dom = dominantElement(cards) ?? cards[0]?.card.element ?? "spirit";
  const kw = cards.flatMap((c) => c.card.keywords).slice(0, 4).join("、");
  const anchor = question.trim() || themeLabel;

  const byEl: Record<string, string> = {
    fire: "选一件 48 小时内能完成的「可见行动」——发一条消息、投一份简历、开口表达一次真实需求",
    water: "用 10 分钟写下此刻最真实的感受与需要，再决定是否要与对方坦诚沟通",
    air: "列出事实/假设两栏，把脑补从证据里拆开；若问抉择，给每个选项写 3 条可验证后果",
    earth: "落实一个身体或资源层面的小步：整理账目、睡眠、桌面，或把技能换成可展示的成果",
    spirit: "独处 8 分钟静坐或散步，问自己在回避什么；把牌阵拍照作提醒，而非命令",
  };

  return `行动建议：围绕「${anchor}」，牌组关键词「${kw}」提示你——${byEl[dom] ?? byEl.spirit}。完成后回顾：哪张牌的意象最像今天的你？`;
}

export function buildRuleInterpretation(input: {
  themeLabel: string;
  themeId?: string | null;
  question: string;
  spread: SpreadType;
  cards: DrawnCard[];
}): {
  overview: string;
  perCard: { slot: string; title: string; text: string }[];
  synthesis: string;
  love: string;
  career: string;
  action: string;
  conclusion: string;
  reminder?: string;
} {
  const domain = detectQuestionDomain(
    input.themeLabel,
    input.question,
    input.themeId,
  );
  const qHook = questionHook(domain, input.question);

  const overview = [
    spreadTimelineIntro(input.spread, input.cards.length),
    qHook,
    `围绕主题「${input.themeLabel}」，牌面依次是：${input.cards
      .map((d) => formatCardHeadline(d))
      .join("；")}。`,
  ].join("");

  const perCard = input.cards.map((d) => ({
    slot: d.slot.labelZh,
    title: `${d.card.nameZh} · ${d.reversed ? "逆位" : "正位"}`,
    text: composeCardReading(d, domain, input.question),
  }));

  const { conclusion, reminder } = buildConclusion(
    domain,
    input.question,
    input.cards,
    input.themeLabel,
  );
  const synergy = buildSynergy(input.cards, input.spread);
  const synthesis = [synergy, conclusion, reminder].filter(Boolean).join("\n\n");

  return {
    overview,
    perCard,
    synthesis,
    love: buildThemedSection(input.cards, domain, "love"),
    career: buildThemedSection(input.cards, domain, "career"),
    action: buildAction(input.cards, input.question, input.themeLabel),
    conclusion,
    reminder,
  };
}
