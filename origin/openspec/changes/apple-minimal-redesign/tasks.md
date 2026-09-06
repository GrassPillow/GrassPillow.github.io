## 1. 全局令牌与排版

- [x] 1.1 重设 `App.vue` `:root` / `[data-theme="dark"]` 令牌：灰白背景阶、1d1d1f 文字、发丝边框、弱阴影、极简渐变（保留品牌绿 `--primary-color`）
- [x] 1.2 在全局样式中定义系统字体栈、正文基准字号、标题字重/字距、`page-title`/`page-subtitle` 文本令牌色（浅色深字/深色浅字），并补充 `--page-header-*` 页头背景令牌

## 2. 共享组件

- [x] 2.1 悬浮导航球与展开菜单磨砂化（`App.vue` 内 `.floating-nav-*` 样式）
- [ ] 2.2 通用卡片/按钮/主题切换等共享样式按极简令牌微调（涉及 `App.vue` 全局与 Toast/BackToTop 等组件）

## 3. 视图页头与色值收敛（浅色极简页头 + 令牌化）

- [ ] 3.1 首页 `HomeView.vue`：hero 轻量化（浅色渐变 + 深色大字），收敛硬编码色
- [ ] 3.2 关于 `AboutView.vue`、作品 `ProjectsView.vue`：页头/标题/卡片令牌化
- [ ] 3.3 博客 `BlogView.vue` / `BlogPostView.vue` / `BlogManageView.vue`：页头与正文区域令牌化
- [ ] 3.4 工具组 `AIView.vue` / `ClockView.vue` / `EarthquakeList.vue`：页头与内容令牌化（地震页沿用既有极简卡）
- [ ] 3.5 书籍 `BookListView.vue` / `BookCard.vue`：页头/卡片令牌化
- [ ] 3.6 时间线 `TimelineView.vue`、404 `NotFoundView.vue` 及其余杂项：令牌化收尾

## 4. 验证

- [ ] 4.1 全量检索硬编码高危色值（`#fff` 背景、`#333`/`#2c3e50` 标题、紫色系）确认收敛
- [ ] 4.2 在 `origin/` 运行 `npm run lint`，退出码 0 且无 error
- [ ] 4.3 在 `origin/` 运行 `npm run build`，构建通过
- [ ] 4.4 目视验收（serve 下浅色/深色各页面、导航球、键盘焦点）
