## 1. 移除菜单项与路由

- [x] 1.1 在 `origin/src/App.vue` 中删除 相册、待办、音乐 三个悬浮菜单 `router-link`（含图标与标签）
- [x] 1.2 在 `origin/src/router/index.ts` 中删除 `/gallery`、`/todo`、`/music` 三条路由定义

## 2. 删除视图文件

- [x] 2.1 删除 `origin/src/views/GalleryView.vue`、`TodoView.vue`、`MusicView.vue`

## 3. 验证

- [x] 3.1 全量检索 `GalleryView`、`TodoView`、`MusicView`、`/gallery`、`/todo`、`/music`，确认无残留引用
- [x] 3.2 在 `origin/` 下运行 `npm run lint`，退出码为 0 且无 error
- [x] 3.3 在 `origin/` 下运行 `npm run build`，构建通过无 error
