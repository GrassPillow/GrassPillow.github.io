# 为时间线和相册页面添加动画效果

## 目标

将现有的 `useAnimation` 和 `useLazyLoad` 可组合项连接到 TimelineView 和 GalleryView，
使页面在滚动时具有流畅的入场动画，图片延迟加载，统计数据数字滚动效果。

## 非目标

- 不修改 HomeView、AboutView、BlogView（保持范围精简）
- 不引入 Skeleton（静态数据无加载状态）
- 不使用 useTypewriter（不适合当前场景）

## 变更范围

- **TimelineView.vue**：统计数字使用 useCountUp 滚动动画，时间线卡片使用 useScrollAnimation 入场
- **GalleryView.vue**：图片使用 v-lazy-img 懒加载，图库项使用 useScrollAnimation 交错入场
