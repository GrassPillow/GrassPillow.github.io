# 视觉风格升级 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 引入 CSS 自定义属性（颜色/字体/阴影/圆角），统一替换全站硬编码样式，配色从绿金改为绿+暖灰。

**Architecture:** 在 App.vue 的全局 `<style>` 中定义所有 CSS 变量，各页面/组件文件将硬编码值替换为 `var(--token)` 引用。布局和功能逻辑不变。

**Tech Stack:** Vue 3, scoped CSS, CSS Custom Properties

---

### Task 1: App.vue — 定义 CSS 变量 + 更新全局样式

**Files:**
- Modify: `origin/src/App.vue`

- [ ] **Step 1: 在全局 `<style>` 开头添加 CSS 变量，更新 body 背景**

在 `body {` 之前插入：

```css
:root {
  /* Colors */
  --c-primary: #2d7a6b;
  --c-primary-light: #e8f5f1;
  --c-primary-dark: #1e5a4a;
  --c-bg-page: #faf9f7;
  --c-bg-card: #ffffff;
  --c-bg-warm: #f5f3ef;
  --c-border: #e8e4df;
  --c-text: #2c3e2d;
  --c-text-secondary: #6b7a6d;
  --c-text-muted: #9ba89c;

  /* Font sizes */
  --fs-hero: 3rem;
  --fs-h1: 2.2rem;
  --fs-h2: 1.6rem;
  --fs-h3: 1.2rem;
  --fs-body: 1rem;
  --fs-sm: 0.875rem;
  --fs-xs: 0.75rem;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.08);

  /* Radii */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
}
```

- [ ] **Step 2: 将 `body` 背景改为变量**

将 `background: linear-gradient(180deg, #f5f5f7 0%, #ffffff 100%);` 替换为 `background: var(--c-bg-page);`

- [ ] **Step 3: 更新悬浮导航球渐变，去除金色**

将 `.ball-button` 的 `background: linear-gradient(135deg, #2d7a6b 0%, #3a8a7a 50%, #8b6f47 100%);` 替换为 `background: linear-gradient(135deg, var(--c-primary-dark), var(--c-primary));`

`.ball-button.active` 的 `background: linear-gradient(135deg, #1e5a4a 0%, #2d7a6b 50%, #6b5537 100%);` 替换为 `background: linear-gradient(135deg, #1a4d3e, var(--c-primary-dark));`

将 `.nav-menu` 的 `background: linear-gradient(135deg, rgba(45, 122, 107, 0.98)...);` 替换为 `background: linear-gradient(135deg, rgba(45, 122, 107, 0.97), rgba(30, 90, 74, 0.97));`

- [ ] **Step 4: Commit**

```bash
git add origin/src/App.vue
git commit -m "feat: 引入CSS变量体系，更新全局背景和导航球配色"
```

---

### Task 2: HomeView.vue — 替换 Hero、卡片、按钮配色

**Files:**
- Modify: `origin/src/views/HomeView.vue`

- [ ] **Step 1: Hero 区域配色替换**

- `.hero-section` background: `#1a5d4e / #2d7a6b / #8b6f47` → `linear-gradient(135deg, var(--c-primary-dark), var(--c-primary))`
- `.hero-name` color: `#fff` (保持不变，Hero 区白字)
- `.btn-primary` background/color: `#fff / #1e5a4a` → `var(--c-bg-card) / var(--c-primary-dark)`
- `.btn-secondary` background/border: 保留半透明白色（Hero 特例）

- [ ] **Step 2: Skills/Projects/Contact 区域替换**

- `.section-title` color: `#1e5a4a` → `var(--c-primary-dark)`
- `.skill-card` background: `#f8f9fa / #fff` → `var(--c-bg-card)` 去掉渐变
- `.skill-card` border: `rgba(45, 122, 107, 0.1)` (保持)
- `.skill-name` color: `#1e5a4a` → `var(--c-primary-dark)`
- `.skill-desc` color: `#5a6a5f` → `var(--c-text-secondary)`
- `.project-card` background: `#fff` → `var(--c-bg-card)`
- `.project-name` color: `#1e5a4a` → `var(--c-primary-dark)`
- `.project-desc` color: `#5a6a5f` → `var(--c-text-secondary)`
- `.tag` background: `rgba(45, 122, 107, 0.1) / rgba(139, 111, 71, 0.1)` → `rgba(45, 122, 107, 0.1)` (单一绿色)
- `.tag` color: `#2d7a6b` → `var(--c-primary)`
- `.project-link` background: `#2d7a6b / #8b6f47` → `linear-gradient(135deg, var(--c-primary-dark), var(--c-primary))`
- `.contact-card` background: `#1a5d4e / #2d7a6b / #8b6f47` → `linear-gradient(135deg, var(--c-primary-dark), var(--c-primary))`

