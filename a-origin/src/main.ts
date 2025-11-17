import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 告诉TypeScript router模块的类型为any，解决找不到声明文件的问题
/// <reference types="/Users/wujunfeng/GrassPillow.github.io/a-origin/src/router/index.ts" />

// 全局ResizeObserver错误处理
window.addEventListener('error', (e) => {
  // 检查是否是ResizeObserver循环错误
  const isResizeObserverError = 
    e.message && 
    (e.message.includes('ResizeObserver loop') || 
     e.message.includes('ResizeObserver loop completed with undelivered notifications'));
  
  if (isResizeObserverError) {
    // 这是一个已知的浏览器错误，我们可以安全地忽略它
    console.warn('Global ResizeObserver loop error caught and handled');
    // 防止错误冒泡到控制台和webpack-dev-server的错误覆盖层
    if (e.preventDefault) {
      e.preventDefault();
    }
    return true;
  }
  return false;
}, { capture: true });

// 创建Vue应用实例
const app = createApp(App)

// 使用路由
app.use(router)

// 挂载应用
app.mount('#app')