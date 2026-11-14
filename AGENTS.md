# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## 项目概述

GrassPillow **资源站**，托管在 GitHub Pages（https://grasspillow.github.io/）。基于 Vue 3 + TypeScript 的单页应用（Vue CLI 5），收录 4 大类网络资源：网站工具、软件应用、学习资料、影视音乐电子书。资源数据在构建时随 `resources.csv` 部署，运行时请求一次并做模块级缓存。

## 常用命令

所有命令在 `origin/` 目录下执行：

```bash
cd origin
npm run serve      # 开发服务器，热重载（historyApiFallback 已开启）
npm run build      # 生产构建 → origin/dist/
npm run lint       # ESLint 代码检查
```

> 本机环境注意：Bash 里的 `npm` 可能走 `wsl.exe` 被安全策略拦截，构建建议用 PowerShell 执行。

## 部署流程

网站从**仓库根目录**部署到 GitHub Pages。`deploy.sh` 流程：

1. 删除根目录下除白名单（`.idea`、`origin`、`.gitignore`、`deploy.sh`、`README.md`、`.git`、`CLAUDE.md`、`AGENTS.md`、`.claude`、`.agents`、`.playwright-mcp`、`.superpowers`、`.workbuddy`、`openspec`）之外的所有内容
2. 在 `origin/` 中执行 `npm run build`（脚本内 `set -e`，失败即停）
3. 将 `origin/dist/` 内容复制到仓库根目录

部署后提交产物：

```bash
git add index.html 404.html css js favicon.ico resources.csv robots.txt sitemap.xml
```

⚠️ 根目录的 `index.html`、`404.html`、`css/`、`js/`、`favicon.ico`、`resources.csv`、`robots.txt`、`sitemap.xml` 都是构建输出，**不要直接编辑**。

⚠️ 修改 `deploy.sh` 白名单时务必保留 `AGENTS.md`、`.workbuddy` 等目录，否则部署会误删文档与项目记忆。

## OpenSpec 工作流

项目使用 [OpenSpec](https://github.com/Fission-AI/OpenSpec)（`spec-driven` schema：proposal → specs → design → tasks）管理功能变更。

- **工作区位置：仓库根目录 `openspec/`**（`config.yaml` + `changes/` + `specs/`）。当前 `changes/` 下只有 `archive/`。
- 常用命令（在仓库根执行）：
  ```bash
  openspec list                       # 当前 active changes
  openspec new change "<kebab-name>"  # 新建变更
  openspec status --change "<name>"   # 查看 artifact 完成状态
  openspec validate "<name>"          # 校验变更/spec
  openspec archive "<name>"           # 完成后归档并同步主 specs
  ```
- `deploy.sh` 白名单已保留根目录 `openspec/`，部署不会清空它。

## 架构

**源代码在 `origin/`，构建产物在仓库根目录。**

```
origin/
├── src/
│   ├── main.ts                 # 入口：主题初始化、ResizeObserver 错误抑制、挂载应用
│   ├── App.vue                 # 根组件：悬浮导航球、主题切换、Toast、回到顶部、页面过渡
│   ├── router/index.ts         # 路由定义 + 标题守卫 + 滚动行为
│   ├── views/
│   │   ├── HomeView.vue        # 首页：hero、分类入口、精选资源
│   │   └── ResourceView.vue    # 分类列表页（按 props.type 复用：all/website/software/learning/media）
│   ├── components/
│   │   ├── ResourceCard.vue    # 资源卡片（收藏、复制链接）
│   │   ├── PageTransition.vue  # 页面过渡（显式 duration，避免 transitionend 缺失卡死）
│   │   ├── BackToTop.vue
│   │   ├── ThemeToggle.vue
│   │   └── Toast.vue
│   ├── composables/
│   │   ├── useTheme.js         # 明暗主题（localStorage: grasspillow-theme）
│   │   └── useFavorites.js     # 收藏（localStorage: gp:favorites + favorites-changed 事件）
│   ├── utils/
│   │   ├── csv.js              # 轻量 CSV 解析（支持引号/转义/字段内换行/CRLF）
│   │   └── resources.js        # 资源加载：模块级 Promise 缓存 + 时间戳绕过 CDN 缓存
│   └── check-colors.mjs        # 颜色审查小脚本（开发辅助，不参与构建）
├── public/
│   ├── index.html              # 模板（含防闪烁主题内联脚本、SEO/OG meta）
│   ├── favicon.ico
│   └── resources.csv           # 唯一资源数据源
├── vue.config.js               # 构建配置
├── tsconfig.json / jsconfig.json
└── package.json
```

**路由：** `/`（首页）、`/resources/all`、`/resources/website`、`/resources/software`、`/resources/learning`、`/resources/media`（均复用 `ResourceView`，通过 `props.type` 区分）、`/:pathMatch(.*)*`（重定向回首页）。全部懒加载，每条路由带 `meta.title`。

**数据流：** `public/resources.csv` 是唯一数据源 → `utils/resources.js` 的 `loadResources()` 请求 `/resources.csv?v=<timestamp>`（绕过 GitHub Pages CDN 缓存）→ `utils/csv.js` 解析 → 视图按分类过滤展示。同一页面生命周期内复用模块级缓存，避免分类切换重复请求。

**收藏：** `useFavorites.js` 以资源 URL 为键存入 `localStorage('gp:favorites')`，变更时派发 `favorites-changed` 事件，列表页据此实时刷新「仅看收藏」。localStorage 异常时降级为内存态。

**主题：** `data-theme="dark"` + CSS 变量；`grasspillow-theme` 持久化；`public/index.html` 内联脚本在 Vue 挂载前判定主题，防止深色模式闪烁。

**SPA 深链接回退：** `vue.config.js` 通过额外的 `html-webpack-plugin`（`html-404`）生成 `404.html`，内容即完整应用。GitHub Pages 对未知路径返回该页，Vue Router 按 `window.location.pathname` 正常渲染对应路由；未匹配路径由 catch-all 重定向回首页。**不要在 `public/` 手写 `404.html`**，会与构建产物冲突。

**构建配置：**
- `productionSourceMap: false`（产物不含 .map）
- 生产构建移除 `fork-ts-checker`（规避 `@types/node` 兼容问题）
- devServer：`historyApiFallback: true`；overlay 过滤 ResizeObserver 循环错误（已知浏览器问题，不影响功能）

## 核心依赖

- 运行时：`vue` 3、`vue-router` 4、`axios`（仅资源 CSV 请求）、`core-js`
- 构建：Vue CLI 5、TypeScript 5、ESLint 7 + eslint-plugin-vue 8
- 无 UI 框架、无地图/Giscus/Cypress/Percy，样式全部手写
