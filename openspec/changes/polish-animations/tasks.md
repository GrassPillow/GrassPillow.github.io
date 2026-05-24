# 任务列表

## 1. 创建 AnimatedItem 包装组件
- [x] 新建 `origin/src/components/AnimatedItem.vue`
- [x] 封装 useScrollAnimation，通过 slot 渲染子内容
- [x] props: type, duration, delay, threshold

## 2. TimelineView 统计数字动画
- [x] 重构 stats 数据结构：`{ count, suffix, label }` 替代 `{ value, label }`
- [x] 新建 CountUp.vue 封装 useCountUp + IntersectionObserver
- [x] stat 卡片进入视口时触发计数动画

## 3. TimelineView 卡片入场动画
- [x] 使用 AnimatedItem 包装每张时间线卡片
- [x] 左侧卡片 fadeRight，右侧卡片 fadeLeft
- [x] 设置交错延迟（每张卡片延迟递增 0.15s）

## 4. GalleryView 图片懒加载
- [x] 局部注册 lazyImgDirective（const vLazyImg = lazyImgDirective）
- [x] 将图库图片的 `:src` 替换为 `v-lazy-img` 指令
- [x] 灯箱图片保持直接加载（未修改）

## 5. GalleryView 图库项入场动画
- [x] 保留已有的 transition-group 动画（过滤切换效果流畅）
- [x] 跳过 AnimatedItem 包装（与 transition-group 冲突，不增加实际价值）

## 6. 构建验证
- [x] `npm run lint`：零错误
- [x] `npm run build`：编译成功 (6636ms)
