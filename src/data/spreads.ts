import type { SpreadSlot, SpreadType } from "@/types/tarot";

export const SPREAD_LABELS: Record<
  SpreadType,
  { title: string; desc: string; comingSoon?: boolean }
> = {
  single: { title: "单张神谕", desc: "一针见血的当下讯息" },
  three_past_present_future: {
    title: "三张时间之河",
    desc: "过去 · 现在 · 未来",
  },
  celtic_cross: {
    title: "凯尔特十字",
    desc: "深度全景（即将开启）",
    comingSoon: true,
  },
};

export function slotsForSpread(spread: SpreadType): SpreadSlot[] {
  switch (spread) {
    case "single":
      return [{ id: "now", labelZh: "核心讯息", labelEn: "Core" }];
    case "three_past_present_future":
      return [
        { id: "past", labelZh: "过去", labelEn: "Past" },
        { id: "present", labelZh: "现在", labelEn: "Present" },
        { id: "future", labelZh: "未来", labelEn: "Future" },
      ];
    case "celtic_cross":
      return Array.from({ length: 10 }, (_, i) => ({
        id: `cc_${i}`,
        labelZh: `位置 ${i + 1}`,
        labelEn: `Position ${i + 1}`,
      }));
    default:
      return [];
  }
}
