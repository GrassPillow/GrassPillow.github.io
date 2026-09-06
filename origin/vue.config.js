const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.vue', '.json']
    },
    // 忽略 TypeScript 类型检查错误（仅用于构建）
    ignoreWarnings: [
      /Failed to parse source map/,
      /TS1010/
    ]
  },
  chainWebpack: config => {
    config.plugin('define').tap(definitions => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
      })
      return definitions
    })
    
    // 配置 fork-ts-checker 为异步模式，不阻塞构建但保留类型检查警告
    config.plugin('fork-ts-checker').tap((args) => {
      args[0] = {
        ...args[0],
        typescript: {
          ...(args[0]?.typescript || {}),
          configFile: 'tsconfig.json',
          extensions: {
            vue: {
              ...(args[0]?.typescript?.extensions?.vue || {}),
              enabled: true
            }
          }
        },
        logger: { log: () => {}, error: console.error }
      }
      return args
    })
  },
  // 配置webpack-dev-server，忽略ResizeObserver错误
  devServer: {
    client: {
      overlay: {
        errors: true,
        warnings: false,
        // 自定义错误过滤函数
        runtimeErrors: (error) => {
          // 过滤掉ResizeObserver循环错误
          const errorMessage = error?.message || error?.toString() || '';
          const errorString = typeof error === 'string' ? error : errorMessage;
          
          if (errorString.includes('ResizeObserver loop') || 
              errorString.includes('ResizeObserver loop completed with undelivered notifications') ||
              errorString.includes('ResizeObserver loop limit exceeded')) {
            return false; // 不显示这些错误
          }
          
          // 检查错误堆栈
          if (error?.stack) {
            const stack = error.stack.toString();
            if (stack.includes('ResizeObserver')) {
              return false;
            }
          }
          
          return true; // 显示其他错误
        }
      }
    }
  }
})
