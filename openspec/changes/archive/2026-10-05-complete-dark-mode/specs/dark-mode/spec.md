## ADDED Requirements

### Requirement: 主题判定与持久化
系统 SHALL 在用户无显式选择时依据 `prefers-color-scheme: dark` 判定初始主题，用户切换后 SHALL 将选择持久化到 `localStorage` 的 `grasspillow-theme` 键，并在后续页面加载中优先采用持久化值而非系统偏好。主题状态 SHALL 通过 `document.documentElement` 上的 `data-theme="dark"` 属性驱动 CSS 变量切换。

#### Scenario: 首次访问跟随系统偏好
- **WHEN** 用户首次访问站点，`localStorage` 中不存在 `grasspillow-theme`，且操作系统偏好为深色
- **THEN** 系统 SHALL 渲染深色主题，`document.documentElement` 上存在 `data-theme="dark"` 属性

#### Scenario: 显式选择优先于系统偏好
- **WHEN** 用户在亮色系统上主动切换到深色模式后重新加载页面
- **THEN** 系统 SHALL 渲染深色主题，不受系统亮色偏好影响

#### Scenario: 手动选择后不再跟随系统变化
- **WHEN** 用户已显式保存过主题选择，系统偏好随后发生变化
- **THEN** 系统 SHALL 保持用户已保存的主题，不自动切换

#### Scenario: 恢复跟随系统
- **WHEN** 用户两次点击主题按钮在深浅之间来回切换，或用户手动清除 `localStorage` 中的 `grasspillow-theme` 后重新加载
- **THEN** 系统 SHALL 恢复以系统偏好为判定依据

### Requirement: 首屏无主题闪烁
系统 SHALL 在首屏绘制前完成主题属性设置，使用户在深色偏好下加载页面时不会先看到浅色背景再跳变。为达成此目的，系统 MUST 在 `index.html` 的 `<head>` 中包含一段同步内联脚本，在 Vue 应用挂载前设置 `data-theme` 属性。

#### Scenario: 深色偏好用户首屏无浅色闪白
- **WHEN** `localStorage` 保存深色主题，用户加载站点
- **THEN** 系统 SHALL 在首次绘制内容前应用 `data-theme="dark"`，页面不得出现浅色背景闪现

#### Scenario: localStorage 不可用时优雅降级
- **WHEN** 内联脚本读取 `localStorage` 时抛出异常（隐私模式等场景）
- **THEN** 系统 SHALL 静默跳过该步骤，不阻塞页面渲染，并由 `useTheme` 的 `initTheme()` 完成后续主题应用

### Requirement: 颜色 token 体系
系统 SHALL 通过 CSS 自定义属性集中定义全部颜色，`origin/src/App.vue` 的 `:root` 块定义浅色主题取值，`[data-theme="dark"]` 块定义深色主题取值。活动组件的样式 SHALL NOT 包含随主题失效的硬编码颜色值；每一处前景色与背景色 SHALL 引用某个已定义的 token。

系统 SHALL 提供以下语义色 token，每个均区分深浅两套取值：

- `--c-success-base` 与 `--c-success-text`：成功态图标/左边框用与文字用
- `--c-error-base` 与 `--c-error-text`
- `--c-warning-base` 与 `--c-warning-text`
- `--c-info-base` 与 `--c-info-text`
- `--c-text-inverse`：深色背景上的浅色文字
- `--c-overlay`：浮层背景色

#### Scenario: 组件颜色全部经由 token 取值
- **WHEN** 检查 `origin/src` 下活动组件与视图的样式
- **THEN** 每处颜色声明 SHALL 引用 `var(--c-*)` 形式的 token，SHALL NOT 出现裸十六进制颜色或固定 rgba 值

#### Scenario: 深色主题覆盖全部 token
- **WHEN** `[data-theme="dark"]` 块被定义
- **THEN** 该块 SHALL 为 `:root` 中定义的每个颜色 token 提供深色取值，新增 token 时 SHALL 同步补充

#### Scenario: 语义色保持色相家族
- **WHEN** 为语义色定义深色取值
- **THEN** 系统 SHALL 仅调整明度以适配深色背景，SHALL NOT 改变各语义色的原色相家族（红/黄/蓝/绿）

### Requirement: 变量命名唯一
系统 SHALL 仅维护 `--c-*` 前缀的颜色 token 命名体系。历史遗留的非 `--c-*` 别名变量 SHALL 被移除，所有引用点 SHALL 直接使用 `--c-*` 名称。无任何组件引用的变量 SHALL 被删除。

