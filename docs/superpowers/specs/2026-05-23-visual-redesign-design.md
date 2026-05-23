# 视觉风格升级 — 设计规范

## 概述

引入 CSS 自定义属性统一管理色板、字体、阴影、圆角，渐进替换硬编码样式。方向：绿 + 暖灰/米白，温和自然。

## 色彩体系

```
--c-primary:       #2d7a6b   主按钮、链接、强调元素
--c-primary-light: #e8f5f1   绿色背景、选中态
--c-primary-dark:  #1e5a4a   悬停态、渐变终点
--c-bg-page:       #faf9f7   页面底色（暖米白）
--c-bg-card:       #ffffff   卡片/容器背景
--c-bg-warm:       #f5f3ef   暖灰分区背景
--c-border:        #e8e4df   边框/分割线
--c-text:          #2c3e2d   主文本（深绿灰）
--c-text-secondary:#6b7a6d   次要文本
--c-text-muted:    #9ba89c   占位/禁用文本
```

## 字体层级

```
--fs-hero: 3rem / 1.15     首页大标题
--fs-h1:   2.2rem / 1.25   页面标题
--fs-h2:   1.6rem / 1.3    区块标题
--fs-h3:   1.2rem / 1.4    卡片标题
--fs-body: 1rem / 1.65     正文
--fs-sm:   0.875rem / 1.5  辅助文字、标签
--fs-xs:   0.75rem / 1.4   日期、计数
```

字体栈：系统默认，不加自定义字体。

## 阴影

```
--shadow-sm: 0 1px 3px  rgba(0,0,0,0.04)   卡片默认
--shadow-md: 0 4px 16px rgba(0,0,0,0.06)   卡片悬停、弹窗
--shadow-lg: 0 8px 32px rgba(0,0,0,0.08)   模态框、导航菜单
```

悬浮球保留彩色阴影作为例外。

## 圆角

```
--radius-sm: 8px    按钮、标签、输入框
--radius-md: 12px   卡片
--radius-lg: 20px   大型区块、模态框
```

## 间距（补充建议）

```
--space-xs: 0.25rem
--space-sm: 0.5rem
--space-md: 1rem
--space-lg: 1.5rem
--space-xl: 2rem
--space-2xl: 3rem
--space-3xl: 5rem
```

## 渐变规则

- 页面 Hero 区域：`linear-gradient(135deg, #1e5a4a, #2d7a6b)` — 纯绿，不用金色
- 按钮/标签渐变：统一为单色或绿-深绿
- 卡片背景渐变：移除，用纯白 `--c-bg-card`
- 文字渐变（-webkit-background-clip: text）：改为纯色 `--c-primary`

## 实施范围

1. `App.vue`：定义所有 CSS 变量，改 body 背景为 `--c-bg-page`
2. `HomeView.vue`：替换硬编码色值，简化 Hero 渐变
3. `AboutView.vue`：同上
4. `AIView.vue`：替换卡片、筛选栏、统计栏颜色
5. `BlogView.vue`、`BlogPostView.vue`、`BlogManageView.vue`：替换
6. `ProjectsView.vue`：替换
7. `BookListView.vue`、`ClockView.vue`：替换
8. `EarthquakeList.vue`、`EarthquakeMap.vue`：替换
9. `DataTable.vue`：替换表格边框、悬停、分页颜色
10. 其余组件：`Toast.vue`、`BackToTop.vue`、`WebsiteCard.vue`、`PostEditor.vue`、`CommentSection.vue`、`MapLegend.vue`、`AnimationControls.vue`

## 不变内容

- 布局结构不变
- 组件拆分不变
- 路由不变
- 功能逻辑不变
- 浮动导航球保留，但渐变改为纯绿
