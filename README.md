# 个人博客与作品集

一个极简、高雅、内容驱动的个人博客与作品集站点。基于 **Astro + Vercel** 构建，内容以 Markdown 文件形式存储在 GitHub 仓库中，并内置一个隐藏式可视化管理后台。

## 技术栈

- **Astro**：静态优先 + 按需 SSR（管理后台与 API 走 Vercel Serverless Functions）
- **Vercel**：托管与部署，每次 GitHub 推送自动重建
- **Markdown 内容集合**：文章存放于 `src/content/posts/`
- **site.json 驱动主题**：配色 / 字体 / 字号 / 动画 / 布局排序全部由 `src/content/site.json` 控制
- **GitHub API**：后台保存时通过个人令牌 (PAT) 直接向仓库提交 commit

## 本地开发

```bash
pnpm install
pnpm dev
```

本地调试管理后台时，在项目根目录创建 `.env`（已被 gitignore）：

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=你的密码
AUTH_SECRET=任意长随机串
GITHUB_TOKEN=ghp_xxx
GITHUB_REPO=你的用户名/仓库名
GITHUB_BRANCH=main
```

> Cloudflare 部署时改用 `.dev.vars` 文件，格式相同。

## 环境变量（生产）

在 Vercel 项目的 Settings → Environment Variables 中配置：

| 变量 | 说明 |
| --- | --- |
| `ADMIN_USERNAME` | 后台登录用户名 |
| `ADMIN_PASSWORD` | 后台登录密码 |
| `AUTH_SECRET` | 会话签名密钥（`openssl rand -base64 32`） |
| `GITHUB_TOKEN` | GitHub 个人令牌，需 `repo`（或细粒度 contents:write）权限 |
| `GITHUB_REPO` | 形如 `owner/repo` |
| `GITHUB_BRANCH` | 目标分支，默认 `main` |

## 部署到 Vercel

1. 把本项目推送到 GitHub 仓库。
2. 在 Vercel Dashboard 中点击 **Add New Project**，导入该仓库。
3. 构建设置（Vercel 会自动检测 Astro，通常无需手动填写）：
   - 构建命令：`pnpm build`
   - 输出目录：`.vercel/output`（由适配器自动生成）
4. 在项目 Settings → Environment Variables 中填入上表内容并保存。
5. 完成后，**每次向该分支 push（包括后台自动提交的 commit）都会触发自动重建**。

## 管理后台

- 入口：首页页脚版权文字右侧的锁形图标，或直接访问 `/studio`。
- 使用 `ADMIN_USERNAME` / `ADMIN_PASSWORD` 登录，会话以签名 Cookie 保存。
- 四个面板：
  - **内容**：新增 / 编辑 / 删除随笔与作品（保存即向 GitHub 提交对应 `.md` 文件）。
  - **外观**：配色、字体、字号、行高、圆角、动画时长 / 缓动 / 强度，带实时预览。
  - **布局**：拖拽排序首页区块、显隐切换、参数编辑，并可从预设组件库添加新区块。
  - **设置**：站点标题、描述、导航、社交链接等。
- 任意保存都会提交到 GitHub，Vercel 随后自动重载，几十秒内线上即更新。

## 内容结构

每篇内容是 `src/content/posts/*.md`，frontmatter 字段：

```yaml
---
title: 标题
description: 摘要
date: 2025-01-01
kind: writing   # 或 project
tags: [tag1, tag2]
draft: false
# project 额外可用：year / role / url / cover
---

正文（Markdown）……
```
