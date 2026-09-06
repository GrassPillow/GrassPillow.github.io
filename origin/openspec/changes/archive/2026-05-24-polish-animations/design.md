# 设计说明

## TimelineView

### 统计数字 (useCountUp)

当前 stats 数据：
```js
{ value: '6+', label: '年编程经验' }
```

重构为：
```js
{ count: 6, suffix: '+', label: '年编程经验' }
```

每张统计卡片在进入视口时触发 useCountUp，数字从 0 滚动到目标值。

### 时间线卡片 (useScrollAnimation)

每张卡片使用 `useScrollAnimation({ type: 'fadeUp', delay: index * 0.15 })`，
实现从底部淡入的交错效果。左右两侧的卡片使用不同的动画方向：
- 左侧卡片：fadeRight（从左侧滑入）
- 右侧卡片：fadeLeft（从右侧滑入）

使用一个轻量级的 `AnimatedItem` 包装组件来在 v-for 中复用 useScrollAnimation。

## GalleryView

### 图片懒加载 (lazyImgDirective)

将 `<img :src="..." loading="lazy" />` 替换为 `<img v-lazy-img="item.thumbnail" />`。
使用已有的 lazyImgDirective，在图片进入视口前显示占位符。

### 图库项入场动画

图库项使用 CSS 动画配合延迟，在过滤切换时有流畅的过渡效果。
已有的 `<transition-group name="gallery-item">` 处理过滤时的进出动画。

## AnimatedItem 包装组件

新建一个轻量组件用于在 v-for 中复用 useScrollAnimation：

```vue
<AnimatedItem :type="'fadeUp'" :delay="0.15">
  <timeline-card ... />
</AnimatedItem>
```

约 30 行代码，模板中一行即可使用。