#### Scenario: 别名层已移除
- **WHEN** 检查 `App.vue` 的 `:root` 块
- **THEN** 其中 SHALL NOT 出现 `--primary-color`、`--card-bg`、`--border-color`、`--bg-primary`、`--text-primary` 等历史别名

#### Scenario: ThemeToggle 使用统一命名
- **WHEN** 检查 `components/ThemeToggle.vue` 的样式声明
- **THEN** 其引用的颜色变量 SHALL 全部为 `--c-*` 命名

#### Scenario: 死变量已清理
- **WHEN** 检查 `:root` 块中定义但全站无引用的变量
- **THEN** `--gradient-hero`、`--gradient-primary`、`--accent-color`、`--fs-*`、`--z-dropdown`、`--z-sticky`、`--z-overlay`、`--z-modal` 等 SHALL 被删除；实际仍被引用的 `--radius-sm`、`--radius-md`、`--radius-lg`、`--z-base`、`--z-toast` SHALL 保留

#### Scenario: 全站无渐变
- **WHEN** 检查活动样式中的背景声明
- **THEN** SHALL NOT 出现 `linear-gradient` 或 `radial-gradient`，背景 SHALL 均为纯色

### Requirement: 深浅主题对比度
深浅两套主题下，资源站所有正文文字与其所在背景的对比度 SHALL 不低于 WCAG 2.1 AA 级标准（4.5:1）。Toast 的四种语义态文字在各自卡片背景上 SHALL 清晰可读。

#### Scenario: 列表页正文可读
- **WHEN** 用户在任一主题下浏览资源列表页
- **THEN** 资源名称与描述文字相对其卡片背景 SHALL 达到 4.5:1 以上对比度

#### Scenario: Toast 语义色可读
- **WHEN** 触发 success / error / warning / info 四种 Toast
- **THEN** 每种 Toast 的文字颜色与 `--c-bg-card` 背景 SHALL 达到 4.5:1 以上对比度

#### Scenario: 次要文字可辨识
- **WHEN** 用户查看分类徽标、统计标签、域名等次要信息
- **THEN** 这些文字相对背景 SHALL 达到 4.5:1 以上对比度，SHALL NOT 仅靠颜色深浅区分信息

### Requirement: 主题切换过渡
系统 SHALL 为页面主体、卡片、筛选标签、Toast、导航项等高频元素声明基于 `color`、`background-color`、`border-color` 的过渡，使主题切换呈现平滑过渡而非瞬时跳变。过渡 SHALL NOT 应用于 `transform` 类属性，以避免与既有交互动效叠加。

#### Scenario: 切换主题时平滑过渡
- **WHEN** 用户点击主题切换按钮
- **THEN** 页面背景、卡片背景、边框与文字颜色 SHALL 在约 0.3s 内渐变过渡，而非瞬间跳变

#### Scenario: 布局不发生位移
- **WHEN** 主题切换过渡进行中
- **THEN** 元素的 `transform` 与布局 SHALL 保持不变，页面 SHALL NOT 出现内容抖动

### Requirement: 减弱动效适配
系统 SHALL 在用户启用 `prefers-reduced-motion: reduce` 时禁用主题切换过渡与相关动画。现有 `App.vue` 中的全局 `prefers-reduced-motion` 规则 SHALL 覆盖新增的过渡声明，无需重复声明。

#### Scenario: 减弱动效下瞬时切换
- **WHEN** 系统偏好为 `reduce motion`，用户点击主题切换
- **THEN** 颜色 SHALL 立即完成切换，SHALL NOT 产生过渡动画

#### Scenario: 减弱动效下动效停用
- **WHEN** 系统偏好为 `reduce motion`
- **THEN** 页面上所有动画与过渡的持续时间 SHALL 被压缩至接近 0

### Requirement: 主题切换控件
系统 SHALL 提供一个固定位置的主题切换按钮，其 `aria-label` 与 `title` SHALL 反映切换动作的目标主题（而非当前主题），并 SHALL 通过 `aria-expanded` 等属性暴露可访问状态。

#### Scenario: 按钮标签描述目标动作
- **WHEN** 当前为亮色主题，用户查看切换按钮
- **THEN** 按钮的 `aria-label` 与 `title` SHALL 为「切换到深色模式」

#### Scenario: 按钮外观随主题变化
- **WHEN** 主题发生切换
- **THEN** 切换按钮自身的边框、背景与阴影 SHALL 随主题 token 变化，SHALL NOT 保持浅色硬编码样式
