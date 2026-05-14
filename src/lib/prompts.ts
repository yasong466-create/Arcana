import type { DrawnCard, SpreadType } from "@/types/tarot";

export const SYSTEM_ORACLE = `你是一位温柔、敏锐、受过伦理训练的塔罗师。语气神秘但不恐吓，有洞察力但不像百科或鸡汤。

硬性要求：
- 解读必须紧扣下面给出的「牌阵位置含义」与每张牌的「正位/逆位牌义原文」展开，逐张引用其中的意象与动词，不得用泛泛的“你会更好”“保持信心”敷衍过去。
- 总览与综合段要说明：这些牌在一起如何互相加强、拉扯或转折；若出现矛盾，要解释成内在不同面向的张力，而不是回避。
- 情感/事业/行动三段必须与抽到的牌元素（fire/water/air/earth/spirit）和关键词产生具体关联，可适度联系用户主题，但不要编造牌面没有的信息。
- 绝不医疗/法律/投资建议；不做绝对化预言；避免“一定/注定/必然灾难”。
- 输出必须是合法 JSON 对象（不要 markdown），字段：overview, perCard, synthesis, love, career, action。`;

function spreadGuide(spread: SpreadType): string {
  switch (spread) {
    case "single":
      return "单张牌阵：这张牌直接回应问题核心，请把牌义写透，并点到用户问题里的具体矛盾或渴望。";
    case "three_past_present_future":
      return "三张牌阵：过去=已形成的惯性、根源与不可改写的事实感；现在=当下资源、盲点与情绪气候；未来=能量若延续时最可能的走向（强调可调整，不是定数）。";
    case "celtic_cross":
      return "凯尔特十字：按位置传统含义解读（若牌不足则略）。";
    default:
      return "";
  }
}

export function buildUserPrompt(input: {
  themeLabel: string;
  question: string;
  spread: SpreadType;
  cards: DrawnCard[];
}): string {
  const lines = input.cards.map((d, n) => {
    const pos = `${d.slot.labelZh}（${d.slot.labelEn}）`;
    const ori = d.reversed ? "逆位" : "正位";
    const active = d.reversed ? d.card.reversedZh : d.card.uprightZh;
    const passive = d.reversed ? d.card.uprightZh : d.card.reversedZh;
    return `${n + 1}. 【位置】${pos}
   【牌】${d.card.nameZh} / ${d.card.nameEn} — 本次为 **${ori}**
   【关键词】${d.card.keywords.join("、")}
   【元素】${d.card.element}
   【本次采用牌义】${active}
   【另一面向参考（非本次朝向）】${passive}`;
  });

  return `【占卜主题】${input.themeLabel}
【用户原话问题】${input.question || "（未写具体问题，请结合主题做三层解读：处境—情绪—可动之处）"}
【牌阵类型】${input.spread}

${spreadGuide(input.spread)}

【抽牌明细】
${lines.join("\n\n")}

请用中文输出 JSON（字段与 schema 如下），perCard 数组须与上面每一张牌一一对应，且每张 text 至少 4 句，其中 2 句必须显式复述或化用「本次采用牌义」里的词句：
{
  "overview": "3-5 句，总览牌组与用户处境",
  "perCard": [
    { "slot": "过去", "title": "牌名 · 正/逆位", "text": "…" }
  ],
  "synthesis": "4-7 句，牌与牌之间的对话、主线与隐藏线",
  "love": "3-5 句，情感与关系层面",
  "career": "3-5 句，行动、价值与资源层面",
  "action": "3-5 句，具体可执行的小步建议，与牌义呼应"
}`;
}
