<template>
  <div class="resource-card-wrap">
    <a
      :href="resource.url"
      target="_blank"
      rel="noopener noreferrer"
      class="resource-card"
    >
      <div class="card-top">
        <span class="card-logo">{{ initial }}</span>
        <span class="card-open">↗</span>
      </div>
      <h3 class="card-name" v-html="highlightedName"></h3>
      <p class="card-desc" v-html="highlightedDesc"></p>
      <div class="card-footer">
        <span class="card-category">{{ resource.category }}</span>
        <span class="card-domain">{{ domain }}</span>
      </div>
    </a>
    <div class="card-actions">
      <button
        type="button"
        class="action-btn"
        :class="{ active: isFav }"
        :aria-label="isFav ? '取消收藏' : '收藏'"
        :title="isFav ? '取消收藏' : '收藏'"
        @click="handleFavorite"
      >
        <span aria-hidden="true">{{ isFav ? '★' : '☆' }}</span>
      </button>
      <button
        type="button"
        class="action-btn"
        aria-label="复制链接"
        title="复制链接"
        @click="handleCopy"
      >
        <span aria-hidden="true">⧉</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useFavorites } from '../composables/useFavorites.js'

const props = defineProps({
  resource: {
    type: Object,
    required: true
  },
  // 搜索关键词：非空时对名称/描述做高亮
  highlight: {
    type: String,
    default: ''
  }
})

const { isFavorite, toggleFavorite, onFavoritesChange } = useFavorites()

const isFav = ref(false)

const initial = computed(() => {
  const name = props.resource.name || '?'
  return name.charAt(0).toUpperCase()
})

const domain = computed(() => {
  try {
    return new URL(props.resource.url).hostname.replace(/^www\./, '')
  } catch (e) {
    return props.resource.url
  }
})

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function highlightText(text) {
  const safe = escapeHtml(text || '')
  const q = (props.highlight || '').trim()
  if (!q) return safe
  const escaped = escapeHtml(q)
  // 转义后按原文匹配，避免把 &lt; 等实体当标签处理
  const regex = new RegExp(`(${escaped.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return safe.replace(regex, '<mark>$1</mark>')
}

const highlightedName = computed(() => highlightText(props.resource.name))
const highlightedDesc = computed(() => highlightText(props.resource.description))

function syncFavorite() {
  isFav.value = isFavorite(props.resource.url)
}

function handleFavorite() {
  const next = toggleFavorite(props.resource.url)
  isFav.value = next
  if (window.$toast) {
    window.$toast.success(next ? `已收藏 ${props.resource.name}` : `已取消收藏 ${props.resource.name}`, 2000)
  }
}

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(props.resource.url)
    if (window.$toast) {
      window.$toast.success('链接已复制', 2000)
    }
  } catch (e) {
    // 剪贴板不可用（非 HTTPS 或权限受限）时降级：临时输入框方案
    try {
      const el = document.createElement('textarea')
      el.value = props.resource.url
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      if (window.$toast) {
        window.$toast.success('链接已复制', 2000)
      }
    } catch (err) {
      if (window.$toast) {
        window.$toast.error('复制失败，请手动复制', 2500)
      }
    }
  }
}

onMounted(() => {
  syncFavorite()
  // 其他卡片/标签页收藏变化时同步本卡片状态
  stopWatch = onFavoritesChange(syncFavorite)
})

let stopWatch = null
onUnmounted(() => {
  if (stopWatch) stopWatch()
})
</script>

<style scoped>
.resource-card-wrap {
  position: relative;
}

.resource-card {
  background: var(--c-bg-page);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  text-decoration: none;
  color: var(--c-text);
  display: block;
  transition: all 0.25s ease;
  box-shadow: var(--shadow-sm);
}

.resource-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--c-primary);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.card-logo {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--c-primary-light);
  color: var(--c-primary);
  font-weight: 800;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-open {
  font-size: 1.1rem;
  color: var(--c-text-muted);
  transition: all 0.2s ease;
}

.resource-card:hover .card-open {
  color: var(--c-primary);
  transform: translate(2px, -2px);
}

.card-name {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: var(--c-text);
}

.card-desc {
  font-size: 0.9rem;
  color: var(--c-text-secondary);
  line-height: 1.6;
  margin: 0 0 1.1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.9em;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.9rem;
  border-top: 1px solid var(--c-border);
}

.card-category {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--c-primary);
  background: var(--c-primary-light);
  padding: 0.25rem 0.8rem;
  border-radius: 999px;
}

.card-domain {
  font-size: 0.8rem;
  color: var(--c-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 140px;
}

/* 搜索高亮 */
mark {
  background: var(--c-primary-light);
  color: var(--c-primary-dark);
  border-radius: 3px;
  padding: 0 2px;
}

/* 悬浮操作按钮 */
.card-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transform: translateY(-4px);
  transition: all 0.2s ease;
  z-index: 2;
}

.resource-card-wrap:hover .card-actions,
.resource-card-wrap:focus-within .card-actions {
  opacity: 1;
  transform: translateY(0);
}

.action-btn {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid var(--c-border);
  background: var(--c-bg-card);
  color: var(--c-text-secondary);
  font-size: 1.05rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
  font-family: inherit;
}

.action-btn:hover {
  border-color: var(--c-primary);
  color: var(--c-primary);
  transform: scale(1.08);
}

.action-btn.active {
  color: #e6a817;
  border-color: rgba(230, 168, 23, 0.5);
  background: rgba(230, 168, 23, 0.08);
}

/* 触屏设备始终显示操作按钮 */
@media (hover: none) {
  .card-actions {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 480px) {
  .card-actions {
    opacity: 1;
    transform: none;
  }
}
</style>
