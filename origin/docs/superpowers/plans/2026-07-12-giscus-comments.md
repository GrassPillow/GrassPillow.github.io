# Giscus 评论系统集成 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 Giscus 替换 BlogPostView 中的 mock 评论区，让访客可以通过 GitHub 账号在博客文章页发表真实评论。

**Architecture:** 新建 `CommentsSection.vue` 组件封装 `@giscus/vue`，通过 `useTheme` 的 `isDark` 响应式同步明暗主题。在 `BlogPostView.vue` 中删除约 350 行 mock 评论代码（模板 + 数据 + 函数 + CSS），引入 CommentsSection 组件。

**Tech Stack:** Vue 3.2 + `@giscus/vue` + GitHub Discussions

## Global Constraints

- 源码只能编辑 `origin/src/` 下的文件，根目录是构建产物
- 构建命令在 `origin/` 目录下执行：`npm run build` / `npm run lint`
- 项目无测试框架，验证方式为 build + lint + 开发服务器可视检查
- 主题系统：`useTheme` composable 导出 `isDark` (readonly ref)，CSS 变量驱动 `[data-theme="dark"]`
- 生产构建禁用 TS 类型检查（vue.config.js chainWebpack 删 fork-ts-checker）
- Giscus 的 `repoId` 和 `categoryId` 需要从 https://giscus.app 获取，是前置条件的一部分

## File Structure

| 文件 | 操作 | 职责 |
|------|------|------|
| `origin/package.json` | 修改 | 新增 `@giscus/vue` 依赖 |
| `origin/src/components/CommentsSection.vue` | 新建 | 封装 Giscus，主题同步，可复用 |
| `origin/src/views/BlogPostView.vue` | 修改 | 删除 mock 评论代码，引入 CommentsSection |

---

### Task 1: 安装依赖并创建 CommentsSection 组件

**Files:**
- Modify: `origin/package.json`
- Create: `origin/src/components/CommentsSection.vue`

**Interfaces:**
- Produces: `CommentsSection` Vue 组件，无必需 props（内部硬编码 Giscus 配置），响应式同步主题

- [ ] **Step 1: 安装 @giscus/vue**

Run (in `origin/`):
```bash
cd origin && npm install @giscus/vue
```
Expected: 安装成功，`package.json` 的 `dependencies` 中出现 `"@giscus/vue"`

- [ ] **Step 2: 创建 CommentsSection.vue**

Create `origin/src/components/CommentsSection.vue`:

```vue
<template>
  <div class="comments-wrapper">
    <Giscus
      repo="GrassPillow/GrassPillow.github.io"
      repo-id="REPO_ID_PLACEHOLDER"
      category="Announcements"
      category-id="CATEGORY_ID_PLACEHOLDER"
      mapping="pathname"
      reactions-enabled="1"
      input-position="top"
      :theme="giscusTheme"
      lang="zh-CN"
      loading="lazy"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Giscus from '@giscus/vue'
import { useTheme } from '../composables/useTheme'

const { isDark } = useTheme()

const giscusTheme = computed(() => {
  return isDark.value ? 'dark_dimmed' : 'light'
})
</script>

<style scoped>
.comments-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
}
</style>
```

**注意：** `repo-id="REPO_ID_PLACEHOLDER"` 和 `category-id="CATEGORY_ID_PLACEHOLDER"` 是占位符。必须替换为从 https://giscus.app 获取的真实值后评论区才能正常工作。获取方式：
1. 确保 GitHub 仓库已开启 Discussions 且已安装 Giscus App
2. 访问 https://giscus.app，输入仓库 `GrassPillow/GrassPillow.github.io`
3. 选择 Discussion 分类为 Announcements
4. 页面底部生成的配置中复制 `data-repo-id` 和 `data-category-id` 的值

- [ ] **Step 3: 构建验证**

Run (in `origin/`):
```bash
cd origin && npm run build
```
Expected: 构建成功，无错误。CommentsSection 组件未被任何页面引用，但作为独立模块应该能通过构建。

- [ ] **Step 4: Commit**

```bash
cd origin && git add package.json package-lock.json src/components/CommentsSection.vue
git commit -m "feat: 添加 CommentsSection 组件封装 @giscus/vue"
```

---

### Task 2: 清理 BlogPostView mock 评论代码并集成 CommentsSection

**Files:**
- Modify: `origin/src/views/BlogPostView.vue`

**Interfaces:**
- Consumes: `CommentsSection` 组件（来自 Task 1）
- Produces: BlogPostView 文章页底部显示 Giscus 评论区

- [ ] **Step 1: 删除模板中的 mock 评论区**

在 `origin/src/views/BlogPostView.vue` 中，删除整个 `<div class="comments-section">` 块（从 `<div class="comments-section">` 到对应的闭合 `</div>`，即原文件第 106-178 行）。

删除以下代码：
```html
    <div class="comments-section">
      <h3 class="comments-title">评论 ({{ post.comments }})</h3>
      
      <div class="comment-form">
        ...（整块评论区模板，到 </div> 闭合）
      </div>
    </div>
```

- [ ] **Step 2: 删除文章头部的评论数统计**

删除 post-stats 中的评论数 span（原文件第 19 行）：
```html
              <span class="post-comments">💬 {{ post.comments }} 评论</span>
```

