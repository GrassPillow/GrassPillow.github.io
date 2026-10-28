/**
 * 资源数据加载（带模块级缓存）
 *
 * HomeView 与所有 ResourceView 实例都需要同一份 resources.csv，
 * 之前每个视图各自 axios.get，在 5 个分类页之间来回切换会重复请求同一文件。
 * 这里用 Promise 缓存做请求去重：首次请求在飞行中，后续调用复用同一个 Promise。
 */
import axios from 'axios'
import { parseCSV } from './csv.js'

const RESOURCE_URL = '/resources.csv'

let cachedResources = null
let inflight = null

/**
 * 加载并解析资源列表
 * @param {{ force?: boolean }} options force=true 时跳过缓存重新请求
 * @returns {Promise<Array<object>>}
 * @throws {Error} 请求失败或解析结果为空时抛出，调用方负责展示错误态
 */
export async function loadResources(options = {}) {
  if (options.force) {
    cachedResources = null
    inflight = null
  }

  if (cachedResources) {
    return cachedResources
  }

  // 已有请求在飞行中：复用，避免并发重复下载
  if (inflight) {
    return inflight
  }

  inflight = axios
    .get(RESOURCE_URL)
    .then(response => {
      const items = parseCSV(response.data)
      if (items.length === 0) {
        // 解析不出数据通常是表头被改坏或文件内容异常
        throw new Error('resources.csv 解析结果为空，请检查数据文件格式。')
      }
      cachedResources = items
      return items
    })
    .finally(() => {
      // 无论成功失败都释放飞行中的 Promise，失败时允许重试
      inflight = null
    })

  return inflight
}

/**
 * 清空缓存，用于「重试」按钮在数据修复后重新拉取
 */
export function resetResourceCache() {
  cachedResources = null
  inflight = null
}
