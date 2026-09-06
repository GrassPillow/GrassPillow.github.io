## Why

`origin/src/global.d.ts` 中的类型声明（`type ToastType`、`interface ToastAPI`、`declare global`）被 eslint 当作运行时标识符检查，`npm run lint` 因此报出 16 个 `no-undef` 错误并以非零码退出。类型声明不是运行时代码，eslint（此处未启用 @typescript-eslint）无法也不应验证其内部名称，需要为 `.d.ts` 文件关闭 `no-undef`。

## What Changes

- 在 eslint 配置（`origin/package.json` 的 `eslintConfig`）中新增 `overrides`：对 `**/*.d.ts` 文件关闭 `no-undef` 规则
- 可选清理：删除 `global.d.ts` 顶部已失效的 `/* eslint-disable no-unused-vars */` 注释（该文件本就不产生 no-unused-vars 告警）
- 效果：`npm run lint` 不再因 `.d.ts` 类型声明报错；不改动任何运行时行为与类型定义

## Capabilities

### New Capabilities

- `lint-type-declarations`: 类型声明文件（`.d.ts`）参与 lint 时不会被 `no-undef` 误报，`npm run lint` 无 error 退出

### Modified Capabilities

<!-- 暂无既有 specs（openspec/specs/ 为空），无修改项 -->

## Impact

- 影响文件：`origin/package.json`（eslintConfig overrides）、`origin/src/global.d.ts`（仅可选注释清理）
- 影响面：仅 lint 静态检查；类型、运行时代码、构建产物均不受影响
- 非目标：不引入 @typescript-eslint、不改变 toast 的类型定义，不处理其余存量 `no-console` 警告
