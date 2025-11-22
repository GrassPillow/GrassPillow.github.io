const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.vue', '.json']
    }
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
