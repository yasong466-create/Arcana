import { NextResponse } from "next/server";
import { TAROT_DECK } from "@/data/deck";
import { riderWaiteImageFile, RW_UPSTREAM_BASES } from "@/lib/cardImage";

export const runtime = "nodejs";

const ALLOWED = new Set(TAROT_DECK.map((c) => riderWaiteImageFile(c)));

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

/**
 * 同源代理（兜底）。若本机 Node 也访问不了 GitHub，请用浏览器直连顺序或 `npm run cards:fetch`。
 * GET /api/card-image/00-fool.jpg
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ name: string }> },
) {
  const { name } = await context.params;
  if (!name || !ALLOWED.has(name)) {
    return new NextResponse(null, { status: 404 });
  }

  let lastStatus = 502;

  for (const base of RW_UPSTREAM_BASES) {
    try {
      const res = await fetch(`${base}/${name}`, {
        headers: {
          Accept: "image/jpeg,image/*;q=0.8,*/*;q=0.5",
          "User-Agent": UA,
        },
        next: { revalidate: 86400 },
      });
      lastStatus = res.status;
      if (!res.ok) continue;
      const buf = await res.arrayBuffer();
      if (buf.byteLength < 500) continue;
      return new NextResponse(buf, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      });
    } catch {
      lastStatus = 502;
    }
  }

  return new NextResponse(null, { status: lastStatus === 404 ? 404 : 502 });
}
