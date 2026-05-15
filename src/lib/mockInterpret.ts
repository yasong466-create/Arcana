import type { DrawnCard, InterpretationPayload, SpreadType } from "@/types/tarot";
import {
  bridgeCardToQuestion,
  detectQuestionDomain,
  formatCardHeadline,
  questionHook,
  spreadTimelineIntro,
} from "@/lib/interpretStyle";

function reversedLean(cards: DrawnCard[]): "mixed" | "mostly_up" | "mostly_rev" {
  const rev = cards.filter((c) => c.reversed).length;
  if (rev === 0) return "mostly_up";
  if (rev >= Math.ceil(cards.length * 0.67)) return "mostly_rev";
  return "mixed";
}

function buildConclusion(
  domain: ReturnType<typeof detectQuestionDomain>,
  question: string,
  cards: DrawnCard[],
): { conclusion: string; reminder?: string } {
  const lean = reversedLean(cards);
  const names = cards.map((c) => c.card.nameZh).join("、");
  const last = cards[cards.length - 1];
  const lastCore = last
    ? last.reversed
      ? last.card.reversedZh
      : last.card.uprightZh
    : "";

  const hasHeavySwords = cards.some(
    (c) => c.card.suit === "swords" && (c.card.nameZh.includes("九") || c.card.nameZh.includes("十")),
  );
  const hasDevil = cards.some((c) => c.card.nameZh === "恶魔");
  const reminderParts: string[] = [];
  if (hasHeavySwords) {
    reminderParts.push(
      "牌面里宝剑的「忧虑」成分偏重：筹备期或等待期容易失眠、反复脑补。请把焦虑当作信号，而不是预言。",
    );
  }
  if (hasDevil) {
    reminderParts.push(
      "出现恶魔时，多象征强烈吸引、执念或难以放手的联结，未必等于传统意义上细水长流的伴侣形象，留意是否过度依赖。",
    );
  }

  let conclusion = "";
  if (domain === "career") {
    if (lean === "mostly_rev") {
      conclusion = `结论：有机会，但需先拆掉限制性思维或流程上的卡点。牌组（${names}）显示并非「没戏」，而是「还没对齐」——尤其留意最后一张「${last?.card.nameZh}」所提示的：${firstSentence(lastCore)}`;
    } else if (lean === "mostly_up") {
      conclusion = `结论：胜算偏高。你已把球踢出去，牌面（${names}）整体偏顺畅；若问 offer/录用，多指向「有回音、能进入相对舒适的团队语境」，但仍取决于你面试后的具体沟通与选择。`;
    } else {
      conclusion = `结论：偏乐观，但中间会有等待或拉扯。请把「${last?.slot.labelZh}」的「${last?.card.nameZh}」当作时间线上的提示：${firstSentence(lastCore)}`;
    }
  } else if (domain === "love") {
    if (lean === "mostly_rev") {
      conclusion = `结论：关系里仍有拉扯，但并非全无可能。牌（${names}）显示需要先处理安全感与沟通方式，再谈「会不会在一起」。`;
    } else {
      conclusion = `结论：有机会走向更稳固的联结。牌面整体偏暖（${names}），但未必浪漫泛滥，可能多一点责任与规矩；请以「${last?.card.nameZh}」的意象衡量你能否接受这种节奏。`;
    }
  } else if (domain === "decision") {
    conclusion =
      lean === "mostly_rev"
        ? `结论：倾向「可以，但别急着定论」。逆位较多时，先补齐信息与情绪整理，再行动更稳。`
        : `结论：整体偏向「可以一试 / 值得推进」。牌（${names}）支持你把问题落地成具体一步，而不是停在想象里。`;
  } else {
    conclusion =
      lean === "mostly_rev"
        ? `结论：当前是整合与松绑期。牌（${names}）邀请你先调整内在叙事，外在结果会随后跟上。`
        : `结论：能量整体偏开放。牌（${names}）支持你采取小而确定的行动，比空等更有用。`;
  }

  if (question.trim()) {
    conclusion = conclusion.replace(
      /^结论：/,
      `结论（回应「${question.trim().slice(0, 36)}${question.length > 36 ? "…" : ""}」）：`,
    );
  }

  return {
    conclusion,
    reminder: reminderParts.length ? reminderParts.join("\n") : undefined,
  };
}