- [ ] **Step 3: 移除项目间渐变背景**

- `.projects-section` background: `#f8f9fa / #f0f4f2` → `var(--c-bg-warm)`

- [ ] **Step 4: Commit**

```bash
git add origin/src/views/HomeView.vue
git commit -m "feat: HomeView切换CSS变量，去除金色渐变"
```

---

### Task 3: AboutView.vue — 替换 Hero 和卡片配色

**Files:**
- Modify: `origin/src/views/AboutView.vue`

- [ ] **Step 1: 替换所有硬编码颜色为 CSS 变量**

需要读取全文件后逐处替换，核心模式：

- Hero background gradient 中的 `#1a5d4e` → `var(--c-primary-dark)`, `#2d7a6b` → `var(--c-primary)`, `#8b6f47` → 移除或改为 `var(--c-primary)`
- 卡片背景 `#fff` → `var(--c-bg-card)`
- 卡片阴影中 `rgba(45, 122, 107, ...)` → `rgba(45, 122, 107, ...)` (保持 rgba)
- 标题色 `#1e5a4a` / `#2d7a6b` → `var(--c-primary-dark)` / `var(--c-primary)`
- 文本色 `#666` / `#999` → `var(--c-text-secondary)` / `var(--c-text-muted)`
- 边框色 `#e0e0e0` / `#f0f0f0` → `var(--c-border)`
- 页面背景 `#f5f7fa` → `var(--c-bg-page)`

- [ ] **Step 2: Commit**

```bash
git add origin/src/views/AboutView.vue
git commit -m "feat: AboutView切换CSS变量，去除金色渐变"
```

---

### Task 4: AIView.vue + WebsiteCard.vue — 替换搜索/卡片区域

**Files:**
- Modify: `origin/src/views/AIView.vue`
- Modify: `origin/src/components/WebsiteCard.vue`

- [ ] **Step 1: AIView.vue 替换**

- Header background: `#1a5d4e / #2d7a6b / ... / #8b6f47` → `linear-gradient(135deg, var(--c-primary-dark), var(--c-primary))`
- `.page-title` 的 `-webkit-text-fill-color: transparent` 渐变文字 → 改为纯白（Hero 区白字）
- `.search-filter-bar` 背景渐变 → `var(--c-bg-card)`，去掉渐变
- `.filter-tag.active` 背景渐变 → `linear-gradient(135deg, var(--c-primary-dark), var(--c-primary))`
- `.stats-bar` 背景 → `var(--c-bg-card)`
- `.category-section` 背景 → `var(--c-bg-card)`
- `.category-title` 的渐变文字 → `var(--c-primary-dark)`
- `.category-count` 背景 → `linear-gradient(135deg, var(--c-primary-dark), var(--c-primary))`
- 页面背景 `#f5f7fa` → `var(--c-bg-page)`
- 卡片悬停阴影中去除金色 rgba

- [ ] **Step 2: WebsiteCard.vue 替换**

- `.website-card` 背景渐变 → `var(--c-bg-card)`
- `.website-name` 文字渐变 → `var(--c-primary-dark)` 纯色
- `.website-link` 背景渐变 `#2d7a6b / #3a8a7a / #8b6f47` → `linear-gradient(135deg, var(--c-primary-dark), var(--c-primary))`
- `.website-category-badge` 背景中去除金色 rgba
- `.website-card::before` 渐变 → `linear-gradient(90deg, var(--c-primary-dark), var(--c-primary))`

- [ ] **Step 3: Commit**

```bash
git add origin/src/views/AIView.vue origin/src/components/WebsiteCard.vue
git commit -m "feat: AIView和WebsiteCard切换CSS变量，去除金色渐变"
```

---

### Task 5: Blog 三页面 + PostEditor + CommentSection — 批量替换

