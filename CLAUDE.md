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

> `deploy.sh` 以脚本所在目录（仓库根）为目标，不受调用时的工作目录影响。

## 架构

**源代码在 `origin/`，构建产物在根目录。** 这是一个 Vue CLI 项目。根目录下的 `index.html`、`css/`、`js/` 和静态资源均为构建输出，不要直接编辑。生产构建不生成 source map（`vue.config.js` 中 `productionSourceMap: false`）。

```
origin/src/
├── main.ts              # 应用入口，全局 ResizeObserver 错误抑制
├── App.vue              # 根组件：悬浮导航球、Toast、回到顶部、页面过渡
├── router/index.ts      # 全部路由定义（含 scrollBehavior）
├── views/
│   ├── HomeView.vue     # 资源站首页（搜索 + 分类入口 + 精选推荐）
│   └── ResourceView.vue # 通用资源列表页（搜索 / 分类筛选 / 分组展示）
├── components/          # 可复用 UI 组件（ResourceCard、Toast 等）
├── composables/         # Vue composables（useTheme）
├── utils/csv.js         # 公共 CSV 解析（支持引号/转义/CRLF/字段内换行）
├── utils/resources.js   # 资源数据加载（Promise 缓存去重）
├── check-colors.mjs     # 颜色 token 合规检查脚本（非应用代码，不入产物）
└── assets/              # 静态资源
```

**路由：** `/`（首页）、`/resources/all`（全部资源）、`/resources/website`（网站工具）、`/resources/software`（软件应用）、`/resources/learning`（学习资料）、`/resources/media`（影视音乐电子书）。其余路径由 catch-all 重定向到首页。

**静态数据：** `resources.csv`（位于 `origin/public/`，构建时复制进 dist 与仓库根目录），schema 为 `type,category,name,url,description`，由视图在**运行时**通过 axios fetch 后用 `utils/csv.js` 解析，不走 API。新增资源只需编辑该 CSV 后重新构建部署。

> 改完 `origin/public/resources.csv` 后，需同步根目录的 `resources.csv`（仓库根目录那份是随 Pages 发布的拷贝，内容应保持一致）。

**数据加载：** 统一走 `utils/resources.js` 的 `loadResources()`，模块级 Promise 缓存做请求去重，首页与所有分类列表页共用同一份数据。加载失败或解析结果为空会抛出带原因的异常，由 `ResourceView` 展示错误态并提供重试（重试走 `force: true` 绕过缓存）。

**页面过渡：** `<router-view>` 使用 `<transition mode="out-in" :duration="{ enter: 300, leave: 300 }">`（经 `PageTransition.vue` 包装）。显式 duration 用于超时兜底，避免 `transitionend` 事件未触发时切换卡死；该组件不转发 transition 钩子，请勿重新添加 `@leave` 等事件转发。

**核心依赖：** Vue 3、Vue Router 4、Axios。

**全局模式：**
- Toast 通知通过 `window.$toast`（由 `Toast.vue` 暴露）和 `useToast()` composable 使用
- ResizeObserver loop 错误在 `main.ts` 全局抑制（组件内不再重复处理）
- 全站禁用 CSS 渐变（用纯色替代）；内容宽度 1400px

## 主题与颜色 token

**唯一命名体系：** 颜色一律使用 `--c-*` 前缀，定义在 `App.vue` 的 `:root`（浅色）与 `[data-theme="dark"]`（深色）两个块中。历史别名（`--primary-color`、`--card-bg`、`--border-color` 等）已随旧站清理删除，**不要重新引入**。

**调色板清单（两套主题都必须覆盖）：**

| 类别 | Token |
|---|---|
| 品牌 | `--c-primary`、`--c-primary-light`、`--c-primary-dark`、`--c-primary-rgb` |
| 背景 | `--c-bg-page`、`--c-bg-card`、`--c-bg-warm` |
| 边框 | `--c-border` |
| 文字 | `--c-text`、`--c-text-secondary`、`--c-text-muted`、`--c-text-inverse`（深色底上的文字） |
| 浮层 | `--c-overlay`、`--c-overlay-text`、`--c-overlay-text-rgb` |
| 语义 | `--c-{success,error,warning,info}-{base,text}` |
| 阴影 | `--shadow-sm`、`--shadow-md`、`--shadow-lg`、`--c-shadow-rgb` |

`*-base` 用于图标与左边框（≥3:1，WCAG 1.4.11），`*-text` 用于文字（≥4.5:1，WCAG AA）。取值经对比度校验，调整后需重跑检查。

**半透明颜色：** 用 RGB 分量形式组合，如 `rgba(var(--c-primary-rgb), 0.3)`。组件中不得出现裸十六进制或固定 `rgba()` 颜色值。

**主题切换过渡：** `App.vue` 的「主题切换过渡」区块统一为卡片、列表容器、筛选标签、Toast、导航项等元素声明颜色过渡（仅 `color` / `background-color` / `border-color` / `box-shadow` / `opacity`，不含 `transform`）。`prefers-reduced-motion` 全局规则会自动将其压缩到接近 0。

**首屏防闪烁：** `public/index.html` 的 `<head>` 有一段同步内联脚本，在 Vue 挂载前按 `localStorage`（键 `grasspillow-theme`）→ `prefers-color-scheme` 的顺序设置 `data-theme`，避免深色用户看到白色闪屏。修改主题判定逻辑时必须同步该脚本。

**合规检查：** `node origin/src/check-colors.mjs` 校验零颜色字面量、dark 块 token 覆盖完整、无渐变。改动调色板或组件样式后必须运行。
