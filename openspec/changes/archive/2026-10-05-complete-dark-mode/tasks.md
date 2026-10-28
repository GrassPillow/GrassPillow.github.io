## 1. Token 体系扩充

- [x] 1.1 在 `App.vue` 的 `:root` 块新增语义色与辅助 token：`--c-success-base/text`、`--c-error-base/text`、`--c-warning-base/text`、`--c-info-base/text`、`--c-text-inverse`、`--c-overlay`，浅色取值参考现有绿色主题基调
- [x] 1.2 在 `[data-theme="dark"]` 块为 1.1 的每个 token 补齐深色取值，语义色仅提亮明度、保持原色相
- [x] 1.3 用脚本校验 1.1 与 1.2 的 token 集合完全一致（无遗漏、无多余）

## 2. 硬编码颜色替换

- [x] 2.1 `Toast.vue`：四种语义态的 `border-left-color` 与 `color` 改用 `--c-{sem}-base` / `--c-{sem}-text`；`.toast-close` 的 `#999` / `#666` 与 hover 底色改用 `--c-text-muted` / `--c-text-secondary` / `--c-bg-warm`
- [x] 2.2 `BackToTop.vue`：两处 `rgba(45, 122, 107, ...)` / `rgba(139, 111, 71, ...)` 阴影改为基于 `--c-primary` 与 `--c-shadow-accent` 的取值
- [x] 2.3 `ResourceView.vue`：`color: #fff` 与 `color: #ffffff` 改为 `--c-text-inverse`
- [x] 2.4 `HomeView.vue`：`color: #fff`、`background: #fff` 及装饰层 `rgba(255, 255, 255, .08/.15/.3)` 改为对应 token
- [x] 2.5 `App.vue`：`.page-title` / `.page-subtitle` 的 `#fff` 与 `rgba(255,255,255,.85)` 改用 `--c-text-inverse`；`.nav-menu` 背景 `rgba(30, 90, 74, 0.97)` 改为 `--c-overlay`；导航球边框与 `::before` 的白色半透明改为 token
- [x] 2.6 全量复查：`grep -rnE "#[0-9a-fA-F]{3,8}|rgba?\(" origin/src` 确认活动代码中仅 `:root` 与 `[data-theme="dark"]` 两个调色板块内存在颜色字面量

## 3. 变量体系收敛

- [x] 3.1 `ThemeToggle.vue`：`--border-color`、`--card-bg`、`--primary-color` 改为 `--c-border`、`--c-bg-card`、`--c-primary`
- [x] 3.2 删除 `:root` 中全部历史别名（`--primary-color`、`--primary-light`、`--primary-dark`、`--text-primary`、`--text-secondary`、`--text-muted`、`--bg-primary`、`--bg-secondary`、`--bg-tertiary`、`--card-bg`、`--border-light`、`--border-color`）及其注释
- [x] 3.3 删除死变量：`--gradient-hero`、`--gradient-primary`、`--accent-color`、`--fs-hero`、`--fs-h1`、`--fs-h2`、`--fs-h3`、`--fs-body`、`--fs-sm`、`--fs-xs`、`--radius-sm`、`--z-dropdown`、`--z-sticky`、`--z-overlay`、`--z-modal`
- [x] 3.4 保留仍有引用的变量：`--radius-md`、`--radius-lg`、`--z-base`、`--z-toast`（引用点在 `ResourceCard.vue`、`HomeView.vue`、`App.vue`）
- [x] 3.5 删除后运行 `npm run lint` 与 `npm run build`，确认无未定义变量导致的样式失效

## 4. 首屏防闪烁

- [x] 4.1 在 `origin/public/index.html` 的 `<head>` 中、样式与脚本注入前加入同步内联脚本：try/catch 读取 `localStorage` 的 `grasspillow-theme`，为 `dark` 时设置 `document.documentElement.dataset.theme = 'dark'`
- [x] 4.2 确认 `useTheme.js` 的 `initTheme()` 复用脚本已设置的属性，不产生二次闪动
- [x] 4.3 手动验证：localStorage 存深色时刷新，首屏无浅色背景闪现

## 5. 切换过渡

- [x] 5.1 为 `body`、`.resource-card`、`.filter-tag`、`.category-section`、`.toast`、`.nav-item`、`.theme-toggle` 补 `transition`，仅含 `color` / `background-color` / `border-color`
- [x] 5.2 确认未对 `transform` 类属性追加过渡
- [x] 5.3 确认 `App.vue` 现有 `prefers-reduced-motion` 全局规则已覆盖新增过渡，无需重复声明

## 6. 对比度校验

- [x] 6.1 写脚本计算深浅两套主题下所有 `文字色 × 背景色` 组合的对比度，低于 4.5:1 的组合列出来源行号
- [x] 6.2 依据校验结果调整 `:root` 与 `[data-theme="dark"]` 取值直至全部达标
- [x] 6.3 人工在深浅两种主题下过一遍首页、分类列表页、触发四种 Toast，检查次要文字（分类徽标、统计标签、域名）可辨识

## 7. 收尾

- [x] 7.1 `npm run lint` 通过
- [x] 7.2 `npm run build` 通过，产物中确认无 gradient 字符串
- [x] 7.3 运行 `./deploy.sh`，确认构建产物复制到仓库根目录
- [x] 7.4 更新 `CLAUDE.md`：变量体系说明（单一 `--c-*`、无别名、禁渐变）、新增 token 清单、内联防闪烁脚本说明
- [x] 7.5 `openspec validate complete-dark-mode --strict` 通过
- [ ] 7.6 `openspec archive complete-dark-mode`
