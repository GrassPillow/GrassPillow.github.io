## Context

`origin/src/global.d.ts` 声明了全局 Toast 类型（`ToastType`、`ToastAPI`、`window.$toast`）。当前 eslint 配置（`origin/package.json` 的 `eslintConfig`，基于 `eslint:recommended` + `plugin:vue/vue3-essential`，脚本由 `@babel/eslint-parser` 解析）对所有文件执行 `no-undef`。类型层面的标识符不是运行时可解析的绑定，因此产生 16 个误报，导致 `npm run lint` 以非零码退出。

## Goals / Non-Goals

**Goals:**
- `npm run lint` 无 error 通过（存量 `no-console` warning 保留，属警告级别）
- 不改动 `global.d.ts` 的类型内容，不引入新的 lint 依赖
- 修复可被 git 记录、可在任何环境复现

**Non-Goals:**
- 不引入 @typescript-eslint 全家桶或切换 parser
- 不处理存量 `no-console` 警告
- 不改变 `window.$toast` 的类型与运行时语义

## Decisions

**决策 1：使用 eslint `overrides` 对 `*.d.ts` 关闭 `no-undef`**

在 `eslintConfig` 中新增：

```jsonc
"overrides": [
  {
    "files": ["**/*.d.ts"],
    "rules": { "no-undef": "off" }
  }
]
```

理由：
- 与 @typescript-eslint 生态对 TS 的默认处理一致（TS 代码中 `no-undef` 通常关闭，由 tsc 负责类型检查）
- `.d.ts` 是纯声明文件，其中不存在"引用未定义运行时变量"这一概念；`no-undef` 在此处无意义
- 生效范围精确到 `.d.ts`，不影响 `.vue`/`.js`/`.ts` 的既有检查
- 仅一处配置改动，可移植、易回滚

备选方案与取舍：
- **方案 A：在文件顶部加 `/* eslint-disable no-undef */`** — 依赖文件内注释，新增其他 `.d.ts` 时容易漏写；且 disable 注释缺少"为什么"，不如下游配置清晰
- **方案 B：把 `global.d.ts` 加入 eslint 忽略列表** — 会让该文件彻底脱离检查，也容易被后续加入的 `.d.ts` 遗忘
- **方案 C：启用 @typescript-eslint/parser + plugin** — 属于较大的工具链变更，超出本次修复范围；Vue CLI 项目后续如需完整 TS 语义可单独立项

**决策 2（可选）：移除 `global.d.ts` 顶部 `/* eslint-disable no-unused-vars */`**

该文件当前不产生任何 `no-unused-vars` 告警（此前 16 个错误均为 `no-undef`），此注释已无实际作用。`*.d.ts` 的 `no-unused-vars` 与 `no-undef` 同理应关闭，可一并纳入 override 后删除注释，或仅删除注释、不额外关闭 `no-unused-vars`（默认即无告警）。

## Risks / Trade-offs

- [误报被隐藏而非类型真正错误] → `no-undef` 对 `.d.ts` 无类型语义，真正的类型错误由 `npm run type-check`（tsc）把关；验收含回归构建
- [override 的 glob 漏配其他目录的 `.d.ts`] → `**/*.d.ts` 覆盖任意层级；本仓库 `.d.ts` 仅此一处
- [存量 warning 使输出仍"不干净"] → warning 不改变退出码，符合现有代码库状态（大量既有 `no-console`）
