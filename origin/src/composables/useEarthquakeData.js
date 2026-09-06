import { ref, computed, onMounted, h } from 'vue'
import axios from 'axios'

const API_URL = 'https://api.wolfx.jp/cenc_eqlist.json'

// ─── Formatters ─────────────────────────────────────────────────────────────

export function getMagnitudeValue(item) {
  const mag = item.Magnitude || item.magnitude || item.M || item.leve
  return parseFloat(mag) || 0
}

export function formatMagnitude(value) {
  const magnitude = parseFloat(value)
  if (isNaN(magnitude)) return value

  const levels = [
    { min: 7, color: '#ff4d4f', bg: '#fff1f0', label: '重大' },
    { min: 5, color: '#faad14', bg: '#fffbe6', label: '中等' },
    { min: 3, color: '#52c41a', bg: '#f6ffed', label: '轻微' },
  ]
  const match = levels.find(l => magnitude >= l.min)
  const { color, bg, label } = match || { color: '#1890ff', bg: '#e6f7ff', label: '微小' }

  return h('span', {
    style: {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '4px',
      fontWeight: 'bold',
      color,
      backgroundColor: bg,
    }
  }, `${magnitude} ${label}`)
}

export function formatTime(timeStr) {
  if (!timeStr) return '-'
  try {
    const date = new Date(timeStr)
    if (isNaN(date.getTime())) return timeStr
    return date.toLocaleString('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    })
  } catch {
    return timeStr
  }
}

// ─── Field Helpers ──────────────────────────────────────────────────────────

// 兼容中英文字段命名，取首个非空值
export function getLocationText(item) {
  return item.Location || item.weizhi || item.location || item.placeName || ''
}

export function getEventTimeText(item) {
  return item.OriginTime || item.time || item.addtime || item.ReportTime || ''
}

export function getEventTimeValue(item) {
  const value = getEventTimeText(item)
  if (!value) return 0
  const time = new Date(value).getTime()
  return isNaN(time) ? 0 : time
}

// ─── Column Config Generation ───────────────────────────────────────────────

const HIDDEN_FIELDS = ['type', 'intensity', 'automatic', 'tourl', 'ID', 'EventID', 'location']

const FIELD_MAPPING = {
  placeName: ['Location', 'weizhi'],
  ReportTime: ['OriginTime', 'time', 'addtime'],
}

const COLUMN_PRIORITY = {
  Magnitude: 1, magnitude: 1, M: 1, leve: 1,
  OriginTime: 2, time: 2, addtime: 2,
  Location: 3, weizhi: 3, placeName: 3,
  Depth: 4, shendu: 4,
  Latitude: 5, weidu: 5,
  Longitude: 6, jingdu: 6,
  EventID: 7, ReportTime: 8,
}

const TITLE_MAP = {
  Magnitude: '震级', magnitude: '震级', M: '震级', leve: '震级',
  EventID: '事件ID',
  OriginTime: '发生时间', time: '发生时间', addtime: '发生时间',
  Location: '位置', placeName: '位置', weizhi: '位置',
  Depth: '震源深度(km)', shendu: '震源深度(km)',
  Latitude: '纬度', weidu: '纬度',
  Longitude: '经度', jingdu: '经度',
  ReportTime: '报告时间',
}

function generateColumns(processedData) {
  // 取所有记录并集字段（仅统计出现过非空值的字段），避免依赖第一条记录导致缺列
  const fieldSet = new Set()
  processedData.forEach(item => {
    Object.keys(item).forEach(key => {
      const value = item[key]
      if (key !== 'key' && value !== '' && value !== null && value !== undefined) {
        fieldSet.add(key)
      }
    })
  })

  let filteredFields = [...fieldSet].filter(key => {
    if (HIDDEN_FIELDS.includes(key)) return false
    if (FIELD_MAPPING[key]) {
      return !FIELD_MAPPING[key].some(mainKey => fieldSet.has(mainKey))
    }
    return true
  })

  filteredFields.sort((a, b) => (COLUMN_PRIORITY[a] || 999) - (COLUMN_PRIORITY[b] || 999))

  return filteredFields.map(key => {
    const col = {
      title: TITLE_MAP[key] || key,
      dataIndex: key,
      key,
      width: 150,
      ellipsis: true,
    }

    if (['Magnitude', 'magnitude', 'M', 'leve'].includes(key)) {
      col.customRender = ({ text }) => formatMagnitude(text)
      col.width = 120
      col.fixed = 'left'
      col.sorter = (a, b) => getMagnitudeValue(a) - getMagnitudeValue(b)
    }

    if (['OriginTime', 'time', 'addtime', 'ReportTime'].includes(key)) {
      col.customRender = ({ text }) => formatTime(text)
      col.width = 190
      col.sorter = (a, b) => getEventTimeValue(b) - getEventTimeValue(a)
    }

    if (['Location', 'weizhi', 'placeName'].includes(key)) {
      col.width = 280
    }

    if (['Depth', 'shendu', 'depth'].includes(key)) {
      col.customRender = ({ text }) => {
        const depth = parseFloat(text)
        return isNaN(depth) ? text : `${depth} km`
      }
      delete col.width
      col.minWidth = 90
    }

    if (['Latitude', 'weidu', 'latitude'].includes(key)) {
      col.customRender = ({ text }) => {
        const lat = parseFloat(text)
        return isNaN(lat) ? text : `${lat.toFixed(2)}°`
      }
      delete col.width
      col.minWidth = 80
    }

    if (['Longitude', 'jingdu', 'longitude'].includes(key)) {
      col.customRender = ({ text }) => {
        const lng = parseFloat(text)
        return isNaN(lng) ? text : `${lng.toFixed(2)}°`
      }
      delete col.width
      col.minWidth = 80
    }

    return col
  })
}

// ─── Composable ─────────────────────────────────────────────────────────────

export function useEarthquakeData() {
  const columns = ref([])
  const dataSource = ref([])
  const filteredDataSource = ref([])
  const loading = ref(true)
  const errorMessage = ref('')
  const lastUpdated = ref(new Date())
  const magnitudeFilter = ref(null)
  const locationFilter = ref('')
  const sortOrder = ref(null)
  const timeRangeFilter = ref('all') // all | 24h | 7d | 30d

  const TIME_RANGE_MS = {
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
  }

  // Magnitude statistics
  const magnitudeStats = computed(() => {
    const stats = { high: 0, medium: 0, low: 0, veryLow: 0 }
    filteredDataSource.value.forEach(item => {
      const mag = getMagnitudeValue(item)
      if (mag >= 7) stats.high++
      else if (mag >= 5) stats.medium++
      else if (mag >= 3) stats.low++
      else stats.veryLow++
    })
    return stats
  })

  function applyFilters() {
    let filtered = [...dataSource.value]

    if (magnitudeFilter.value !== null) {
      filtered = filtered.filter(item => {
        const mag = getMagnitudeValue(item)
        const map = { high: mag >= 7, medium: mag >= 5 && mag < 7, low: mag >= 3 && mag < 5, veryLow: mag < 3 }
        return map[magnitudeFilter.value] ?? true
      })
    }

    if (timeRangeFilter.value !== 'all') {
      const threshold = TIME_RANGE_MS[timeRangeFilter.value]
      if (threshold) {
        const now = Date.now()
        filtered = filtered.filter(item => now - getEventTimeValue(item) <= threshold)
      }
    }

    if (locationFilter.value?.trim()) {
      const query = locationFilter.value.toLowerCase().trim()
      filtered = filtered.filter(item => getLocationText(item).toLowerCase().includes(query))
    }

    if (sortOrder.value) {
      filtered.sort((a, b) => {
        if (sortOrder.value === 'magnitude') {
          return getMagnitudeValue(b) - getMagnitudeValue(a)
        }
        if (sortOrder.value === 'time') {
          return getEventTimeValue(b) - getEventTimeValue(a)
        }
        return 0
      })
    }

    filteredDataSource.value = filtered
  }

  function clearFilters() {
    magnitudeFilter.value = null
    locationFilter.value = ''
    sortOrder.value = null
    timeRangeFilter.value = 'all'
    applyFilters()
  }

  async function loadData() {
    loading.value = true
    errorMessage.value = ''
    try {
      const response = await axios.get(API_URL)
      if (!response.data) {
        throw new Error('empty response')
      }

      let rawData = []
      if (typeof response.data === 'object' && !Array.isArray(response.data)) {
        rawData = Object.values(response.data)
      } else if (Array.isArray(response.data)) {
        rawData = response.data
      }

      // 数据对象中混入了 md5 等非记录字段，仅保留含震级/时间的记录
      rawData = rawData.filter(item =>
        item && typeof item === 'object' &&
        (getMagnitudeValue(item) > 0 || getEventTimeText(item))
      )

      if (rawData.length === 0) {
        throw new Error('no earthquake records')
      }

      const processedData = rawData.map(item => ({
        ...item,
        key: item.EventID || item.ID || Math.random().toString(36).substring(2, 11),
      }))

      columns.value = generateColumns(processedData)
      dataSource.value = processedData
      filteredDataSource.value = processedData
      lastUpdated.value = new Date()
      applyFilters()
    } catch (error) {
      console.error('Failed to fetch earthquake data:', error)
      errorMessage.value = dataSource.value.length
        ? '刷新失败，当前展示上次加载的数据'
        : '加载地震数据失败，请检查网络后重试'
    } finally {
      loading.value = false
    }
  }

  // Load data on mount
  onMounted(() => {
    loadData()
  })

  return {
    columns,
    dataSource,
    filteredDataSource,
    loading,
    errorMessage,
    lastUpdated,
    magnitudeFilter,
    locationFilter,
    sortOrder,
    timeRangeFilter,
    magnitudeStats,
    applyFilters,
    clearFilters,
    loadData,
  }
}
