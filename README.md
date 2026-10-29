# FJW 的博客

以阅读和写作为中心的中文个人博客。Markdown 管理文章，Node.js 构建静态页面，支持 GitHub Pages。

## 本地运行

需要 Node.js 22 或更高版本。

```bash
npm ci
npm start
```

打开 http://127.0.0.1:4173 。启动时自动构建；修改内容后重启预览即可更新。

```bash
npm run build
```

构建产物位于 `dist/`。无需 Ruby、数据库或后台服务。

## 写一篇文章

在 `posts/` 下创建 Markdown 文件。文件名成为文章地址，例如 `my-first-post.md` 对应 `/posts/my-first-post/`。

```markdown
---
title: 我的第一篇文章
date: '2026-10-29'
category: 随笔
tags: [记录, 写作]
description: 这篇文章的一句话摘要。
featured: true
---

## 从这里开始

这里是正文。
```

- 标题、日期、分类和摘要为必填项；日期使用带引号的 `YYYY-MM-DD`。
- `featured: true` 设为首页精选，多篇精选时展示日期最新的一篇。
- 初始文章设置了 `sample: true`，会显示“示例文章”；发布自己的内容时移除这一项。
- 分类、标签、文章目录、阅读时间、搜索索引、RSS 和站点地图自动生成。
- 支持表格、代码块、引用；正文中的原始 HTML 不执行。
- 图片放进 `assets/`，在正文中使用 `/assets/文件名` 引用。

## 个人信息与样式

- `site.config.mjs`：博客名称、作者、简介、正式地址和 GitHub 链接。
- `scripts/build.mjs`：页面结构、关于页面和静态文件生成。
- `assets/blog.css`：响应式布局与浅色、深色主题。
- `assets/blog.js`：搜索、分类筛选、主题切换和阅读目录。

默认正式地址为 `https://fjw3214.github.io`，更换域名时修改配置中的 `url`。
搜索支持标题、摘要、正文、分类和标签；按 `Ctrl+K`（macOS 为 `⌘K`）或点击导航搜索按钮打开。
RSS 地址为 `/feed.xml`。

## GitHub Pages

`.github/workflows/pages.yml` 会在推送到 `master` 或 `main` 后构建并部署 `dist/`。
首次使用时，在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
然后推送或手动运行工作流，默认访问地址为 `https://fjw3214.github.io/`。

本地修改不会自动推送。工作流只有在代码提交并推送到 GitHub、且仓库启用了 Pages 后才会运行。
部署只使用 `dist/`，不要把整个源码目录直接当作站点目录发布。

## 改造说明

原始 Hux Blog / Jekyll 模板完整保存在 `legacy-hux/`，可随时查阅和恢复，不参与新站点的构建。
新页面不再加载原作者的广告、统计、评论、社交账号、旧域名或 Service Worker。
上游 Apache-2.0 许可证保留，来源见 `NOTICE`。