保留同级的阅读量和点赞数 span。

- [ ] **Step 3: 在 post-navigation 之后添加 CommentsSection**

在 `</div>` 闭合 `post-container` 之后、`</div>` 闭合 `post-detail-view` 之前，添加：
```html
    <CommentsSection />
```

同时修改 post-container 的闭合标签区域，使模板结构变为：
```html
      <div class="post-navigation">
        <router-link ...>...</router-link>
        <router-link ...>...</router-link>
      </div>
    </div>

    <CommentsSection />
  </div>
</template>
```

- [ ] **Step 4: 添加 CommentsSection 导入**

在 `<script setup>` 的 import 区域（`import { useRoute } from 'vue-router'` 之后）添加：
```js
import CommentsSection from '../components/CommentsSection.vue'
```

- [ ] **Step 5: 删除 mock 评论数据和函数**

在 `<script setup>` 中删除以下内容：

1. `newComment` ref（原文件约第 192 行）：
```js
const newComment = ref('')
```

2. `comments` ref 数组（原文件约第 370-401 行）：
```js
const comments = ref([
  {
    id: 1,
    author: '张三',
    ...（整个数组）
  }
])
```

3. `submitComment` 函数（原文件约第 478-495 行）：
```js
const submitComment = () => {
  ...
}
```

4. `likeComment` 函数（原文件约第 497-507 行）：
```js
const likeComment = (commentId) => {
  ...
}
```

5. `replyToComment` 函数（原文件约第 509-512 行）：
```js
const replyToComment = (commentId) => {
  ...
}
```

6. `likeReply` 函数（原文件约第 514-517 行）：
```js
const likeReply = (replyId) => {
  ...
}
```

- [ ] **Step 6: 删除评论相关 CSS**

删除 `<style scoped>` 中所有评论区相关的样式规则。具体删除以下选择器及其内容：

```css
.comments-section { ... }
.comments-title { ... }
.comment-form { ... }
.comment-avatar { ... }
.comment-avatar img { ... }
.comment-input-area { ... }
.comment-textarea { ... }
.comment-textarea:focus { ... }
.comment-actions { ... }  /* 第一个，form actions */
.submit-comment { ... }
.submit-comment:hover { ... }
.comments-list { ... }
.comment-item { ... }
.comment-content { ... }
.comment-header { ... }
.comment-author { ... }
.comment-date { ... }
.comment-text { ... }
.comment-actions { ... }  /* 第二个，list item actions */
.comment-action { ... }
.comment-action:hover { ... }
.replies { ... }
.reply-item { ... }
.reply-avatar { ... }
.reply-avatar img { ... }
.reply-content { ... }
.reply-header { ... }
.reply-author { ... }
.reply-date { ... }
.reply-text { ... }
.reply-actions { ... }
```

同时修改 `@media (max-width: 768px)` 响应式块：
- 将 `.post-container, .comments-section {` 改为 `.post-container {`
- 删除 `.comment-form { flex-direction: column; }` 规则

- [ ] **Step 7: 构建验证**

Run (in `origin/`):
```bash
cd origin && npm run build
```
Expected: 构建成功，无错误。无 "X is defined but never used" 警告（所有删除的变量/函数不应有残留引用）。

- [ ] **Step 8: Lint 检查**

Run (in `origin/`):
```bash
cd origin && npm run lint
```
Expected: 无错误。如有 unused variable 警告，说明有遗漏未删除的引用，返回 Step 5 检查。

- [ ] **Step 9: Commit**

```bash
cd origin && git add src/views/BlogPostView.vue
git commit -m "refactor: 用 Giscus 替换 BlogPostView mock 评论区"
```

---

### Task 3: 填入 Giscus 配置 ID 并最终验证

**Files:**
- Modify: `origin/src/components/CommentsSection.vue`

**Prerequisite:** 用户已完成 GitHub 侧操作（开启 Discussions、安装 Giscus App、从 giscus.app 获取了 repo-id 和 category-id）

- [ ] **Step 1: 替换占位符**

在 `origin/src/components/CommentsSection.vue` 中，将 `REPO_ID_PLACEHOLDER` 替换为从 giscus.app 获取的真实 `data-repo-id` 值，将 `CATEGORY_ID_PLACEHOLDER` 替换为真实的 `data-category-id` 值。

- [ ] **Step 2: 构建验证**

Run (in `origin/`):
```bash
cd origin && npm run build
```
Expected: 构建成功

- [ ] **Step 3: 开发服务器可视验证**

Run (in `origin/`):
```bash
cd origin && npm run serve
```
Expected:
1. 访问 `http://localhost:8080/blog/post/1`，页面底部显示 Giscus 评论区
2. 切换网站明暗主题，Giscus 评论区主题跟随切换
3. 访问 `http://localhost:8080/blog/post/2`，显示独立的评论区
4. 页面无 console 报错（ResizeObserver 错误除外，那是已知安全问题）

- [ ] **Step 4: Commit**

```bash
cd origin && git add src/components/CommentsSection.vue
git commit -m "chore: 填入 Giscus repo-id 和 category-id"
```

- [ ] **Step 5: 部署**

Run:
```bash
cd "C:/person/code/GrassPillow.github.io" && bash deploy.sh
```
Expected: 构建产物复制到根目录，可 push 到 GitHub Pages 部署。
