import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 告诉TypeScript router模块的类型为any，解决找不到声明文件的问题
/// <reference types="/Users/wujunfeng/GrassPillow.github.io/a-origin/src/router/index.ts" />

// 全局ResizeObserver错误处理
const originalErrorHandler = window.onerror;
window.onerror = function(message, source, lineno, colno, error) {
  // 检查是否是ResizeObserver循环错误
  const messageStr = typeof message === 'string' ? message : String(message || '');
  const errorMessage = error?.message || '';
  const errorStack = error?.stack || '';
  
  const isResizeObserverError = 
    messageStr.includes('ResizeObserver loop') || 
    messageStr.includes('ResizeObserver loop completed with undelivered notifications') ||
    messageStr.includes('ResizeObserver loop limit exceeded') ||
    errorMessage.includes('ResizeObserver loop') ||
    errorMessage.includes('ResizeObserver loop completed with undelivered notifications') ||
    errorStack.includes('ResizeObserver');
  
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
  const stack = e.reason?.stack || '';
  
  if (message.includes('ResizeObserver loop') || 
      message.includes('ResizeObserver loop completed with undelivered notifications') ||
      message.includes('ResizeObserver loop limit exceeded') ||
      stack.includes('ResizeObserver')) {
    e.preventDefault();
    e.stopImmediatePropagation();
    return true;
  }
  return false;
}, true);

// 处理错误事件（使用捕获阶段）
window.addEventListener('error', (e) => {
  const message = e.message || '';
  const stack = e.error?.stack || '';
  
  const isResizeObserverError = 
    message.includes('ResizeObserver loop') || 
    message.includes('ResizeObserver loop completed with undelivered notifications') ||
    message.includes('ResizeObserver loop limit exceeded') ||
    stack.includes('ResizeObserver');
  
  if (isResizeObserverError) {
    e.preventDefault();
    e.stopImmediatePropagation();
    return true;
  }
  return false;
}, true);

// 创建Vue应用实例
const app = createApp(App)

// 使用路由
app.use(router)

// 挂载应用
app.mount('#app')