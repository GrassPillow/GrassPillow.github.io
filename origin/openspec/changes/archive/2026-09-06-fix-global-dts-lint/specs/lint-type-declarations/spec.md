## ADDED Requirements

### Requirement: 类型声明文件不触发 no-undef 误报

eslint 对 TypeScript 类型声明文件（`*.d.ts`）执行检查时，SHALL 将 `no-undef` 规则视为不适用：`type`、`interface`、`declare global` 等类型层面的标识符（如 `ToastType`、`ToastAPI`、`$toast`）不得被报告为未定义。

#### Scenario: 全量 lint 通过

- **WHEN** 在 `origin/` 目录下执行 `npm run lint`
- **THEN** 命令以退出码 0 结束，且输出中不包含任何来自 `src/global.d.ts` 的 `no-undef` error

#### Scenario: 类型声明仍被解析

- **WHEN** 关闭 `no-undef` 后重新执行 lint
- **THEN** `global.d.ts` 中的类型声明依然被正常解析，不会产生语法解析错误

### Requirement: lint 修复不改变运行时行为

本变更 SHALL 仅涉及静态检查配置，不改变任何运行时代码或类型定义。

#### Scenario: 生产构建回归

- **WHEN** 在 `origin/` 目录下执行 `npm run build`
- **THEN** 构建成功完成且不含 error（存量 no-console warning 除外）
