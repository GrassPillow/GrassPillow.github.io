# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

GrassPillow 的个人网站，托管在 GitHub Pages（https://grasspillow.github.io/）。基于 Vue 3 + TypeScript 的单页应用，包含静态数据。

## 常用命令

所有命令在 `origin/` 目录下执行：

```bash
cd origin
npm run serve      # 开发服务器，热重载
npm run build      # 生产构建 → origin/dist/
npm run lint       # ESLint 代码检查
```

## 部署流程

网站从**仓库根目录**部署到 GitHub Pages。`deploy.sh` 脚本流程：
1. 删除根目录下除了 `.idea/`、`origin/`、`.gitignore`、`deploy.sh`、`README.md`、`.git` 之外的所有文件
2. 在 `origin/` 中执行 `npm run build`
3. 将 `origin/dist/` 内容复制到仓库根目录

部署后，需要 `git add` 根目录下的 `index.html`、`css/`、`js/`、`favicon.ico` 和 CSV 文件。

## 架构

**源代码在 `origin/`，构建产物在根目录。** 这是一个 Vue CLI 项目。根目录下的 `index.html`、`css/`、`js/` 和静态资源均为构建输出，不要直接编辑。

```
origin/src/
├── main.ts              # 应用入口，全局 ResizeObserver 错误抑制
├── App.vue              # 根组件：悬浮导航球、Toast、回到顶部、页面过渡
├── router/index.ts      # 全部路由定义
├── views/               # 页面级组件
├── components/          # 可复用 UI 组件
├── composables/         # Vue composables（useToast）
└── assets/              # 静态资源
```

**路由：** `/`（首页）、`/about`（关于）、`/projects`（作品集）、`/blog` + `/blog/post/:id`（博客）、`/tools/ai`（AI工具）、`/tools/clock`（时钟）、`/tools/earthquake`（地震监测）、`/books`（阅读清单）

**静态数据：** `books.csv`（阅读清单，含书名/作者/分类）、`ai-websites.csv`（AI工具导航）。由组件在构建时解析使用，不走 API。

**核心依赖：** Vue 3、Vue Router 4、高德地图 JSAPI Loader、Axios、@giscus/vue。

**全局模式：**
- Toast 通知通过 `window.$toast`（由 `Toast.vue` 暴露）和 `useToast()` composable 使用
- ResizeObserver loop 错误在 `main.ts` 和 `vue.config.js` devServer 中全局抑制
- `<router-view>` 使用 `<transition name="page" mode="out-in">` 实现页面切换动画
- 博客有列表/详情/管理视图，但博客数据直接内嵌在组件中