**Files:**
- Modify: `origin/src/views/BlogView.vue`
- Modify: `origin/src/views/BlogPostView.vue`
- Modify: `origin/src/views/BlogManageView.vue`
- Modify: `origin/src/components/PostEditor.vue`
- Modify: `origin/src/components/CommentSection.vue`

- [ ] **Step 1: 逐文件替换**

核心替换规则：
- `#2d7a6b` / `#1e5a4a` → `var(--c-primary)` / `var(--c-primary-dark)`
- `#8b6f47` / `#6b5537` → `var(--c-primary-dark)` (替换金色为深绿)
- `#fff` (卡片背景) → `var(--c-bg-card)`
- `#f5f5f5` (灰底) → `var(--c-bg-warm)`
- `#e0e0e0` → `var(--c-border)`
- `#333` → `var(--c-text)`
- `#666` → `var(--c-text-secondary)`
- `#999` → `var(--c-text-muted)`
- `box-shadow` 中含有彩色值的 → 改为 `var(--shadow-md)` 或带绿色 rgba 保留

- [ ] **Step 2: Commit**

```bash
git add origin/src/views/BlogView.vue origin/src/views/BlogPostView.vue origin/src/views/BlogManageView.vue origin/src/components/PostEditor.vue origin/src/components/CommentSection.vue
git commit -m "feat: Blog相关页面和组件切换CSS变量"
```

---

### Task 6: 其余页面和组件 — 收尾替换

**Files:**
- Modify: `origin/src/views/ProjectsView.vue`
- Modify: `origin/src/views/BookListView.vue`
- Modify: `origin/src/views/ClockView.vue`
- Modify: `origin/src/components/EarthquakeList.vue`
- Modify: `origin/src/components/EarthquakeMap.vue`
- Modify: `origin/src/components/DataTable.vue`
- Modify: `origin/src/components/Toast.vue`
- Modify: `origin/src/components/BackToTop.vue`
- Modify: `origin/src/components/MapLegend.vue`
- Modify: `origin/src/components/AnimationControls.vue`

- [ ] **Step 1: 批量替换所有文件中的硬编码色值**

应用与前面 task 相同的替换规则。每文件核心替换：

**ProjectsView.vue / BookListView.vue / ClockView.vue:**
- Hero/Header 渐变去金，`#8b6f47` → `var(--c-primary-dark)`
- 卡片背景 → `var(--c-bg-card)`
- 边框 → `var(--c-border)`
- 文本 → 对应变量

**EarthquakeList.vue / EarthquakeMap.vue / MapLegend.vue / AnimationControls.vue:**
- 地图组件保持功能色（震级红/橙/绿）
- 面板背景 → `var(--c-bg-card)`
- 按钮渐变去金

**DataTable.vue:**
- 边框 `#f0f0f0` → `var(--c-border)`
- 表头背景 `#fafafa` → `var(--c-bg-warm)`
- 分页激活背景 `#667eea` (保持，品牌色例外)
- 悬停背景 `#f0f7ff` (保持)

**Toast.vue:**
- 背景渐变去金
- 成功态保持绿色，错误态保持红色

**BackToTop.vue:**
- `background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%)` → `linear-gradient(135deg, var(--c-primary-dark), var(--c-primary))`
- `box-shadow` 去除金色 rgba

- [ ] **Step 2: Commit**

```bash
git add origin/src/views/ProjectsView.vue origin/src/views/BookListView.vue origin/src/views/ClockView.vue origin/src/components/EarthquakeList.vue origin/src/components/EarthquakeMap.vue origin/src/components/DataTable.vue origin/src/components/Toast.vue origin/src/components/BackToTop.vue origin/src/components/MapLegend.vue origin/src/components/AnimationControls.vue
git commit -m "feat: 其余页面和组件切换CSS变量，完成全局配色统一"
```

---

### Task 7: 构建验证 + 视觉检查

- [ ] **Step 1: 构建**

```bash
cd origin && npm run build
```

预期：编译成功，无 CSS 相关错误。

- [ ] **Step 2: 启动开发服务器检查**

```bash
cd origin && npm run serve
```

需要人工在浏览器检查：首页、关于、AI工具、博客、地震、图书等页面配色无误，渐变无金色残留。

- [ ] **Step 3: Commit 最终修正（如有）**

```bash
git add -A
git commit -m "fix: 视觉风格升级后微调"
```
