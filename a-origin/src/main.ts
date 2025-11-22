import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 告诉TypeScript router模块的类型为any，解决找不到声明文件的问题
/// <reference types="/Users/wujunfeng/GrassPillow.github.io/a-origin/src/router/index.ts" />

// 全局ResizeObserver错误处理
const originalErrorHandler = window.onerror;
window.onerror = function(message, source, lineno, colno, error) {
  // 检查是否是ResizeObserver循环错误
  const isResizeObserverError = 
    (typeof message === 'string' && 
     (message.includes('ResizeObserver loop') || 
      message.includes('ResizeObserver loop completed with undelivered notifications'))) ||
    (error && error.message && 
     (error.message.includes('ResizeObserver loop') || 
      error.message.includes('ResizeObserver loop completed with undelivered notifications')));
  
  if (isResizeObserverError) {
    // 这是一个已知的浏览器错误，我们可以安全地忽略它
    // 完全阻止错误显示
    return true;
  }
  
  // 对于其他错误，调用原始处理器
  if (originalErrorHandler) {
    return originalErrorHandler.call(this, message, source, lineno, colno, error);
  }
  return false;
};

// 同时处理未捕获的Promise错误
window.addEventListener('unhandledrejection', (e) => {
  const message = e.reason?.message || String(e.reason || '');
  if (message.includes('ResizeObserver loop') || 
      message.includes('ResizeObserver loop completed with undelivered notifications')) {
    e.preventDefault();
    return true;
  }
  return false;
});

// 处理错误事件
window.addEventListener('error', (e) => {
  const isResizeObserverError = 
    e.message && 
    (e.message.includes('ResizeObserver loop') || 
     e.message.includes('ResizeObserver loop completed with undelivered notifications'));
  
  if (isResizeObserverError) {
    e.preventDefault();
    e.stopPropagation();
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