function firstSentence(text: string): string {
  const s = text.split(/[。！？]/)[0]?.trim();
  return s ? `${s}。` : text;
}

export function mockInterpretation(
  theme: string,
  question: string,
  cards: DrawnCard[],
  spread: SpreadType = "single",
): InterpretationPayload {
  const domain = detectQuestionDomain(theme, question);
  const qHook = questionHook(domain, question);

  const overview = [
    spreadTimelineIntro(spread, cards.length),
    qHook,
    `围绕主题「${theme}」，牌面依次是：${cards
      .map((d) => formatCardHeadline(d))
      .join("；")}。`,
  ].join("");

  const perCard = cards.map((d) => {
    const head = formatCardHeadline(d);
    const bridge = bridgeCardToQuestion(d, domain);
    const other = d.reversed ? d.card.uprightZh : d.card.reversedZh;
    return {
      slot: d.slot.labelZh,
      title: `${d.card.nameZh} · ${d.reversed ? "逆位" : "正位"}`,
      text: `${head} —— ${bridge} 若仍觉得抽象，可把另一面向（${d.reversed ? "正位" : "逆位"}）当作背景：${firstSentence(other)}`,
    };
  });

  const { conclusion, reminder } = buildConclusion(domain, question, cards);

  const synthesis = [
    "牌与牌之间：",
    cards.length >= 3
      ? `从「${cards[0]?.card.nameZh}」到「${cards[cards.length - 1]?.card.nameZh}」，像一条时间河——前者埋下河床，中间决定转弯方式，后者提示水面倾向平静还是汹涌。`
      : `多张牌并列时，先看它们是互相加强同一主题，还是在谈判两个内在声音。`,
    "同质元素会放大感受（例如圣杯叠圣杯更偏情绪），异质则提示你需要借力的外在面向（例如权杖配星币＝行动要落地）。",
  ].join("");

  const love =
    domain === "love" || theme.includes("情感")
      ? `情感向：${cards
          .filter((c) => c.card.element === "water" || c.card.suit === "cups")
          .map((c) => `「${c.card.nameZh}」${firstSentence(c.reversed ? c.card.reversedZh : c.card.uprightZh)}`)
          .join("") || perCard[0]?.text.slice(0, 80) || "请回到逐张牌义。"} 练习用「我需要…」替代「你应该…」，往往能让关系里的刺变软。`
      : `情感向（顺带）：不必强行浪漫化。若问题本身与关系无关，可把这段当作自我照料——${firstSentence(cards[0]?.reversed ? cards[0].card.reversedZh : cards[0]?.card.uprightZh ?? "")}`;

  const career =
    domain === "career" || theme.includes("事业")
      ? `事业向：${cards
          .filter((c) => c.card.suit === "wands" || c.card.suit === "pentacles")
          .map((c) => `「${c.card.nameZh}」${firstSentence(c.reversed ? c.card.reversedZh : c.card.uprightZh)}`)
          .join("") || "请关注「可见的一步」：更新简历、复盘面试、或主动跟进 HR。"} 把注意力放在本周能完成的最小可见进展，比空泛立志更贴合牌组。`
      : `事业向（顺带）：${firstSentence(cards.find((c) => c.card.suit === "pentacles")?.card.uprightZh ?? cards[0]?.card.uprightZh ?? "")} 若与职场无关，可理解为「如何把精力换成可持续的成果」。`;

  const action = `行动建议：① 用 8 分钟写下：此刻最真实的恐惧与渴望各一句；② 针对「${question.trim() || theme}」选一件 48 小时内可完成的小事去试；③ 若仍卡住，把牌阵拍照放在桌上三天，当作提醒而非命令。`;

  const synthesisFull = [synthesis, conclusion, reminder].filter(Boolean).join("\n\n")

  return {
    overview,
    perCard,
    synthesis: synthesisFull,
    love,
    career,
    action,
  };
}
