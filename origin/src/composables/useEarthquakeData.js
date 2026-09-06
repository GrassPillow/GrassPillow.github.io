import { ref, computed, onMounted, h } from 'vue'
import axios from 'axios'

// ─── Data Sources ────────────────────────────────────────────────────────────

const CENC_API_URL = 'https://api.wolfx.jp/cenc_eqlist.json'
const USGS_API_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson'

const SOURCE_CONFIGS = [
  { id: 'cenc', label: 'CENC', url: CENC_API_URL },
  { id: 'usgs', label: 'USGS', url: USGS_API_URL },
]

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

// ─── Source Adapters ────────────────────────────────────────────────────────

function toKey(sourceId, fallback) {
  return `${sourceId}-${fallback || Math.random().toString(36).substring(2, 11)}`
}

// wolfx CENC：对象键 No1..NoN，可能混入 md5 等非记录字段
async function fetchCencRecords() {
  const response = await axios.get(CENC_API_URL, { timeout: 15000 })
  if (!response.data) return []

  let rawData = []
  if (typeof response.data === 'object' && !Array.isArray(response.data)) {
    rawData = Object.values(response.data)
  } else if (Array.isArray(response.data)) {
    rawData = response.data
  }

  return rawData
    .filter(item => item && typeof item === 'object' &&
      (getMagnitudeValue(item) > 0 || getEventTimeText(item)))
    .map(item => ({
      ...item,
      key: toKey('cenc', item.EventID || item.ID),
      source: 'cenc',
    }))
}

// USGS GeoJSON：properties + geometry.coordinates [lon, lat, depth]
async function fetchUsgsRecords() {
  const response = await axios.get(USGS_API_URL, { timeout: 15000 })
  const features = response?.data?.features
  if (!Array.isArray(features)) return []

  return features
    .filter(feature => feature?.geometry?.coordinates?.length >= 2)
    .map(feature => {
      const { properties: p, geometry: g, id } = feature
      const [longitude, latitude, depth] = g.coordinates
      return {
        key: toKey('usgs', id || p.net + p.code),
        time: p.time ? new Date(p.time).toISOString() : '',
        location: p.place || '',
        placeName: p.place || '',
        magnitude: p.mag ?? '',
        depth: depth != null ? depth : '',
        latitude: latitude != null ? latitude : '',
        longitude: longitude != null ? longitude : '',
        source: 'usgs',
        url: p.url || '',
      }
    })
}

// ─── Column Config Generation ───────────────────────────────────────────────

const HIDDEN_FIELDS = [
  'type', 'intensity', 'automatic', 'tourl', 'ID', 'EventID', 'location',
  'MagnitudeType', 'DepthType', 'Catalog', 'net', 'code', 'md5',
]

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
  EventID: 7, ReportTime: 8, source: 9, url: 10,
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
  source: '数据源',
  url: '来源详情',
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

    if (key === 'source') {
      col.customRender = ({ text }) => (text ? text.toUpperCase() : '')
      col.width = 80
      col.filters = undefined
    }

    if (key === 'url') {
      col.customRender = ({ text }) => {
        if (!text) return ''
        return h('a', {
          href: text,
          target: '_blank',
          rel: 'noopener noreferrer',
          style: 'color: #2d7a6b;',
        }, '查看详情')
      }
      col.width = 90
      col.ellipsis = false
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
  const sourceFilter = ref('all') // all | cenc | usgs

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

    if (sourceFilter.value !== 'all') {
      filtered = filtered.filter(item => item.source === sourceFilter.value)
    }

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
    sourceFilter.value = 'all'
    applyFilters()
  }

  async function loadData() {
    loading.value = true
    errorMessage.value = ''
    const failures = []

    const results = await Promise.all(SOURCE_CONFIGS.map(async source => {
      try {
        if (source.id === 'cenc') return await fetchCencRecords()
        return await fetchUsgsRecords()
      } catch (error) {
        failures.push(source.label)
        console.error(`Failed to fetch earthquake data from ${source.label}:`, error)
        return []
      }
    }))

    const allData = results.flat()
    if (allData.length === 0) {
      errorMessage.value = failures.length
        ? `地震数据加载失败（${failures.join('、')}），请检查网络后重试`
        : '未获取到地震数据'
      loading.value = false
      return
    }

    // 合并后按发生时间降序，保证跨源展示时间有序
    allData.sort((a, b) => getEventTimeValue(b) - getEventTimeValue(a))

    columns.value = generateColumns(allData)
    dataSource.value = allData
    filteredDataSource.value = allData
    lastUpdated.value = new Date()
    applyFilters()

    if (failures.length) {
      errorMessage.value = `部分数据源加载失败（${failures.join('、')}），当前展示其余数据源`
    }
    loading.value = false
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
    sourceFilter,
    magnitudeStats,
    applyFilters,
    clearFilters,
    loadData,
  }
}
