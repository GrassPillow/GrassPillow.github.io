# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

GrassPillow 的个人资源站，托管在 GitHub Pages（https://grasspillow.github.io/）。基于 Vue 3 + TypeScript 的单页应用，收录 4 大类网络资源（网站工具 / 软件应用 / 学习资料 / 影视音乐电子书），全部为公开、正版或免费授权渠道。

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

部署后，需要 `git add` 根目录下的 `index.html`、`css/`、`js/`、`favicon.ico`、`resources.csv` 和 `404.html`。

> 注意：若本地有其他进程占用根目录文件（如编辑器打开旧 CSV），deploy.sh 的删除阶段可能卡住，可先关闭占用进程再部署。

## 架构

**源代码在 `origin/`，构建产物在根目录。** 这是一个 Vue CLI 项目。根目录下的 `index.html`、`css/`、`js/` 和静态资源均为构建输出，不要直接编辑。生产构建不生成 source map（`vue.config.js` 中 `productionSourceMap: false`）。

```
origin/src/
├── main.ts              # 应用入口，全局 ResizeObserver 错误抑制
├── App.vue              # 根组件：悬浮导航球、Toast、回到顶部、页面过渡
├── router/index.ts      # 全部路由定义
├── views/
│   ├── HomeView.vue     # 资源站首页（搜索 + 分类入口 + 精选推荐）
│   └── ResourceView.vue # 通用资源列表页（搜索 / 分类筛选 / 分组展示）
├── components/          # 可复用 UI 组件（ResourceCard、Toast 等）
├── composables/         # Vue composables（useTheme）
├── utils/csv.js         # 公共 CSV 解析
├── legacy/              # 旧个人站归档（博客/相册/时钟等，不再参与构建）
└── assets/              # 静态资源
```

**路由：** `/`（首页）、`/resources/all`（全部资源）、`/resources/website`（网站工具）、`/resources/software`（软件应用）、`/resources/learning`（学习资料）、`/resources/media`（影视音乐电子书）。其余路径由 catch-all 重定向到首页。

**静态数据：** `resources.csv`（位于 `origin/public/`，构建时复制进 dist 与仓库根目录），schema 为 `type,category,name,url,description`，由视图在**运行时**通过 axios fetch 后用 `utils/csv.js` 解析，不走 API。新增资源只需编辑该 CSV 后重新构建部署。

**页面过渡：** `<router-view>` 使用 `<transition mode="out-in" :duration="{ enter: 300, leave: 300 }">`（经 `PageTransition.vue` 包装）。显式 duration 用于超时兜底，避免 `transitionend` 事件未触发时切换卡死；该组件不转发 transition 钩子，请勿重新添加 `@leave` 等事件转发。

**核心依赖：** Vue 3、Vue Router 4、Axios。

**全局模式：**
- Toast 通知通过 `window.$toast`（由 `Toast.vue` 暴露）和 `useToast()` composable 使用
- ResizeObserver loop 错误在 `main.ts` 全局抑制（组件内不再重复处理）
- 主题：`useTheme` 设置 `data-theme="dark"`，深色调色板在 `App.vue` 的 `[data-theme="dark"]` 中定义
- 全站禁用 CSS 渐变（用纯色替代）；内容宽度 1400px
