/**
 * 从 metabismuth/tarot-json 下载 78 张牌图到 public/cards/
 * @see https://github.com/metabismuth/tarot-json/tree/master/cards
 *
 * 用法：npm run cards:fetch
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public", "cards");

const BASES = [
  "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards",
  "https://cdn.jsdelivr.net/gh/metabismuth/tarot-json@master/cards",
];

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

function allFilenames() {
  const files = [];
  for (let i = 0; i <= 21; i++) {
    files.push(`m${String(i).padStart(2, "0")}.jpg`);
  }
  for (const p of ["w", "c", "s", "p"]) {
    for (let n = 1; n <= 14; n++) {
      files.push(`${p}${String(n).padStart(2, "0")}.jpg`);
    }
  }
  return files;
}

async function fetchFromBases(name) {
  const errors = [];
  for (const base of BASES) {
    const url = `${base}/${name}`;
    try {
      const res = await fetch(url, {
        redirect: "follow",
        headers: {
          Accept: "image/jpeg,image/*;q=0.8,*/*;q=0.5",
          "User-Agent": UA,
        },
      });
      if (!res.ok) {
        errors.push(`${new URL(base).hostname}: HTTP ${res.status}`);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 2000) {
        errors.push(`${new URL(base).hostname}: too small (${buf.length}b)`);
        continue;
      }
      return buf;
    } catch (e) {
      errors.push(`${new URL(base).hostname}: ${e.cause?.message || e.message}`);
    }
  }
  throw new Error(errors.join(" | "));
}

async function main() {
  console.log("HTTPS_PROXY =", process.env.HTTPS_PROXY || "(未设置)");
  console.log("源：metabismuth/tarot-json（旧 nkappler 路径已 404）\n");

  fs.mkdirSync(OUT, { recursive: true });
  const files = allFilenames();
  console.log(`准备下载 ${files.length} 张牌图 → ${OUT}`);

  let ok = 0;
  let skip = 0;
  let fail = 0;
  let firstErr = null;

  for (const f of files) {
    const dest = path.join(OUT, f);
    try {
      if (fs.existsSync(dest)) {
        const st = fs.statSync(dest);
        if (st.size > 2000) {
          skip++;
          continue;
        }
      }
      const buf = await fetchFromBases(f);
      fs.writeFileSync(dest, buf);
      ok++;
      if (ok % 10 === 0) process.stdout.write(`  已写入 ${ok}…\n`);
    } catch (e) {
      if (!firstErr) firstErr = `${f}: ${e.message}`;
      console.error(`  失败 ${f}: ${e.message}`);
      fail++;
    }
  }

  console.log(`\n完成：新下载 ${ok}，已存在跳过 ${skip}，失败 ${fail}`);
  if (firstErr && fail > 0) {
    console.log("\n首张失败示例：", firstErr);
  }
  if (fail > 0) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
