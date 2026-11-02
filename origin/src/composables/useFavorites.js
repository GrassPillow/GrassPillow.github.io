/**
 * 收藏管理（localStorage 持久化）
 *
 * - 收藏按资源 URL 去重，跨页面共享
 * - 卡片切换收藏时派发 `favorites-changed` 事件，
 *   列表页监听该事件实时刷新「仅看收藏」筛选结果
 * - localStorage 读写带 try/catch：隐私模式或配额满时静默降级为内存态
 */

const STORAGE_KEY = 'gp:favorites'
const EVENT_NAME = 'favorites-changed'

let memorySet = null

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw)
    return new Set(Array.isArray(arr) ? arr : [])
  } catch (e) {
    // localStorage 不可用时退回内存态
    return memorySet || new Set()
  }
}

function writeStorage(set) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)))
    memorySet = null
  } catch (e) {
    memorySet = set
  }
}

function notify() {
  window.dispatchEvent(new CustomEvent(EVENT_NAME))
}

export function useFavorites() {
  function getFavorites() {
    return readStorage()
  }

  function isFavorite(url) {
    return readStorage().has(url)
  }

  /**
   * 切换收藏状态
   * @returns {boolean} 切换后的收藏状态
   */
  function toggleFavorite(url) {
    const set = readStorage()
    const next = !set.has(url)
    if (next) {
      set.add(url)
    } else {
      set.delete(url)
    }
    writeStorage(set)
    notify()
    return next
  }

  /**
   * 监听收藏变化；返回取消订阅函数
   */
  function onFavoritesChange(handler) {
    window.addEventListener(EVENT_NAME, handler)
    // 其他标签页修改 localStorage 时同步
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener(EVENT_NAME, handler)
      window.removeEventListener('storage', handler)
    }
  }

  return { getFavorites, isFavorite, toggleFavorite, onFavoritesChange }
}
