# 任务列表

## 1. 添加路由
- [x] 在 `router/index.ts` 中为 `/gallery`、`/timeline`、`/todo`、`/music` 添加 4 条路由
- [x] 每条路由使用懒加载 import + meta.title
- **验证**：构建通过，路由可用

## 2. 集成 PageTransition
- [x] 在 `App.vue` 中：导入 PageTransition 组件
- [x] 用 `<PageTransition>` 替换内联 `<transition name="page" mode="out-in">`
- [x] 从 App.vue 样式中移走页面过渡 CSS（已存在于 PageTransition.vue）
- [x] `mode="out-in"` 已作为 prop 传入 PageTransition
- **验证**：构建通过，页面切换动画使用 PageTransition 组件

## 3. 修复 GalleryView 键盘监听器泄漏
- [x] 在 `GalleryView.vue` 中添加 `onUnmounted` 钩子
- [x] 在 onUnmounted 中移除 keydown 事件监听器
- [x] 组件卸载后不再响应键盘事件

## 4. 为 MusicView 添加音频源
- [x] 为每首歌设置 `src` 为无版权音乐 URL（SoundHelix）
- [x] 用真实的 Audio API 替换 setInterval 模拟播放
- [x] 实现 src 切换时重置/播放新音轨
- **验证**：构建通过，Audio API 集成完毕

## 5. 构建验证
- [x] 运行 `npm run build`：编译成功，无错误
- [x] 运行 `npm run lint`：零 lint 错误
- **附加修复**：PageTransition.vue 移除 TS 类型注解；Skeleton.vue ESLint 全局变量配置；package.json ESLint 配置更新
