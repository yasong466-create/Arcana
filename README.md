This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 发布到公网（GitHub + Vercel）

### 为什么 GitHub 里只有 README、没有网站代码？

GitHub **不会**自动从你电脑同步文件夹；必须用 **`git push`** 把本地项目推上去。若从未推送、推错仓库、或在**别的文件夹**里执行了 git，网页上就会是空的或只有 README。

### 一键推送完整项目到 GitHub（推荐）

1. 在 [GitHub 新建空仓库](https://github.com/new)（例如 `magictarot`），**不要**勾选 README / .gitignore / license。  
2. 在本机打开 **终端.app**（或 VS Code / Cursor 的**本机**终端，不要用 Codespaces 里空仓库当项目根目录），执行：

```bash
cd /Users/songya/Desktop/tarot-oracle
bash scripts/push-to-github.sh https://github.com/你的用户名/magictarot.git
```

把 URL 换成你仓库页面上复制的 **HTTPS** 地址。成功后，GitHub 根目录应出现 `package.json`、`src/`、`next.config.ts` 等。

3. 打开 [Vercel New Project](https://vercel.com/new) → Import 该仓库 → Deploy（Next.js 默认即可）。  
4. （可选）Vercel → **Settings → Environment Variables**：`OPENAI_API_KEY`；不配则使用 mock 解读。

### 分步（与 `first-push.sh` 等价）

```bash
cd /Users/songya/Desktop/tarot-oracle
bash scripts/first-push.sh
```

再按脚本提示配置 `git remote` 与 `git push`。

更多说明见 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying)。
