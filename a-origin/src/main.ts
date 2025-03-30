import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 告诉TypeScript router模块的类型为any，解决找不到声明文件的问题
/// <reference types="/Users/wujunfeng/GrassPillow.github.io/a-origin/src/router/index.ts" />
createApp(App)
.use(router)
.mount('#app')