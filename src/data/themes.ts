export interface OracleTheme {
  id: string;
  label: string;
  sub: string;
  emoji: string;
}

export const ORACLE_THEMES: OracleTheme[] = [
  { id: "love", label: "情感与亲密关系", sub: "心动、距离、和解", emoji: "✧" },
  { id: "career", label: "事业与自我价值", sub: "方向、瓶颈、机会", emoji: "☽" },
  { id: "growth", label: "个人成长与疗愈", sub: "阴影、勇气、整合", emoji: "✦" },
  { id: "decision", label: "抉择与十字路口", sub: "犹豫、时机、直觉", emoji: "◇" },
  { id: "spirit", label: "灵性路径与象征", sub: "梦境、征兆、内在声音", emoji: "◎" },
];
