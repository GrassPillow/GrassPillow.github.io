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
1. 删除根目录下除了 `.idea/`、`origin/`、`.gitignore`、`deploy.sh`、`README.md`、`.git`、`CLAUDE.md`、`.claude`、`openspec` 之外的所有文件
2. 在 `origin/` 中执行 `npm run build`（脚本已启用 `set -e`，构建失败立即中止）
3. 将 `origin/dist/` 内容复制到仓库根目录

部署后，需要 `git add` 根目录下的 `index.html`、`css/`、`js/`、`favicon.ico` 和 CSV 文件。

## 架构

**源代码在 `origin/`，构建产物在根目录。** 这是一个 Vue CLI 项目。根目录下的 `index.html`、`css/`、`js/` 和静态资源均为构建输出，不要直接编辑。生产构建不生成 source map（`vue.config.js` 中 `productionSourceMap: false`）。

```
origin/src/
├── main.ts              # 应用入口，全局 ResizeObserver 错误抑制
├── App.vue              # 根组件：悬浮导航球、Toast、回到顶部、页面过渡
├── router/index.ts      # 全部路由定义
├── views/               # 页面级组件
├── components/          # 可复用 UI 组件
├── composables/         # Vue composables（useToast、useTheme、useLazyLoad）
├── utils/csv.js         # 公共 CSV 解析（books/ai-websites 共用）
└── assets/              # 静态资源
```

**路由：** `/`（首页）、`/about`（关于）、`/projects`（作品集）、`/blog`、`/blog/post/:id`、`/blog/manage`（博客管理）、`/tools/ai`（AI工具）、`/tools/clock`（时钟）、`/tools/earthquake`（地震监测）、`/books`（阅读清单）、`/book/detail`（图书详情）、`/gallery`（相册）、`/timeline`（时间线）、`/todo`（待办）、`/music`（音乐）

**静态数据：** `books.csv`（阅读清单，含书名/作者/分类）、`ai-websites.csv`（AI工具导航）。CSV 位于 `origin/public/`（构建时复制进 dist 与仓库根目录），由视图在**运行时**通过 axios fetch 后用 `utils/csv.js` 解析，不走 API。

**核心依赖：** Vue 3、Vue Router 4、高德地图 JSAPI Loader（`@amap/amap-jsapi-loader`）、Axios。表格为自研 `DataTable`（不再使用 ant-design-vue）。

**密钥管理：** 高德 key 与 securityJsCode 通过 `origin/.env.local`（已 gitignore，模板见 `.env.example`）以 `VUE_APP_AMAP_KEY` / `VUE_APP_AMAP_SECURITY_CODE` 注入，勿硬编码进源码；请在控制台为 key 配置 referer 域名白名单。

**全局模式：**
- Toast 通知通过 `window.$toast`（由 `Toast.vue` 暴露）和 `useToast()` composable 使用
- ResizeObserver loop 错误在 `main.ts` 全局抑制（组件内不再重复处理）
- `<router-view>` 使用 `<transition name="page" mode="out-in">` 实现页面切换动画
- 主题：`useTheme` 设置 `data-theme="dark"`，深色调色板在 `App.vue` 的 `[data-theme="dark"]` 中定义；`:root` 中保留了旧变量名（`--primary-color`、`--card-bg` 等）到 `--c-*` 体系的兼容映射
- 全站禁用 CSS 渐变（用纯色替代）；内容宽度 1400px
- 博客有列表/详情/管理视图，博客数据内嵌在组件中（管理页可持久化到 localStorage）
