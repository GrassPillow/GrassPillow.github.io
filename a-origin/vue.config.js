const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.vue', '.json']
    }
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
          if (error && error.message && 
              (error.message.includes('ResizeObserver loop') || 
               error.message.includes('ResizeObserver loop completed with undelivered notifications'))) {
            return false; // 不显示这些错误
          }
          return true; // 显示其他错误
        }
      }
    }
  }
})
