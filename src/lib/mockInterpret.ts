import type { DrawnCard, InterpretationPayload } from "@/types/tarot";

const SLOT_HINT: Record<string, string> = {
  过去: "这里谈的是已经写进你身体里的惯性、旧脚本，以及仍在隐隐作用的因。",
  现在: "这里谈的是你此刻站着的地面：资源、盲点、情绪气候与正在发生的选择。",
  未来: "这里谈的是能量若沿当前路径延展时，最可能出现的走向——可被改写，不是判决书。",
  核心讯息: "这里直接指向你问题里最紧的那根弦，请优先回应它。",
};

function slotIntro(label: string): string {
  return SLOT_HINT[label] ?? "此位置为牌阵中的一个面向，请结合牌义具体化。";
}

function themeBridge(theme: string, element: string): string {
  const t = theme.toLowerCase();
  const el = element;
  if (t.includes("情感") || t.includes("亲密")) {
    return el === "water" || el === "cups"
      ? "水象/圣杯能量与「感受、依附、疗愈」同频，可把解读往亲密与安全感上推半步。"
      : "即便牌面偏理性或行动，也请点到关系里的「需要被如何对待」。";
  }
  if (t.includes("事业") || t.includes("价值")) {
    return el === "fire" || el === "wands"
      ? "火象/权杖与「野心、节奏、可见的推进」共振，可谈具体下一步。"
      : "请把抽象牌义落到「如何被看见、如何交换价值」的日常语境。";
  }
  if (t.includes("成长") || t.includes("疗愈")) {
    return "把牌义读成「整合阴影—恢复主体性」的练习，而不是评判自我。";
  }
  if (t.includes("抉择") || t.includes("十字路口")) {
    return "突出两条路各自的代价与滋养，而不是替用户做二选一判决。";
  }
  if (t.includes("灵性") || t.includes("象征")) {
    return "允许象征与梦境式语言，但仍要锚回可感知的生活细节。";
  }
  return "把牌义与用户所选主题轻轻对齐，避免无关泛谈。";
}

function chainSynthesis(cards: DrawnCard[]): string {
  if (cards.length <= 1) {
    return "单张牌把能量收束在一处：请把这张牌当作「此刻最诚实的镜子」，反复照见同一主题的不同层次。";
  }
  const names = cards.map((c) => c.card.nameZh);
  const [a, b, c3] = cards;
  if (cards.length === 3 && a && b && c3) {
    const oa = a.reversed ? "逆" : "正";
    const ob = b.reversed ? "逆" : "正";
    const oc = c3.reversed ? "逆" : "正";
    return `三张牌像一条河：「${names[0]}（${oa}）」在「${a.slot.labelZh}」埋下河床；「${names[1]}（${ob}）」在「${b.slot.labelZh}」决定水流如何转弯；「${names[2]}（${oc}）」在「${c3.slot.labelZh}」提示若继续此节奏，水面将倾向平静或汹涌。请比较三张牌的元素（${a.card.element}、${b.card.element}、${c3.card.element}）——同质会放大主题，异质则提示需要借力的外在面向。`;
  }
  return `多张牌并列时，先看「${names[0]}」与「${names[1] ?? ""}」之间是互相支撑还是拉扯：支撑则形成同一主题的加强版；拉扯则说明你内在有两个声音在谈判，解读要把这谈判说清楚。`;
}

export function mockInterpretation(
  theme: string,
  question: string,
  cards: DrawnCard[],
): InterpretationPayload {
  const q = question.trim();
  const qbit =
    q.length > 0
      ? `你写下的句子像一颗小石子投进水里：「${q.slice(0, 120)}${q.length > 120 ? "…" : ""}」。我会尽量让牌直接回应这句话里的动词与名词。`
      : "你没有写下具体问题，我会围绕所选主题，把牌义落到「处境—情绪—能动之处」三层。";

  const overviewParts = [
    `围绕「${theme}」，${qbit}`,
    themeBridge(theme, cards[0]?.card.element ?? "spirit"),
    `牌面依次是：${cards
      .map((d) => `${d.slot.labelZh}「${d.card.nameZh}」${d.reversed ? "逆位" : "正位"}`)
      .join("；")}。`,
    "下面把每一张牌放在它该在的位置里读——不是标签，而是可试穿的隐喻。",
  ];
  const overview = overviewParts.join("");

  const perCard = cards.map((d) => {
    const o = d.reversed ? "逆位" : "正位";
    const core = d.reversed ? d.card.reversedZh : d.card.uprightZh;
    const other = d.reversed ? d.card.uprightZh : d.card.reversedZh;
    const hint = slotIntro(d.slot.labelZh);
    const kw = d.card.keywords.join("、");
    return {
      slot: d.slot.labelZh,
      title: `${d.card.nameZh} · ${o}`,
      text: `「${d.slot.labelZh}」：${hint} 这张 ${d.card.nameEn} 以 ${o} 出现，本次牌义核心是：${core} 另一面向（${d.reversed ? "正位" : "逆位"}）可作背景理解：${other} 关键词「${kw}」与元素「${d.card.element}」提示：把感受写进身体记忆里的是哪些瞬间？若与「${theme}」并置，它正在轻轻推你做的一件事是什么？`,
    };
  });

  const synthesis = `${chainSynthesis(cards)} 同时请留意：牌义之间若出现「快与慢」「收与放」的对比，往往不是要你二选一，而是邀请你在不同时间表上同时照顾两个需要。`;

  const love = `从牌面元素与关键词看情感面向：${cards
    .map((d) => {
      const c = d.reversed ? d.card.reversedZh : d.card.uprightZh;
      return `「${d.card.nameZh}」暗示 ${c.slice(0, 40)}…`;
    })
    .join("")} 练习用一句「我需要…」替代「你应该…」，往往能让关系里的刺变软。`;

  const career = `从行动与自我价值角度：${cards
    .map((d) => {
      const c = d.reversed ? d.card.reversedZh : d.card.uprightZh;
      return `「${d.card.nameZh}」指向 ${c.slice(0, 40)}…`;
    })
    .join("")} 把注意力放在「本周能完成的最小可见一步」，比空泛立志更贴合当前牌组。`;

  const action = `结合抽到的关键词 ${[...new Set(cards.flatMap((d) => d.card.keywords))].slice(0, 5).join("、")}：① 今晚用 8 分钟写下：此刻我最真实的恐惧与渴望各一句；② 明天选一件小事，用「权杖式」推进或「圣杯式」修复去试；③ 若仍卡住，把牌阵拍照放在桌上三天，当作提醒而非命令。`;

  return { overview, perCard, synthesis, love, career, action };
}
