#!/usr/bin/env bash
# 用桌面完整项目 tarot-oracle 上传到 GitHub Arcana（含 LFS 牌图）
# 在「终端.app」执行：bash /Users/songya/Desktop/tarot-oracle/scripts/upload-from-desktop.sh
set -euo pipefail

PROJECT="/Users/songya/Desktop/tarot-oracle"
REPO_URL="https://github.com/yasong466-create/Arcana.git"

unset HTTP_PROXY HTTPS_PROXY http_proxy https_proxy ALL_PROXY all_proxy 2>/dev/null || true

cd "$PROJECT"

if [[ ! -f package.json ]]; then
  echo "错误：请先解压桌面 tarot-oracle.zip："
  echo "  cd ~/Desktop && unzip -o tarot-oracle.zip"
  exit 1
fi

git lfs install
git lfs track "public/cards/*.jpg"

# 若还没有 git 仓库
if [[ ! -d .git ]]; then
  git init -b main
fi

git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"

git add -A
git status

if git diff --cached --quiet; then
  echo "没有新更改需要提交。"
else
  git commit -m "feat: full tarot site + card images (Git LFS)" || true
fi

echo ""
echo "→ 正在推送到 GitHub（用户名 + Token）…"
git pull origin main --rebase --allow-unrelated-histories 2>/dev/null || true
git -c http.proxy= -c https.proxy= push -u origin main

echo ""
echo "完成。打开 https://github.com/yasong466-create/Arcana 确认有 src/ 和 public/cards/"
echo "再到 Vercel 点 Redeploy。"
