# 设计说明

## 路由设计

在现有路由数组中追加 4 条新路由：

```
/gallery    → GalleryView   (懒加载)
/timeline   → TimelineView  (懒加载)
/todo       → TodoView      (懒加载)
/music      → MusicView     (懒加载)
```

所有路由使用与现有路由相同的模式：`() => import()` 懒加载 + `meta.title`。

## 页面过渡方案

**替换** App.vue 第 4-5 行的内联 `<transition name="page" mode="out-in">`：

```
之前：                                 之后：
<transition name="page" mode="out-in"> → <PageTransition />
  <component :is="Component" .../>       <router-view v-slot="...">
</transition>                              ...
                                         </PageTransition>
```

PageTransition 默认使用 `name="page" mode="out-in"`——与现有行为完全一致。
CSS 过渡类名不变（`.page-enter-active` 等已定义在 PageTransition.vue 中）。

## 事件监听器修复

GalleryView 第 210-212 行在组件作用域内注册了 `window.addEventListener('keydown', handleKeydown)`，
但未在 `onUnmounted` 中移除。修复：添加 `onUnmounted(() => window.removeEventListener(...))`。

## 音频源

MusicView 目前所有音轨 `src: ''`。添加无版权的占位音频 URL，
使播放器控件可实际工作。
