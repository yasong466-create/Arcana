import type { TarotSuit } from "@/types/tarot";

/** 与 deck 中小牌 rank 字段一致：Ace, Two, …, King */
export type MinorRankEn =
  | "Ace"
  | "Two"
  | "Three"
  | "Four"
  | "Five"
  | "Six"
  | "Seven"
  | "Eight"
  | "Nine"
  | "Ten"
  | "Page"
  | "Knight"
  | "Queen"
  | "King";

export type MinorMeaning = {
  uprightZh: string;
  reversedZh: string;
  keywords: string[];
};

type SuitKey = Exclude<TarotSuit, "major">;

/** 56 张小阿卡纳：正逆位与关键词（Rider–Waite 体系意涵，中文简述） */
export const MINOR_ARCANA_MEANINGS: Record<SuitKey, Record<MinorRankEn, MinorMeaning>> = {
  wands: {
    Ace: {
      uprightZh: "新灵感、新计划或热情的开端；创意被点燃，值得立刻行动一小步。",
      reversedZh: "冲动落空、方向摇摆或迟迟不开局；需先厘清动机再投入能量。",
      keywords: ["灵感", "开端", "火种"],
    },
    Two: {
      uprightZh: "在两种路径间权衡、手握选择权；也可能表示旅行、远见与初步规划。",
      reversedZh: "害怕选择、信息不足或反复改主意；避免用拖延逃避承担后果。",
      keywords: ["抉择", "规划", "远见"],
    },
    Three: {
      uprightZh: "合作初显成果、团队向前；扩张、被看见、阶段性胜利。",
      reversedZh: "协作摩擦、抢功或步调不一；成果被延迟，需对齐目标与分工。",
      keywords: ["拓展", "团队", "进展"],
    },
    Four: {
      uprightZh: "婚礼、庆典、稳定的小成就与归属感；家庭或团队内的温暖支持。",
      reversedZh: "表面和谐下的不合、聚会变负担；或稳定感不足、归属感动摇。",
      keywords: ["欢庆", "稳定", "归属"],
    },
    Five: {
      uprightZh: "竞争、冲突或意见相左；在摩擦里看清立场，学习公平较量。",
      reversedZh: "回避冲突、内伤积压；或争赢却失人心，需修补关系与信任。",
      keywords: ["竞争", "冲突", "立场"],
    },
    Six: {
      uprightZh: "胜利、公众认可与好消息；努力被看见，士气回升。",
      reversedZh: "胜之不武、虚名或骄傲反噬；也可能是迟来的认可，勿自我否定。",
      keywords: ["胜利", "认可", "名声"],
    },
    Seven: {
      uprightZh: "以守为攻、坚持立场；面对挑战不退缩，策略性捍卫边界。",
      reversedZh: "过度防御、疑神疑鬼或内耗；也可能是防线松动，被乘虚而入。",
      keywords: ["防御", "坚持", "边界"],
    },
    Eight: {
      uprightZh: "快速行动、消息纷至沓来；节奏加快，适合短跑式推进。",
      reversedZh: "混乱失序、欲速不达或沟通失准；先减速整理优先级。",
      keywords: ["速度", "消息", "推进"],
    },
    Nine: {
      uprightZh: "孤军奋战仍咬牙坚持；韧性、耐力与最后关头的自我要求。",
      reversedZh: "筋疲力竭、偏执或不肯求助；放下完美主义，允许喘息与协作。",
      keywords: ["韧性", "坚持", "压力"],
    },
    Ten: {
      uprightZh: "责任压顶、过劳或把太多扛在肩上；也象征家族/事业重担的顶点。",
      reversedZh: "卸下重担、学会委派；或逃避责任导致问题堆积，需面对现实。",
      keywords: ["负担", "责任", "极限"],
    },
    Page: {
      uprightZh: "好奇的学习者、带来消息或新点子；热情试探、自由探索。",
      reversedZh: "幼稚冲动、八卦或三分钟热度；消息不实，勿轻信传言。",
      keywords: ["探索", "讯息", "热忱"],
    },
    Knight: {
      uprightZh: "雷厉风行、为爱或理想冲锋；行动派，来得快去得也快。",
      reversedZh: "鲁莽、虎头蛇尾或情绪化冲撞；先踩刹车，别把冲动当勇气。",
      keywords: ["行动", "冲动", "追逐"],
    },
    Queen: {
      uprightZh: "自信、温暖而果决的领导者；照顾他人也忠于自我欲望与创造。",
      reversedZh: "善妒、操控或自信变成霸道；先安顿内在不安再对外发光。",
      keywords: ["自信", "热情", "领导"],
    },
    King: {
      uprightZh: "远见、企业家精神与担当；把愿景落地，保护团队向前。",
      reversedZh: "专制、易怒或刚愎自用；也可能是失去方向，需重拾愿景与诚信。",
      keywords: ["愿景", "权威", "开创"],
    },
  },
  cups: {
    Ace: {
      uprightZh: "新的情感、直觉或灵性泉源开启；心被柔软打开，适合真诚表达。",
      reversedZh: "情感堵塞、压抑或爱在心口难开；疗愈未完成，需先面对旧伤。",
      keywords: ["新情", "直觉", "泉源"],
    },
    Two: {
      uprightZh: "吸引、伙伴关系或互信结盟；情感流动自然，彼此映照。",
      reversedZh: "失衡、单恋或秘密恋情；信任裂缝，需要诚实对话而非猜测。",
      keywords: ["联结", "吸引", "互信"],
    },
    Three: {
      uprightZh: "友谊、小聚与情感支持圈；庆祝、疗愈与分享喜悦。",
      reversedZh: "八卦、三角关系或表面社交；孤独感在人群中反而加重。",
      keywords: ["友谊", "欢聚", "支持"],
    },
    Four: {
      uprightZh: "沉思、暂时抽离与内省；对现有情感状态不满足，酝酿新可能。",
      reversedZh: "走出忧郁、重新参与生活；或沉溺幻想拒绝面对现实。",
      keywords: ["沉思", "抽离", "审视"],
    },
    Five: {
      uprightZh: "失落、遗憾与旧痛浮现；哭泣与告别也是释放与疗愈的一部分。",
      reversedZh: "宽恕、走出悲伤或旧痛复发；允许自己慢慢复原，勿强颜欢笑。",
      keywords: ["失落", "遗憾", "疗愈"],
    },
    Six: {
      uprightZh: "童年、回忆与纯真再现；也可能表示返乡、旧人重逢与温柔怀旧。",
      reversedZh: "困在过去、逃避成长；或美化回忆，需区分真实与滤镜。",
      keywords: ["回忆", "纯真", "怀旧"],
    },
    Seven: {
      uprightZh: "幻想过多、选择眼花；在想象与真实间取舍，辨清真正想要的。",
      reversedZh: "逐渐清醒、下定决心；或自欺更深，勿用新幻想掩盖旧问题。",
      keywords: ["幻想", "选择", "迷惘"],
    },
    Eight: {
      uprightZh: "转身离开、放下不再滋养的关系或习惯；为更健康的自己让路。",
      reversedZh: "走回头路、害怕孤独或无法放手；放手不是失败，是自爱。",
      keywords: ["离开", "放下", "前行"],
    },
    Nine: {
      uprightZh: "愿望达成、情感满足与感恩；享受丰盛，也珍惜眼前人。",
      reversedZh: "贪得无厌、情感依赖或物质填补空虚；练习知足与界限。",
      keywords: ["满足", "感恩", "丰盛"],
    },
    Ten: {
      uprightZh: "家庭、传承与情感圆满；彩虹之后，关系进入稳定整合期。",
      reversedZh: "家庭张力、价值观冲突或圆满表象下的裂痕；需要修复与对话。",
      keywords: ["家庭", "圆满", "传承"],
    },
    Page: {
      uprightZh: "温柔的消息、暗恋或创意直觉；以好奇心倾听自己与他人的心。",
      reversedZh: "情绪化、逃避现实或幼稚依赖；情感表达需更成熟与具体。",
      keywords: ["直觉", "讯息", "温柔"],
    },
    Knight: {
      uprightZh: "浪漫追求、理想化的爱与追随直觉；情感来势汹涌，像潮水。",
      reversedZh: "暧昧不清、逃避承诺或爱情泡沫；分清浪漫与责任。",
      keywords: ["浪漫", "追求", "理想"],
    },
    Queen: {
      uprightZh: "共情、滋养与无条件关怀；直觉敏锐，能疗愈自己与他人的情绪。",
      reversedZh: "过度牺牲、情绪勒索或界限模糊；先填满自己的杯子。",
      keywords: ["共情", "滋养", "直觉"],
    },
    King: {
      uprightZh: "情绪成熟、慈悲而稳重的爱；以智慧与克制守护重要关系。",
      reversedZh: "冷漠压抑、情感操控或逃避脆弱；温柔与力量需要平衡。",
      keywords: ["成熟", "慈悲", "稳定"],
    },
  },
  swords: {
    Ace: {
      uprightZh: "真相破晓、清晰洞见与正义的胜利；新想法锋利如剑，切开迷雾。",
      reversedZh: "混乱、误判或言语伤人；想法未成熟先别下结论，避免刻薄。",
      keywords: ["真相", "洞见", "清晰"],
    },
    Two: {
      uprightZh: "僵局、回避与暂时休战；蒙眼等待直觉，而非强行用理性说服。",
      reversedZh: "僵局松动、真相浮现或压抑爆发；该面对的终究要面对。",
      keywords: ["僵局", "休战", "直觉"],
    },
    Three: {
      uprightZh: "心碎、分离与第三方言语伤害；痛过之后，学会筛选信任的人。",
      reversedZh: "愈合、原谅或旧痛重提；释放怨恨，才能真正轻盈。",
      keywords: ["心碎", "背叛", "疗愈"],
    },
    Four: {
      uprightZh: "休战、冥想与充电；从脑力透支中撤退，给身体与神经喘息。",
      reversedZh: "躁动不安、拒绝休息或压抑焦虑反弹；真正的恢复需要停下来的许可。",
      keywords: ["休息", "冥想", "充电"],
    },
    Five: {
      uprightZh: "公开争执、输赢与自尊受伤；争论未必有赢家，留意代价。",
      reversedZh: "和解、退让或内伤未愈；表面和平下仍有刺，需诚实修补。",
      keywords: ["争执", "自尊", "输赢"],
    },
    Six: {
      uprightZh: "过渡到更平稳水域；离开风暴，带着经验前行，疗愈在途中。",
      reversedZh: "困在创伤里、走不出旧叙事；或逃避面对，问题会换形式回来。",
      keywords: ["过渡", "疗愈", "前行"],
    },
    Seven: {
      uprightZh: "潜行、策略与隐藏动机；需辨明敌友，保护自己的立场与信息。",
      reversedZh: "疑心病、自欺或秘密曝光；诚实比算计更能带来安全。",
      keywords: ["策略", "隐秘", "防备"],
    },
    Eight: {
      uprightZh: "受困思维、焦虑循环与自我设限；看清束缚多来自内心剧本。",
      reversedZh: "松绑、新视角或愿意求助；第一步是承认「我可以不必独自扛」。",
      keywords: ["困局", "焦虑", "松绑"],
    },
    Nine: {
      uprightZh: "担忧失眠、最坏想象盘旋；区分真实威胁与灾难化念头。",
      reversedZh: "恐惧缓解、真相澄清或压抑到临界点；适度倾诉与行动可解。",
      keywords: ["忧虑", "失眠", "恐惧"],
    },
    Ten: {
      uprightZh: "痛苦结束、谷底之后的重生契机；旧循环终结，才能轻装再起。",
      reversedZh: "不愿结束、反复纠缠或残余创伤；放手是疼痛，也是出口。",
      keywords: ["结束", "谷底", "重生"],
    },
    Page: {
      uprightZh: "好奇、学习与刺探消息；新点子、新课题，用理性保持敏锐。",
      reversedZh: "搬弄是非、幼稚挑衅或信息片面；慎言，避免成为谣言链的一环。",
      keywords: ["好奇", "学习", "讯息"],
    },
    Knight: {
      uprightZh: "疾风骤雨式的行动与辩论；来得快、去得快，注意言语锋利。",
      reversedZh: "冲动伤人、虎头蛇尾或攻击性言语；先降温再沟通。",
      keywords: ["迅疾", "辩论", "冲动"],
    },
    Queen: {
      uprightZh: "独立、清晰与诚实面对真相；温柔而坚定，不被情绪绑架判断。",
      reversedZh: "冷酷、过度批判或把真相当武器；同理与边界同样重要。",
      keywords: ["独立", "诚实", "清晰"],
    },
    King: {
      uprightZh: "理性、公正与伦理权威；以原则裁断，对事不对人。",
      reversedZh: "滥用权力、双重标准或僵化教条；真正的公正是心口如一。",
      keywords: ["公正", "理性", "原则"],
    },
  },
  pentacles: {
    Ace: {
      uprightZh: "物质或技能上的新机会；种子投资、新工作、新技能带来长期回报。",
      reversedZh: "错失机会、计划空转或资源错配；先盘点基础再扩张。",
      keywords: ["机会", "资源", "种子"],
    },
    Two: {
      uprightZh: "多任务、兼顾与平衡收支；在波动中练习耐心与灵活调度。",
      reversedZh: "失衡、过劳或财务吃紧；砍掉次要项，专注真正产生价值的部分。",
      keywords: ["平衡", "兼顾", "调度"],
    },
    Three: {
      uprightZh: "团队合作、工艺精进与学徒精神；向行家学习，打磨基本功。",
      reversedZh: "各自为政、品质下滑或不愿请教；协作与标准需要重建。",
      keywords: ["协作", "技艺", "学习"],
    },
    Four: {
      uprightZh: "守财、保守与安全感囤积；稳定资产，也可能略显吝啬或封闭。",
      reversedZh: "放手流动、愿意投资自己或他人；或财务失控，需重新记账与规划。",
      keywords: ["守成", "安全", "囤积"],
    },
    Five: {
      uprightZh: "匮乏、失业或健康/财务寒冬；也是教会同理与互助的功课。",
      reversedZh: "走出困境、慈善援助或旧伤疗愈；资源慢慢回流，勿失去希望。",
      keywords: ["匮乏", "寒冬", "援助"],
    },
    Six: {
      uprightZh: "给予、慈善与公平交换；施受平衡，善意在社群中流动。",
      reversedZh: "施舍带优越感、债务压力或单方面付出；检视互惠与尊严。",
      keywords: ["慈善", "交换", "互助"],
    },
    Seven: {
      uprightZh: "长期耕耘、等待收成；评估进度，耐心比焦虑更有复利。",
      reversedZh: "急躁收割、投资失误或看不到成果想放弃；调整策略与预期。",
      keywords: ["耕耘", "等待", "评估"],
    },
    Eight: {
      uprightZh: "专注技艺、重复练习与工匠精神；细节里见专业，慢即是快。",
      reversedZh: "完美主义瘫痪、枯燥逃避或敷衍了事；找到可持续的节奏。",
      keywords: ["专注", "练习", "专业"],
    },
    Nine: {
      uprightZh: "独自享受成果、财务独立与小确幸；自给自足带来的踏实感。",
      reversedZh: "孤立、物质成瘾或拒绝分享；丰盛若无人共享，易变空洞。",
      keywords: ["独立", "自足", "享受"],
    },
    Ten: {
      uprightZh: "家族遗产、legacy 与物质传承；长期布局开花结果，重视传统。",
      reversedZh: "家族纠纷、财务依赖或价值观代沟；重新定义「传承」的意义。",
      keywords: ["传承", "家族", "legacy"],
    },
    Page: {
      uprightZh: "学习理财、实习或新技能；务实的好奇，把梦想写成可执行清单。",
      reversedZh: "懒惰、投机或基础不牢；脚踏实地比捷径更省时间。",
      keywords: ["学习", "务实", "实习"],
    },
    Knight: {
      uprightZh: "勤奋、可靠与按部就班；像老黄牛一样完成责任，值得信赖。",
      reversedZh: "僵化、无趣或只顾工作忽略生活；效率之外也需要温度与弹性。",
      keywords: ["勤奋", "可靠", "责任"],
    },
    Queen: {
      uprightZh: "滋养自己与他人、务实照顾身心与资源；温柔而懂生活的智慧。",
      reversedZh: "过度控制、物质焦虑或忽略自我需求；先照顾好自己的地基。",
      keywords: ["滋养", "务实", "照顾"],
    },
    King: {
      uprightZh: "富足、稳健与商业头脑；以纪律与慷慨经营长期繁荣。",
      reversedZh: "贪婪、吝啬或腐败；真正的富足包含诚信与分享。",
      keywords: ["富足", "稳健", "经营"],
    },
  },
};

export function getMinorMeaning(suit: SuitKey, rankEn: string): MinorMeaning {
  const byRank = MINOR_ARCANA_MEANINGS[suit];
  const m = byRank[rankEn as MinorRankEn];
  if (!m) {
    return {
      uprightZh: "此牌能量正在展开，请结合牌阵与其它牌综合阅读。",
      reversedZh: "此牌能量受阻或转向内在，请结合牌阵与其它牌综合阅读。",
      keywords: ["小阿卡纳", "流动", "学习"],
    };
  }
  return m;
}
