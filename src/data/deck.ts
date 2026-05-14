import type { ElementAttr, TarotCard, TarotSuit } from "@/types/tarot";
import { riderWaiteFaceUrl } from "@/lib/cardImage";
import { getMinorMeaning } from "@/data/minorMeanings";

const majors: Omit<TarotCard, "index">[] = [
  {
    id: "major_0",
    arcana: "major",
    suit: "major",
    rank: "0",
    nameZh: "愚人",
    nameEn: "The Fool",
    uprightZh: "信任旅程的第一步，带着好奇跃入未知。",
    reversedZh: "鲁莽或逃避责任，需要看清脚下的悬崖。",
    keywords: ["启程", "天真", "可能"],
    element: "spirit",
    imageUrl: "/cards/major_0.svg",
  },
  {
    id: "major_1",
    arcana: "major",
    suit: "major",
    rank: "I",
    nameZh: "魔术师",
    nameEn: "The Magician",
    uprightZh: "意志与资源对齐，你能把想法化为现实。",
    reversedZh: "技巧误用或自我怀疑，能量分散难聚焦。",
    keywords: ["显化", "专注", "工具"],
    element: "air",
    imageUrl: "/cards/major_1.svg",
  },
  {
    id: "major_2",
    arcana: "major",
    suit: "major",
    rank: "II",
    nameZh: "女祭司",
    nameEn: "The High Priestess",
    uprightZh: "直觉比语言更诚实，静候内在潮汐。",
    reversedZh: "压抑直觉或秘密失衡，真相被噪音掩盖。",
    keywords: ["神秘", "内观", "潜意识"],
    element: "water",
    imageUrl: "/cards/major_2.svg",
  },
  {
    id: "major_3",
    arcana: "major",
    suit: "major",
    rank: "III",
    nameZh: "皇后",
    nameEn: "The Empress",
    uprightZh: "丰盛、滋养与感官之美正在生长。",
    reversedZh: "过度依赖或创造力枯竭，需要自我照料。",
    keywords: ["丰盛", "孕育", "温柔"],
    element: "earth",
    imageUrl: "/cards/major_3.svg",
  },
  {
    id: "major_4",
    arcana: "major",
    suit: "major",
    rank: "IV",
    nameZh: "皇帝",
    nameEn: "The Emperor",
    uprightZh: "结构、边界与稳定力量守护秩序。",
    reversedZh: "僵化控制或父权阴影，柔软同样重要。",
    keywords: ["秩序", "权威", "边界"],
    element: "fire",
    imageUrl: "/cards/major_4.svg",
  },
  {
    id: "major_5",
    arcana: "major",
    suit: "major",
    rank: "V",
    nameZh: "教皇",
    nameEn: "The Hierophant",
    uprightZh: "传统与仪式带来集体智慧与支持。",
    reversedZh: "质疑教条，寻找属于自己的真理。",
    keywords: ["传承", "信念", "导师"],
    element: "earth",
    imageUrl: "/cards/major_5.svg",
  },
  {
    id: "major_6",
    arcana: "major",
    suit: "major",
    rank: "VI",
    nameZh: "恋人",
    nameEn: "The Lovers",
    uprightZh: "价值观对齐的选择，亲密与诚实并行。",
    reversedZh: "分裂、诱惑或逃避承诺的核心课题。",
    keywords: ["选择", "亲密", "价值"],
    element: "air",
    imageUrl: "/cards/major_6.svg",
  },
  {
    id: "major_7",
    arcana: "major",
    suit: "major",
    rank: "VII",
    nameZh: "战车",
    nameEn: "The Chariot",
    uprightZh: "意志统御对立面，向目标坚定推进。",
    reversedZh: "方向迷失或内在冲突拉扯能量。",
    keywords: ["胜利", "自律", "前进"],
    element: "water",
    imageUrl: "/cards/major_7.svg",
  },
  {
    id: "major_8",
    arcana: "major",
    suit: "major",
    rank: "VIII",
    nameZh: "力量",
    nameEn: "Strength",
    uprightZh: "温柔的勇气驯服野性，以耐心化解恐惧。",
    reversedZh: "自我怀疑或压抑情绪反噬内在。",
    keywords: ["勇气", "耐心", "整合"],
    element: "fire",
    imageUrl: "/cards/major_8.svg",
  },
  {
    id: "major_9",
    arcana: "major",
    suit: "major",
    rank: "IX",
    nameZh: "隐士",
    nameEn: "The Hermit",
    uprightZh: "独处中点灯，智慧来自缓慢行走。",
    reversedZh: "孤立或逃避人群，也可能拒绝内省。",
    keywords: ["内省", "指引", "孤独"],
    element: "earth",
    imageUrl: "/cards/major_9.svg",
  },
  {
    id: "major_10",
    arcana: "major",
    suit: "major",
    rank: "X",
    nameZh: "命运之轮",
    nameEn: "Wheel of Fortune",
    uprightZh: "周期转动，幸运与试炼都是更大图景的一部分。",
    reversedZh: "抗拒改变或外境迟滞，学会顺势而非对抗。",
    keywords: ["命运", "周期", "转机"],
    element: "fire",
    imageUrl: "/cards/major_10.svg",
  },
  {
    id: "major_11",
    arcana: "major",
    suit: "major",
    rank: "XI",
    nameZh: "正义",
    nameEn: "Justice",
    uprightZh: "因果清晰，诚实面对衡量与后果。",
    reversedZh: "偏颇、逃避责任或信息不完整。",
    keywords: ["公正", "真相", "契约"],
    element: "air",
    imageUrl: "/cards/major_11.svg",
  },
  {
    id: "major_12",
    arcana: "major",
    suit: "major",
    rank: "XII",
    nameZh: "倒吊人",
    nameEn: "The Hanged Man",
    uprightZh: "暂停换取洞见，以新视角看见牺牲的意义。",
    reversedZh: "困在牺牲叙事里，或拒绝必要的放手。",
    keywords: ["停顿", "视角", "臣服"],
    element: "water",
    imageUrl: "/cards/major_12.svg",
  },
  {
    id: "major_13",
    arcana: "major",
    suit: "major",
    rank: "XIII",
    nameZh: "死神",
    nameEn: "Death",
    uprightZh: "旧壳脱落，结束孕育真正的新生。",
    reversedZh: "拖延结束，恐惧改变让能量淤塞。",
    keywords: ["转化", "结束", "重生"],
    element: "water",
    imageUrl: "/cards/major_13.svg",
  },
  {
    id: "major_14",
    arcana: "major",
    suit: "major",
    rank: "XIV",
    nameZh: "节制",
    nameEn: "Temperance",
    uprightZh: "炼金般的调和，耐心让对立元素融合。",
    reversedZh: "失衡、极端或急于求成。",
    keywords: ["调和", "疗愈", "中庸"],
    element: "fire",
    imageUrl: "/cards/major_14.svg",
  },
  {
    id: "major_15",
    arcana: "major",
    suit: "major",
    rank: "XV",
    nameZh: "恶魔",
    nameEn: "The Devil",
    uprightZh: "看见束缚你的链条其实可以卸下。",
    reversedZh: "觉醒、打破成瘾或羞耻的秘密。",
    keywords: ["欲望", "束缚", "阴影"],
    element: "earth",
    imageUrl: "/cards/major_15.svg",
  },
  {
    id: "major_16",
    arcana: "major",
    suit: "major",
    rank: "XVI",
    nameZh: "高塔",
    nameEn: "The Tower",
    uprightZh: "突变揭开幻象，闪电之后是更真实的地基。",
    reversedZh: "勉强维持摇摇欲坠的结构，迟来的震荡。",
    keywords: ["突变", "真相", "释放"],
    element: "fire",
    imageUrl: "/cards/major_16.svg",
  },
  {
    id: "major_17",
    arcana: "major",
    suit: "major",
    rank: "XVII",
    nameZh: "星星",
    nameEn: "The Star",
    uprightZh: "温柔的希望在伤口之后闪烁，重新相信。",
    reversedZh: "失望或疏离信念，需要重新校准愿景。",
    keywords: ["希望", "灵感", "疗愈"],
    element: "air",
    imageUrl: "/cards/major_17.svg",
  },
  {
    id: "major_18",
    arcana: "major",
    suit: "major",
    rank: "XVIII",
    nameZh: "月亮",
    nameEn: "The Moon",
    uprightZh: "梦境与潜意识涨潮，迷雾中也有路标。",
    reversedZh: "恐惧消退，幻象澄清，直觉更稳。",
    keywords: ["幻象", "直觉", "梦境"],
    element: "water",
    imageUrl: "/cards/major_18.svg",
  },
  {
    id: "major_19",
    arcana: "major",
    suit: "major",
    rank: "XIX",
    nameZh: "太阳",
    nameEn: "The Sun",
    uprightZh: "生命力与喜悦照见真实，简单即是力量。",
    reversedZh: "暂时的阴云，核心光明并未熄灭。",
    keywords: ["喜悦", "真相", "活力"],
    element: "fire",
    imageUrl: "/cards/major_19.svg",
  },
  {
    id: "major_20",
    arcana: "major",
    suit: "major",
    rank: "XX",
    nameZh: "审判",
    nameEn: "Judgement",
    uprightZh: "召唤与觉醒，回应更高版本的自己。",
    reversedZh: "自我审判过重，或逃避召唤。",
    keywords: ["觉醒", "召唤", "宽恕"],
    element: "fire",
    imageUrl: "/cards/major_20.svg",
  },
  {
    id: "major_21",
    arcana: "major",
    suit: "major",
    rank: "XXI",
    nameZh: "世界",
    nameEn: "The World",
    uprightZh: "圆满与整合，旅程暂告段落，舞蹈继续。",
    reversedZh: "未尽之事或害怕完成，最后一公里。",
    keywords: ["完成", "整合", "旅程"],
    element: "earth",
    imageUrl: "/cards/major_21.svg",
  },
];

