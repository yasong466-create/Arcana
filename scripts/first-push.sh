#!/usr/bin/env bash
# 在本机终端于项目根目录执行：bash scripts/first-push.sh
# 初始化 Git、创建首次提交，并打印关联 GitHub / Vercel 的后续命令。
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .git/config ]]; then
  echo "正在初始化 Git（若 .git 不完整会先删除重建）…"
  rm -rf .git
  git init -b main
fi

git add -A
if git diff --cached --quiet; then
  echo "没有需要提交的新更改（可能已提交过）。"
else
  git commit -m "chore: initial import (tarot-oracle)"
  echo "已创建首次提交。"
fi

echo ""
echo "—— 接下来在浏览器与本机终端完成 ——"
echo ""
echo "1) GitHub：https://github.com/new"
echo "   新建仓库名建议：tarot-oracle；不要勾选 Add a README（本地已有提交）。"
echo ""
echo "2) 关联远程并推送（把 URL 换成你的仓库）："
echo "   git remote add origin https://github.com/<你的用户名>/tarot-oracle.git"
echo "   git push -u origin main"
echo "   （若 remote 已存在，用：git remote set-url origin <URL>）"
echo ""
echo "3) Vercel：https://vercel.com/new → Import 该 GitHub 仓库 → Deploy（框架选 Next.js 即可）"
echo ""
echo "4) 可选环境变量（Vercel → Project → Settings → Environment Variables）："
echo "   OPENAI_API_KEY   → 启用真实 AI 解读；不配置则使用 mock"
echo "   OPENAI_MODEL     → 可选，默认 gpt-4o-mini"
echo ""
