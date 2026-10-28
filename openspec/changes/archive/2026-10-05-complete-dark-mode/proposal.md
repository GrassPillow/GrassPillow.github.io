## Why

站点已提供深色模式开关，但深色下的实际观感存在多处缺陷：多组件硬编码了浅色值（Toast 的语义色文字、导航菜单背景、列表页统计徽标底色等），在深色下对比度不足甚至不可读；`ThemeToggle` 引用了一套历史遗留的变量别名，与主 `--c-*` 体系脱节；页面首屏在 `main.ts` 执行主题初始化前会闪一下白底。深色模式目前是"能用但不完善"的状态，需要一次系统性收口。

## What Changes

- **消除硬编码颜色**：把活动组件中的浅色硬编码值替换为 CSS 变量，新增 `--c-text-inverse`、`--c-overlay`、语义色（success/error/warning/info）等 token，深浅两套主题各自定义取值。
- **收敛变量体系**：删除 `ThemeToggle.vue` 依赖的历史别名变量（`--border-color`、`--card-bg`、`--primary-color` 等），统一到 `--c-*`；清理无引用的 `--gradient-*`、`--fs-*`、`--z-*` 等死变量。
- **修复首屏闪烁**：在 `index.html` 中加入同步内联脚本，于 Vue 挂载前依据 `localStorage` 预设 `data-theme`，消除白底闪烁。
- **补齐主题切换过渡**：为卡片、导航、Toast 等元素增加基于 CSS 变量的 `color` / `background-color` / `border-color` 过渡，使切换平滑；同时保证 `prefers-reduced-motion` 下禁用过渡。
- **Toast 深色适配**：语义色文字色在深色主题下使用提亮后的取值，保证与卡片背景对比度不低于 WCAG AA（4.5:1）。

非破坏性变更：视觉与实现细节调整，不改动路由、数据 schema 或部署流程。

## Capabilities

### New Capabilities
- `dark-mode`: 深色模式的完整行为规格——主题判定与持久化、首屏无闪烁、token 体系、深浅两套主题下所有组件的颜色与对比度要求、切换过渡与减弱动效适配。

### Modified Capabilities
（无。`openspec/specs/` 当前为空，本次不修改既有规格。）

## Impact

- **样式**：`origin/src/App.vue`（`:root` 与 `[data-theme="dark"]` 调色板、导航球与导航菜单配色）、`components/Toast.vue`、`components/BackToTop.vue`、`components/ThemeToggle.vue`、`views/HomeView.vue`、`views/ResourceView.vue`。
- **模板**：`origin/public/index.html` 新增防闪烁内联脚本。
- **数据**：无。`resources.csv` 不受影响。
- **依赖**：无新增。
- **部署**：无流程变化；`index.html` 变更随常规 `deploy.sh` 构建产出。
