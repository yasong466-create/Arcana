#!/usr/bin/env bash
# 一键：下载牌图 + Git LFS + 推送到 GitHub
# 在本机「终端.app」执行：bash /Users/songya/Desktop/tarot-oracle/scripts/lfs-upload-all.sh
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/yasong466-create/Arcana.git}"
WORK_DIR="${WORK_DIR:-$HOME/Desktop/Arcana-lfs-work}"

# 避免部分环境下 git hooks 权限问题
export GIT_TEMPLATE_DIR="${GIT_TEMPLATE_DIR:-/tmp/empty-git-template-$$}"
mkdir -p "$GIT_TEMPLATE_DIR"

unset HTTP_PROXY HTTPS_PROXY http_proxy https_proxy ALL_PROXY all_proxy 2>/dev/null || true

if ! command -v git-lfs >/dev/null 2>&1; then
  echo "请先安装：brew install git-lfs && git lfs install"
  exit 1
fi

git lfs install

if [[ -d "$WORK_DIR/.git" ]]; then
  echo "→ 使用已有仓库：$WORK_DIR"
  cd "$WORK_DIR"
  git fetch origin
  git checkout main 2>/dev/null || git checkout -b main
  git pull origin main --rebase || true
else
  echo "→ 克隆仓库到 $WORK_DIR"
  rm -rf "$WORK_DIR"
  git clone "$REPO_URL" "$WORK_DIR"
  cd "$WORK_DIR"
fi

# GitHub 若只有 README：从本机完整项目复制源码
if [[ ! -f package.json && -n "${SOURCE_DIR:-}" && -f "${SOURCE_DIR}/package.json" ]]; then
  echo "→ 从 SOURCE_DIR 复制完整源码：$SOURCE_DIR"
  rsync -a --exclude node_modules --exclude .next --exclude .git \
    "${SOURCE_DIR}/" "$WORK_DIR/"
  cd "$WORK_DIR"
fi

if [[ ! -f package.json ]]; then
  echo ""
  echo "错误：GitHub 仓库里目前只有 README，没有完整网站代码（没有 package.json）。"
  echo ""
  echo "请先恢复源码，再运行本脚本。任选一种方式："
  echo "  A) 若本机还有完整项目（含 package.json、src/），执行："
  echo "     SOURCE_DIR=/路径/到/完整项目 bash $0"
  echo "  B) 从 Codespaces / 旧电脑 / 废纸篓 找回 tarot-oracle 文件夹后，用 SOURCE_DIR"
  echo "  C) 在 Cursor 里打开完整项目，用 GitHub Desktop 把整个文件夹 Publish 到 Arcana"
  echo ""
  exit 1
fi

echo "→ 配置 Git LFS 跟踪 public/cards/*.jpg"
git lfs track "public/cards/*.jpg"
git add .gitattributes 2>/dev/null || true

if [[ ! -d node_modules ]]; then
  echo "→ npm install"
  npm install
fi

if [[ ! -f public/cards/m00.jpg ]]; then
  echo "→ 下载 78 张牌图（npm run cards:fetch）"
  npm run cards:fetch
fi

COUNT=$(ls -1 public/cards/*.jpg 2>/dev/null | wc -l | tr -d ' ')
if [[ "${COUNT:-0}" -lt 70 ]]; then
  echo "警告：牌图数量偏少（$COUNT），请检查网络后重试 npm run cards:fetch"
  exit 1
fi
echo "→ 牌图数量：$COUNT"

git add public/cards .gitattributes
if git diff --cached --quiet; then
  echo "没有新文件需要提交（可能已上传过）。"
else
  git commit -m "chore: add Rider-Waite card images via Git LFS"
fi

echo "→ 推送到 GitHub（可能需要输入用户名 + Token）…"
git -c http.proxy= -c https.proxy= push -u origin main

echo ""
echo "完成。请在 GitHub 打开 public/cards/m00.jpg 确认显示 Stored with Git LFS"
echo "然后在 Vercel 点 Redeploy。"
