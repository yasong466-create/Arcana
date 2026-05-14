#!/usr/bin/env bash
# 把本机完整 Next 项目推送到 GitHub（需在本机「终端」运行，不要用 Cursor 沙箱）。
#
# 用法：
#   bash scripts/push-to-github.sh https://github.com/你的用户名/magictarot.git
#
# 前置：在 https://github.com/new 建好空仓库，不要勾选 README / .gitignore / license。
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f package.json ]]; then
  echo "错误：当前目录没有 package.json，请从项目根目录执行本脚本。"
  exit 1
fi

if ! grep -q '"next"' package.json; then
  echo "错误：package.json 里未检测到 next，请确认这是 tarot-oracle 项目根目录。"
  exit 1
fi

REMOTE_URL="${1:-}"
if [[ -z "$REMOTE_URL" ]]; then
  echo "用法："
  echo "  bash scripts/push-to-github.sh https://github.com/你的用户名/仓库名.git"
  echo ""
  echo "示例："
  echo "  bash scripts/push-to-github.sh https://github.com/songya/magictarot.git"
  exit 1
fi

echo "项目根目录: $ROOT"
echo "远程仓库:   $REMOTE_URL"
echo ""

if [[ ! -f .git/config ]]; then
  echo "→ 初始化 Git（.git 不存在或不完整时会重建）…"
  rm -rf .git
  git init -b main
fi

git add -A
if git diff --cached --quiet; then
  echo "→ 暂存区无新文件（若从未提交过，将尝试创建空提交）…"
  if ! git rev-parse HEAD >/dev/null 2>&1; then
    git commit --allow-empty -m "chore: initial commit (tarot-oracle)"
  fi
else
  git commit -m "chore: full Next.js tarot site (tarot-oracle)"
  echo "→ 已提交。"
fi

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REMOTE_URL"
  echo "→ 已更新 origin 为上述地址。"
else
  git remote add origin "$REMOTE_URL"
  echo "→ 已添加 origin。"
fi

echo ""
echo "→ 正在推送到 GitHub（已临时关闭 HTTP 代理环境变量，避免 127.0.0.1:7890 未开启 Clash 时失败）…"
# 常见：本机设了 Clash 7890，但代理未运行时 Git 会连不上 GitHub
unset HTTP_PROXY HTTPS_PROXY http_proxy https_proxy ALL_PROXY all_proxy
if git -c http.proxy= -c https.proxy= push -u origin main; then
  echo ""
  echo "完成。请在浏览器打开你的仓库，确认根目录有 package.json、src/app 等。"
  echo "再到 https://vercel.com/new 重新 Import 并 Deploy。"
else
  echo ""
  echo "推送失败常见原因："
  echo "  0) 仍走代理：执行 git config --global --list | grep -i proxy"
  echo "     若有 http.https://github.com.proxy 等，可关闭："
  echo "       git config --global --unset http.proxy"
  echo "       git config --global --unset https.proxy"
  echo "  1) GitHub 需要登录：HTTPS 需 Personal Access Token，或改用 SSH。"
  echo "  2) 远程仓库不是空的（例如先建了 README）：先执行"
  echo "       git pull origin main --rebase --allow-unrelated-histories"
  echo "     解决冲突后再 git push -u origin main"
  exit 1
fi
