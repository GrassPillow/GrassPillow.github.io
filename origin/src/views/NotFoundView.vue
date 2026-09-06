<template>
  <div class="not-found-view">
    <div class="not-found-content">
      <div class="not-found-emoji">🔍</div>
      <h1 class="not-found-title">404</h1>
      <p class="not-found-subtitle">页面未找到</p>
      <p class="not-found-desc">你访问的页面不存在或已被移除</p>
      <router-link to="/" class="not-found-btn">返回首页</router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
}

.not-found-content {
  text-align: center;
  padding: 40px;
}

.not-found-emoji {
  font-size: 4rem;
  margin-bottom: 16px;
}

.not-found-title {
  font-size: 5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 8px;
  line-height: 1;
}

.not-found-subtitle {
  font-size: 1.5rem;
  color: var(--text-secondary);
  margin: 0 0 8px;
}

.not-found-desc {
  color: var(--text-muted);
  margin: 0 0 32px;
}

.not-found-btn {
  display: inline-block;
  padding: 14px 32px;
  background: var(--gradient-primary);
  color: #fff;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.not-found-btn:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}
</style>