type MinorRank =
  | "ace"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "page"
  | "knight"
  | "queen"
  | "king";

const suitMeta: Record<
  Exclude<TarotSuit, "major">,
  { zh: string; en: string; element: ElementAttr; theme: string }
> = {
  wands: { zh: "权杖", en: "Wands", element: "fire", theme: "意志、创造、行动与热情" },
  cups: { zh: "圣杯", en: "Cups", element: "water", theme: "情感、关系、直觉与疗愈" },
  swords: { zh: "宝剑", en: "Swords", element: "air", theme: "思想、真相、边界与决断" },
  pentacles: {
    zh: "星币",
    en: "Pentacles",
    element: "earth",
    theme: "物质、身体、资源与长期积累",
  },
};

const rankNames: Record<
  MinorRank,
  { zh: string; en: string; role: "pip" | "court" }
> = {
  ace: { zh: "王牌", en: "Ace", role: "pip" },
  "2": { zh: "二", en: "Two", role: "pip" },
  "3": { zh: "三", en: "Three", role: "pip" },
  "4": { zh: "四", en: "Four", role: "pip" },
  "5": { zh: "五", en: "Five", role: "pip" },
  "6": { zh: "六", en: "Six", role: "pip" },
  "7": { zh: "七", en: "Seven", role: "pip" },
  "8": { zh: "八", en: "Eight", role: "pip" },
  "9": { zh: "九", en: "Nine", role: "pip" },
  "10": { zh: "十", en: "Ten", role: "pip" },
  page: { zh: "侍从", en: "Page", role: "court" },
  knight: { zh: "骑士", en: "Knight", role: "court" },
  queen: { zh: "王后", en: "Queen", role: "court" },
  king: { zh: "国王", en: "King", role: "court" },
};

