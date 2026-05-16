import { NextResponse } from "next/server";
import { buildUserPrompt, SYSTEM_ORACLE } from "@/lib/prompts";
import { mockInterpretation } from "@/lib/mockInterpret";
import type { DrawnCard, InterpretationPayload, SpreadType } from "@/types/tarot";

export const runtime = "nodejs";

function parseInterpretation(raw: string): InterpretationPayload {
  const stripped = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  return JSON.parse(stripped) as InterpretationPayload;
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    themeLabel: string;
    themeId?: string | null;
    question: string;
    spread: SpreadType;
    cards: DrawnCard[];
  };

  const mock = () =>
    mockInterpretation(
      body.themeLabel,
      body.question,
      body.cards,
      body.spread,
      body.themeId,
    );

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json(mock());
  }

  try {
    const prompt = buildUserPrompt({
      themeLabel: body.themeLabel,
      question: body.question,
      spread: body.spread,
      cards: body.cards,
    });

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.68,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_ORACLE },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        mock(),
      );
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = data.choices?.[0]?.message?.content?.trim() || "{}";
    try {
      return NextResponse.json(parseInterpretation(raw));
    } catch {
      return NextResponse.json(
        mock(),
      );
    }
  } catch {
    return NextResponse.json(mock());
  }
}
