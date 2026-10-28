## Context

站点的深色模式由 `composables/useTheme.js` 管理：读取 `localStorage` 的 `grasspillow-theme`，未设置时回退到 `prefers-color-scheme`，通过 `document.documentElement` 上的 `data-theme="dark"` 属性驱动。调色板集中定义在 `App.vue` 的 `:root` 与 `[data-theme="dark"]` 两个块中。

当前存在四类问题：

1. **硬编码颜色**。`Toast.vue` 的四种语义色（`#2d5a4f`、`#856404`、`#0c5460` 等）为浅色背景设计的文字色，在深色下与 `--c-bg-card: #1b2421` 叠加后对比度不足；`App.vue` 导航菜单 `rgba(30, 90, 74, 0.97)`、`BackToTop.vue` 阴影中的 `rgba(45, 122, 107, ...)`、`ResourceView.vue` 统计徽标 `color: #fff` 均未随主题变化。
2. **双套变量体系**。`:root` 中存在一组"兼容旧变量名"别名（`--primary-color`、`--card-bg`、`--bg-primary` 等），注释说明是"历史视图引用"，但这些历史视图已随 `origin/src/legacy/` 清理删除。目前仅 `ThemeToggle.vue` 一个文件仍在用这套别名。
3. **死变量**。`--gradient-hero`、`--gradient-primary` 定义后无任何引用（`CLAUDE.md` 已约定全站禁用 CSS 渐变）；`--fs-*`、`--radius-*`、`--z-*` 系列同样无引用。
4. **首屏闪烁**。主题初始化在 `main.ts` 中执行，晚于 HTML 解析与 CSS 加载，深色模式用户会先看到浅色背景再跳变。

约束：全站禁用 CSS 渐变（须用纯色）；内容宽度 1400px；`prefers-reduced-motion` 已在 `App.vue` 全局禁用动画与过渡；Vue 3 + Vue CLI 5，`scoped` 样式为主，仅 `App.vue` 使用全局样式块。

## Goals / Non-Goals

**Goals:**
- 活动组件中不再存在随主题失效的硬编码颜色，全部经由 CSS 变量取值。
- 深浅两套主题下正文与背景对比度均不低于 WCAG AA（4.5:1）。
- 深色模式用户首屏无浅色闪烁。
- 变量体系收敛为单一 `--c-*` 命名，移除别名层与死变量。
- 主题切换有平滑过渡，且尊重 `prefers-reduced-motion`。

**Non-Goals:**
- 不新增主题选项（如跟随系统 / 常亮三态切换）。当前两态 + 系统回退已满足需求，扩展会牵动 `useTheme` 的持久化逻辑，属独立变更。
- 不重做整体视觉风格。沿用现有绿 + 暖灰配色体系，仅修正取值。
- 不引入 CSS 预处理器或 CSS-in-JS。保持原生 CSS 变量。
- 不处理 `openspec/changes/archive/` 下的历史归档。

## Decisions

**决策 1：新增语义色 token 而非逐处覆写。**
为 success / error / warning / info 四种语义各定义 `--c-{sem}-base`（图标与左边框用）与 `--c-{sem}-text`（文字用）两个 token，深浅主题各给一组取值。
*备选方案*：在 `[data-theme="dark"]` 中针对 `.toast.success` 等选择器逐一覆写。否决——把主题差异散落到组件样式里，与"调色板集中定义"的目标相悖，后续新增语义色还要改多处。

**决策 2：别名层整体删除，不做映射过渡。**
`ThemeToggle.vue` 是唯一使用者，改为直接引用 `--c-*` 后，连同 `--primary-color`、`--card-bg`、`--border-color` 等 12 个别名与两个 gradient 变量一并删除。
*备选方案*：保留别名映射以防未来旧代码回迁。否决——`legacy/` 已删除，别名存在的事实依据消失；保留即技术债。

**决策 3：首屏防闪烁用 `index.html` 内联同步脚本。**
在 `<head>` 内加一段极小的同步脚本，读 `localStorage` 并直接设置 `document.documentElement.dataset.theme`，随后 Vue 挂载时 `initTheme()` 复用该属性。
*备选方案*：(a) 依赖 `useTheme` 在 `main.ts` 早期执行——无法早于首屏绘制，闪烁依旧；(b) 用 `@media (prefers-color-scheme)` 的 CSS 内联块——无法覆盖用户显式选择的亮色模式。
*代价*：`localStorage` 在极端隐私模式下可能抛异常，脚本内用 try/catch 包裹并回退到不设置属性。

**决策 4：过渡只作用于颜色属性，不动 transform。**
为 `body`、`.resource-card`、`.toast`、`.nav-item` 等增加 `transition: color 0.3s, background-color 0.3s, border-color 0.3s`。`App.vue` 现有 `prefers-reduced-motion` 全局规则已把 `transition-duration` 压到 `0.01ms`，自动覆盖，无需重复处理。
*备选方案*：对 `*` 通配声明颜色过渡。否决——会影响 `::before` / `::after` 伪元素与所有装饰层，性能开销不划算。

**决策 5：导航球与导航菜单改为 token 驱动。**
`.nav-menu` 的 `rgba(30, 90, 74, 0.97)`（深绿）改为半透明的 `--c-primary-dark`；因 token 是颜色值，保留 `backdrop-filter` 模糊效果，用 `color-mix()` 混入透明度。
*备选方案*：为菜单单独定义 `--c-nav-bg`。否决——深浅主题下菜单均为深色系浮层，颜色差异不显著，复用 `--c-primary-dark` 即可，少一个 token。

## Risks / Trade-offs

- **风险：移除 `--fs-*` / `--radius-*` / `--z-*` 后若仍有隐式依赖，会导致字号或圆角回退到浏览器默认值。** → 缓解：删除前用 grep 全量核对 `origin/src` 中这些变量的引用，确认零引用；`--radius-md` 等在 `ResourceCard.vue` 有使用，需保留实际被引用的项。
- **风险：内联脚本读取 `localStorage` 在隐私模式下抛错，阻塞首屏渲染。** → 缓解：脚本整体包 try/catch，异常时静默跳过，交由 `main.ts` 的 `initTheme()` 兜底。
- **风险：语义色提亮后与绿色主题撞色。** → 缓解：语义色保持红/黄/蓝/绿的原色相，仅调整明度以适配深色背景，不改变色相家族。
- **权衡：过渡动画增加了一层合成开销。** → 缓解：仅限定在 6~7 个高频元素上，且已在减弱动效偏好下自动关闭。
- **权衡：只改颜色不动布局，部分区域（如 `.page-header` 深绿底 + 白字）视觉不变。** → 接受。这些区域在深色下本身已有足够对比度，属于既定设计而非缺陷。

## Migration Plan

1. 在 `App.vue` 的 `:root` 与 `[data-theme="dark"]` 中增补新 token，保持既有 `--c-*` 名称与取值不变。
2. 逐组件替换硬编码颜色为 token 引用（Toast → BackToTop → ResourceView → HomeView → App.vue 导航球）。
3. `ThemeToggle.vue` 切换到 `--c-*`，随后删除 `:root` 中的别名层与死变量。
4. `index.html` 加入防闪烁内联脚本。
5. 补充颜色过渡声明。
6. `npm run lint` → `npm run build` → `./deploy.sh`，人工在深浅两种主题下过一遍首页与分类列表页。

回滚：全部为样式与模板改动，无数据迁移、无 API 变更、无依赖增减，`git revert` 即可。若仅需回滚个别组件，可按文件还原。