function buildMinors(): TarotCard[] {
  const suits = Object.keys(suitMeta) as (keyof typeof suitMeta)[];
  const ranks = Object.keys(rankNames) as MinorRank[];
  const out: TarotCard[] = [];
  let idx = 22;
  for (const suit of suits) {
    for (const rank of ranks) {
      const meta = suitMeta[suit];
      const rn = rankNames[rank];
      const tpl = getMinorMeaning(suit, rn.en);
      const id = `minor_${suit}_${rank}`;
      const index = idx++;
      const c: TarotCard = {
        id,
        index,
        arcana: "minor",
        suit,
        rank: rn.en,
        nameZh: `${meta.zh}${rn.zh}`,
        nameEn: `${rn.en} of ${meta.en}`,
        uprightZh: tpl.uprightZh,
        reversedZh: tpl.reversedZh,
        keywords: tpl.keywords,
        element: meta.element,
        imageUrl: "",
      };
      out.push({ ...c, imageUrl: riderWaiteFaceUrl(c) });
    }
  }
  return out;
}

const majorCards: TarotCard[] = majors.map((m, i) => {
  const c: TarotCard = { ...m, index: i };
  return { ...c, imageUrl: riderWaiteFaceUrl(c) };
});

export const TAROT_DECK: TarotCard[] = [...majorCards, ...buildMinors()];

export const DECK_BY_ID: Record<string, TarotCard> = Object.fromEntries(
  TAROT_DECK.map((c) => [c.id, c]),
);
