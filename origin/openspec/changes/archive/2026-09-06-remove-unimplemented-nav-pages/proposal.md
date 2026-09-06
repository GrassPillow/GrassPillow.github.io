## Why

悬浮菜单栏目前把「相册 / 待办 / 音乐」三项与已实现的页面并列展示，但这三页的内容仍是示例占位（picsum 占位图、SoundHelix 演示曲目），并非真实功能，会让访客产生"功能未完成"的观感。这三个页面全站仅在悬浮菜单有一处入口，也没有任何其他视图引用，适合直接从菜单、路由与源码中彻底移除，使导航只保留已实现的页面。

## What Changes

- `origin/src/App.vue`：删除悬浮菜单中 相册、待办、音乐 三个 `router-link` 项（菜单 9 → 6 项：首页/关于/作品/博客/时间线/工具）
- `origin/src/router/index.ts`：删除 `/gallery`、`/todo`、`/music` 三条路由（访问将落入 404 兜底）
- 删除视图文件：`GalleryView.vue`、`TodoView.vue`、`MusicView.vue`
- 保留：时间线及所有其他路由/页面

## Capabilities

### New Capabilities

- `site-navigation`: 悬浮菜单只包含已实现的站点页面入口；被移除的占位页面不再可通过导航访问（直接输入旧 URL 时由 404 页兜底）

### Modified Capabilities

<!-- 暂无既有 specs 变更 -->

## Impact

- 影响文件：`origin/src/App.vue`、`origin/src/router/index.ts`，删除 `origin/src/views/{GalleryView,TodoView,MusicView}.vue`
- 影响面：站点导航结构；`/gallery`、`/todo`、`/music` 将返回 404；本地存储的待办数据不再有界面展示
- 非目标：不改动其余菜单结构、不补入阅读清单/工具子项入口、不处理其余占位图内容
