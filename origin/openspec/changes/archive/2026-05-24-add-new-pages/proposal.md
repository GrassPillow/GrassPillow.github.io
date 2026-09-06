# 新增 4 个页面并修复集成问题

## 目标

将已开发的 4 个新页面（相册、时间线、待办、音乐）连接到路由系统中，
用 PageTransition 组件替换 App.vue 中的内联过渡动画，修复 GalleryView
中的事件监听器泄漏问题，使网站可正常运行。

## 非目标

- 不连接 Skeleton / useLazyLoad / useAnimation（后续单独处理）
- 不修改 MusicView 音频播放逻辑（保持模拟播放）
- 不重构 App.vue 从 Options API 到 Composition API

## 变更范围

- **router/index.ts**：新增 4 条路由
- **App.vue**：用 `<PageTransition>` 替换内联 `<transition>`
- **GalleryView.vue**：修复键盘事件监听器未清理的问题
- **MusicView.vue**：为每首歌曲添加占位音频源（无版权音乐），使播放器可实际工作
