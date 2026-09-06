## 1. 修改 eslint 配置

- [x] 1.1 在 `origin/package.json` 的 `eslintConfig` 中新增 `overrides`，对 `**/*.d.ts` 文件关闭 `no-undef` 规则

## 2. 清理与验证

- [x] 2.1 移除 `origin/src/global.d.ts` 顶部失效的 `/* eslint-disable no-unused-vars */` 注释（类型声明不再产生该告警）
- [x] 2.2 在 `origin/` 下运行 `npm run lint`，确认退出码为 0 且无 `no-undef` error（存量 `no-console` warning 除外）
- [x] 2.3 在 `origin/` 下运行 `npm run build`，确认构建回归通过（无 error）
