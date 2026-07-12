# Giscus 评论系统集成设计

> 日期: 2026-07-12
> 状态: 已批准

## 目标

用 Giscus（基于 GitHub Discussions）替换 BlogPostView 中的 mock 评论区，让访客可以通过 GitHub 账号在博客文章页发表真实评论。

## 背景

BlogPostView.vue（1078 行）当前有一个完整的假评论区：
- 评论表单（textarea + 提交按钮）
- 评论列表（头像、作者、日期、内容、点赞、回复）
- mock 评论数据（2 条假评论 + 1 条假回复）
- submitComment / likeComment / replyToComment / likeReply 四个函数

这些代码约 350 行（template 72 行 + script 60 行 + CSS 190 行），全部是 mock 实现，无实际功能。评论区 CSS 还使用硬编码颜色（`background: white`、`color: #333`），不随网站明暗主题切换。

## 前置条件（需手动操作）

1. **仓库公开** — `grasspillow.github.io` 已是公开仓库 ✅
2. **开启 Discussions** — GitHub 仓库 Settings → General → Features → 勾选 Discussions
3. **安装 Giscus App** — 访问 https://github.com/apps/giscus 安装，授权给该仓库
4. **获取配置 ID** — 访问 https://giscus.app，填入仓库信息，生成 `repo-id` 和 `category-id`

## 架构

### 新增组件：`components/CommentsSection.vue`

独立评论组件，封装 `@giscus/vue`，职责单一。

**Props:**
- `mapping` (String, default: `'pathname'`) — 文章到 Discussion 的映射方式
- `term` (String, optional) — 当 mapping 非 pathname 时使用的标识

**内部逻辑:**
- 从 `useTheme` 获取 `isDark` 响应式 ref
- `computed` 计算 Giscus 主题：`isDark ? 'dark_dimmed' : 'light'`
- 传入 `@giscus/vue` 的 `<Giscus>` 组件

**为什么独立组件：** 封装主题同步逻辑，未来可复用于其他页面（如留言板）。

### 改造 `views/BlogPostView.vue`

**删除：**
- mock 评论区模板（当前第 106-178 行）：`comments-section` div 及其全部子元素
- mock 评论数据（`comments` ref，当前第 370-401 行）
- `newComment` ref
- `submitComment` / `likeComment` / `replyToComment` / `likeReply` 四个函数
- 评论区全部 CSS（`.comments-section` 到 `.reply-actions`，约 190 行）
- 文章头部统计中的 `💬 {{ post.comments }} 评论` span（评论数改由 Giscus 自带）

**保留：**
- 点赞功能（`toggleLike`）和分享功能（`shareToWeibo` / `copyLink`）— 属于文章交互，不在本次范围
- 文章头部其他统计（阅读量、点赞数）
- 上一篇/下一篇导航

**新增：**
- 在 `post-navigation`（上一篇/下一篇导航）之后引入 `<CommentsSection />`

### 依赖变更

新增 npm 依赖：`@giscus/vue`（~5KB gzipped）

## 主题同步

网站使用 CSS 变量驱动的明暗双主题（`useTheme` composable，`isDark` ref）。

Giscus `theme` prop 是响应式的——值变化时 `@giscus/vue` 自动重新加载 iframe，无需手动 postMessage。

| 网站主题 | Giscus 主题 |
|----------|-------------|
| 亮色 (`isDark = false`) | `light` |
| 暗色 (`isDark = true`) | `dark_dimmed` |

使用内置主题，不做自定义主题 JSON——零维护成本，内置主题已足够好看。

## Giscus 配置

| 配置项 | 值 | 说明 |
|--------|-----|------|
| `repo` | `GrassPillow/GrassPillow.github.io` | 已确认 |
| `repoId` | 从 giscus.app 获取 | 待填入 |
| `category` | `Announcements` | Discussion 分类 |
| `categoryId` | 从 giscus.app 获取 | 待填入 |
| `mapping` | `pathname` | 按 URL 路径映射，每篇文章独立 |
| `reactionsEnabled` | `1` | 开启表情反应 |
| `inputPosition` | `top` | 输入框在评论列表上方 |
| `lang` | `zh-CN` | 中文界面 |
| `loading` | `lazy` | 懒加载，滚到评论区时才加载 |

### mapping 选择

`mapping="pathname"` 的好处：
- 不需要每篇文章有额外 ID
- URL 路径天然唯一（`/blog/post/1`、`/blog/post/2` 各自独立）
- 文章 URL 不变则 discussion 不变

## 错误处理

- Giscus 加载失败（网络问题）：组件区域显示 Giscus 自身 fallback，不需额外处理
- repo-id / category-id 配置错误：Giscus 显示明确错误提示，方便排查
- 不加自定义 loading skeleton — Giscus 自带加载动画

## 不做什么（YAGNI）

- 不加评论数 badge — Giscus 自带计数
- 不加自定义 loading skeleton
- 不加评论通知 — GitHub Discussions 自带邮件通知
- 不做自定义主题 JSON — 内置主题够用
- 不改点赞/分享功能 — 超出本次范围

## 改动文件清单

| 文件 | 操作 |
|------|------|
| `origin/package.json` | 新增 `@giscus/vue` 依赖 |
| `origin/src/components/CommentsSection.vue` | 新建 |
| `origin/src/views/BlogPostView.vue` | 删除 mock 评论代码，引入 CommentsSection |

## 验收标准

1. 博客文章页底部显示 Giscus 评论区
2. 切换网站明暗主题时，Giscus 评论区域主题同步切换
3. 用 GitHub 账号登录后可以发表评论
4. 不同文章页（`/blog/post/1` vs `/blog/post/2`）显示各自独立的评论
5. 原 mock 评论代码全部清除，无残留
6. 构建通过，无 TypeScript 错误
