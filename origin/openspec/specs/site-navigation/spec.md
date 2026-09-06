# site-navigation Specification

## Purpose
TBD - created by archiving change remove-unimplemented-nav-pages. Update Purpose after archive.
## Requirements
### Requirement: 悬浮菜单仅展示已实现的页面入口

悬浮导航菜单 SHALL 只包含已实现、可用作正式展示的页面入口，且 MUST NOT 包含「相册」「待办」「音乐」这类仍为占位内容的条目。

#### Scenario: 展开悬浮菜单

- **WHEN** 用户展开右下角悬浮导航球
- **THEN** 菜单只显示 首页、关于、作品、博客、时间线、工具 六项，且不出现 相册、待办、音乐

#### Scenario: 被移除页面的旧链接

- **WHEN** 用户直接访问 `/gallery`、`/todo` 或 `/music`
- **THEN** 系统 SHALL 返回 404 页面（页面未找到），而不是渲染占位页面

### Requirement: 站点源码不再包含被移除的占位页面

项目源码 SHALL 移除占位页面对应的路由配置与视图文件，避免留下孤立代码。

#### Scenario: 全量检查无残留引用

- **WHEN** 在 `origin/src/` 中检索 `GalleryView`、`TodoView`、`MusicView` 以及 `/gallery`、`/todo`、`/music` 引用
- **THEN** 检索结果为空（悬浮菜单与其余源码均不再引用它们）

