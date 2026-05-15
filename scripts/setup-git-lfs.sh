#!/usr/bin/env bash
# 在本机项目根目录执行：bash scripts/setup-git-lfs.sh
# 作用：初始化 Git LFS，并跟踪 public/cards 下的牌图。
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v git-lfs >/dev/null 2>&1; then
  echo "未检测到 git-lfs。Mac 安装："
  echo "  brew install git-lfs"
  exit 1
fi

echo "→ 为当前用户启用 Git LFS（只需一次）…"
git lfs install

echo "→ 跟踪 public/cards/*.jpg …"
git lfs track "public/cards/*.jpg"

echo "→ 确保 .gitattributes 已纳入版本库…"
git add .gitattributes 2>/dev/null || true

if [[ ! -d public/cards ]] || [[ -z "$(ls -A public/cards 2>/dev/null)" ]]; then
  echo ""
  echo "提示：public/cards 为空或不存在，请先下载牌图："
  echo "  npm run cards:fetch"
  echo ""
else
  COUNT=$(ls -1 public/cards/*.jpg 2>/dev/null | wc -l | tr -d ' ')
  echo "→ 已发现 public/cards 内约 ${COUNT} 张 jpg"
  echo "→ 接下来请执行："
  echo "  git add public/cards .gitattributes"
  echo "  git commit -m \"chore: add card images via Git LFS\""
  echo "  git push origin main"
fi

echo ""
echo "→ 查看 LFS 跟踪规则："
git lfs track
