<script setup>
import { Table } from 'ant-design-vue';
import axios from 'axios';
import { ref, onMounted, onBeforeUnmount, computed, h } from 'vue';
import EarthquakeMap from './EarthquakeMap.vue'; // 导入地图组件

const columns = ref([]);
const dataSource = ref([]);
const filteredDataSource = ref([]);
const loading = ref(true);
const lastUpdated = ref(new Date());
const magnitudeFilter = ref(null);
const locationFilter = ref('');
const sortOrder = ref(null);

// 计算震级统计
const magnitudeStats = computed(() => {
  const stats = {
    high: 0, // >= 7
    medium: 0, // 5-7
    low: 0, // 3-5
    veryLow: 0 // < 3
  };
  
  filteredDataSource.value.forEach(item => {
    const mag = getMagnitudeValue(item);
    if (mag >= 7) stats.high++;
    else if (mag >= 5) stats.medium++;
    else if (mag >= 3) stats.low++;
    else stats.veryLow++;
  });
  
  return stats;
});

// 获取震级数值
const getMagnitudeValue = (item) => {
  const mag = item.Magnitude || item.magnitude || item.M || item.leve;
  return parseFloat(mag) || 0;
};

// 获取最新时间戳显示
const getLatestTimestamp = () => {
  return lastUpdated.value.toLocaleString('zh-CN');
};

// 格式化震级显示（返回VNode）
const formatMagnitude = (value) => {
  const magnitude = parseFloat(value);
  if (isNaN(magnitude)) return value;
  
  let color = '#1890ff';
  let bgColor = '#e6f7ff';
  let label = '微小';
  
  if (magnitude >= 7) {
    color = '#ff4d4f';
    bgColor = '#fff1f0';
    label = '重大';
  } else if (magnitude >= 5) {
    color = '#faad14';
    bgColor = '#fffbe6';
    label = '中等';
  } else if (magnitude >= 3) {
    color = '#52c41a';
    bgColor = '#f6ffed';
    label = '轻微';
  }
  
  return h('span', {
    style: {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '4px',
      fontWeight: 'bold',
      color: color,
      backgroundColor: bgColor
    }
  }, `${magnitude} ${label}`);
};

// 格式化时间显示
const formatTime = (timeStr) => {
  if (!timeStr) return '-';
  try {
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) return timeStr;
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return timeStr;
  }
};

// 刷新数据
const refreshData = () => {
  loadData();
};

// 应用筛选和排序
const applyFilters = () => {
  let filtered = [...dataSource.value];
  
  // 震级筛选
  if (magnitudeFilter.value !== null) {
    filtered = filtered.filter(item => {
      const mag = getMagnitudeValue(item);
      if (magnitudeFilter.value === 'high') return mag >= 7;
      if (magnitudeFilter.value === 'medium') return mag >= 5 && mag < 7;
      if (magnitudeFilter.value === 'low') return mag >= 3 && mag < 5;
      if (magnitudeFilter.value === 'veryLow') return mag < 3;
      return true;
    });
  }
  
  // 位置筛选
  if (locationFilter.value && locationFilter.value.trim()) {
    const query = locationFilter.value.toLowerCase().trim();
    filtered = filtered.filter(item => {
      const location = item.Location || item.weizhi || '';
      return location.toLowerCase().includes(query);
    });
  }
  
  // 排序
  if (sortOrder.value) {
    filtered.sort((a, b) => {
      if (sortOrder.value === 'magnitude') {
        return getMagnitudeValue(b) - getMagnitudeValue(a);
      } else if (sortOrder.value === 'time') {
        const timeA = a.OriginTime || a.time || a.addtime || '';
        const timeB = b.OriginTime || b.time || b.addtime || '';
        return new Date(timeB) - new Date(timeA);
      }
      return 0;
    });
  }
  
  filteredDataSource.value = filtered;
};

// 清除所有筛选
const clearFilters = () => {
  magnitudeFilter.value = null;
  locationFilter.value = '';
  sortOrder.value = null;
  applyFilters();
};

// 数据加载函数
async function loadData() {
  loading.value = true;
  try {
    const response = await axios.get('https://api.wolfx.jp/cenc_eqlist.json');
    
    console.log('API Response:', response.data);
    
    if (response.data) {
      let rawData = [];
      
      if (typeof response.data === 'object' && !Array.isArray(response.data)) {
        rawData = Object.values(response.data);
      } else if (Array.isArray(response.data)) {
        rawData = response.data;
      }
      
      if (rawData.length > 0) {
        console.log('Raw Data Sample:', rawData[0]);
        console.log('Data Structure Keys:', Object.keys(rawData[0]));
        
        // 处理中文字段和英文字段的映射
        const processedData = rawData.map(item => {
          const processedItem = { ...item };
          
          // 添加key字段
          processedItem.key = item.EventID || item.ID || Math.random().toString(36).substr(2, 9);
          
          return processedItem;
        });
        
        // 根据数据结构动态生成列配置，但使用更友好的标题
        const firstItem = processedData[0];
        const allFields = Object.keys(firstItem).filter(key => key !== 'key');
        
        // 定义需要隐藏的字段（不重要的技术字段）
        const hiddenFields = [
          'type', 'intensity', 'automatic', 'tourl', 'ID',
          'EventID', // 隐藏事件ID列
          'location', // 隐藏小写的location字段（保留大写的Location作为位置显示）
          // 如果 Location 存在，隐藏 placeName（重复信息）
          // 如果 OriginTime 存在，隐藏 ReportTime（优先显示发生时间）
        ];
        
        // 定义字段映射关系（如果存在主要字段，隐藏次要字段）
        const fieldMapping = {
          // 位置字段：优先显示 Location/weizhi，隐藏 placeName
          'placeName': ['Location', 'weizhi'],
          // 时间字段：优先显示 OriginTime/time/addtime，隐藏 ReportTime
          'ReportTime': ['OriginTime', 'time', 'addtime']
        };
        
        // 过滤字段：移除隐藏字段和重复字段
        let filteredFields = allFields.filter(key => {
          // 移除隐藏字段
          if (hiddenFields.includes(key)) return false;
          
          // 检查是否有主要字段存在，如果有则隐藏次要字段
          if (fieldMapping[key]) {
            const hasMainField = fieldMapping[key].some(mainKey => allFields.includes(mainKey));
            if (hasMainField) return false;
          }
          
          return true;
        });
        
        // 定义列优先级顺序（重要列优先）
        const columnPriority = {
          'Magnitude': 1, 'magnitude': 1, 'M': 1, 'leve': 1,
          'OriginTime': 2, 'time': 2, 'addtime': 2,
          'Location': 3, 'weizhi': 3, 'placeName': 3,
          'Depth': 4, 'shendu': 4,
          'Latitude': 5, 'weidu': 5,
          'Longitude': 6, 'jingdu': 6,
          'EventID': 7,
          'ReportTime': 8
        };
        
        // 定义友好的中文标题映射
        const titleMap = {
          'Magnitude': '震级',
          'magnitude': '震级',
          'M': '震级',
          'EventID': '事件ID',
          'OriginTime': '发生时间',
          'time': '发生时间',
          'Location': '位置',
          'placeName': '位置',
          'Depth': '震源深度(km)',
          'Latitude': '纬度',
          'Longitude': '经度',
          'leve': '震级',
          'addtime': '发生时间',
          'weidu': '纬度',
          'jingdu': '经度',
          'shendu': '震源深度(km)',
          'weizhi': '位置',
          'ReportTime': '报告时间'
        };
        
        // 按优先级排序字段
        const sortedFields = filteredFields.sort((a, b) => {
          const priorityA = columnPriority[a] || 999;
          const priorityB = columnPriority[b] || 999;
          return priorityA - priorityB;
        });
        
        const generatedColumns = sortedFields.map(key => {
          const columnConfig = {
            title: titleMap[key] || key,
            dataIndex: key,
            key: key,
            width: 150,
            ellipsis: true
          };
          
          // 为震级字段添加自定义渲染和固定列
          if (['Magnitude', 'magnitude', 'M', 'leve'].includes(key)) {
            columnConfig.customRender = ({ text }) => formatMagnitude(text);
            columnConfig.width = 120;
            columnConfig.fixed = 'left';
            columnConfig.sorter = (a, b) => getMagnitudeValue(a) - getMagnitudeValue(b);
          }
          
          // 为时间字段添加格式化
          if (['OriginTime', 'time', 'addtime', 'ReportTime'].includes(key)) {
            columnConfig.customRender = ({ text }) => formatTime(text);
            columnConfig.width = 180;
            columnConfig.sorter = (a, b) => {
              const timeA = a[key] || '';
              const timeB = b[key] || '';
              return new Date(timeB) - new Date(timeA);
            };
          }
          
          // 为位置字段调整宽度
          if (['Location', 'weizhi', 'placeName'].includes(key)) {
            columnConfig.width = 280;
          }
          
          // 为深度字段添加单位，自适应宽度
          if (['Depth', 'shendu', 'depth'].includes(key)) {
            columnConfig.customRender = ({ text }) => {
              const depth = parseFloat(text);
              return isNaN(depth) ? text : `${depth} km`;
            };
            // 移除固定宽度，让列自适应内容
            delete columnConfig.width;
            columnConfig.minWidth = 90;
          }
          
          // 为经纬度字段格式化，自适应宽度
          if (['Latitude', 'weidu', 'latitude'].includes(key)) {
            columnConfig.customRender = ({ text }) => {
              const lat = parseFloat(text);
              return isNaN(lat) ? text : `${lat.toFixed(2)}°`;
            };
            // 移除固定宽度，让列自适应内容
            delete columnConfig.width;
            columnConfig.minWidth = 80;
          }
          
          if (['Longitude', 'jingdu', 'longitude'].includes(key)) {
            columnConfig.customRender = ({ text }) => {
              const lng = parseFloat(text);
              return isNaN(lng) ? text : `${lng.toFixed(2)}°`;
            };
            // 移除固定宽度，让列自适应内容
            delete columnConfig.width;
            columnConfig.minWidth = 80;
          }
          
          return columnConfig;
        });
        
        // 一次性设置列配置和数据源
        columns.value = generatedColumns;
        dataSource.value = processedData;
        filteredDataSource.value = processedData;
        lastUpdated.value = new Date();
        
        // 应用初始筛选
        applyFilters();
        
        console.log('Processed dataSource length:', dataSource.value.length);
      }
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
  } finally {
    loading.value = false;
  }
}

// 定义清理函数变量
let cleanupErrorHandler = null;

// 处理ResizeObserver循环错误的增强方法
const handleResizeObserverError = () => {
  // 创建一个ResizeObserver错误处理器
  const resizeObserverErrHandler = (e) => {
    // 检查是否是ResizeObserver loop错误
    const isResizeObserverError = 
      e.type === 'error' && 
      e.message && 
      (e.message.includes('ResizeObserver loop') || 
       e.message.includes('ResizeObserver loop completed with undelivered notifications'));
    
    if (isResizeObserverError) {
      // 这是一个已知的浏览器错误，我们可以安全地忽略它
      console.warn('ResizeObserver loop error caught and handled');
      // 防止错误冒泡到控制台
      if (e.preventDefault) {
        e.preventDefault();
      }
      return true;
    }
    return false;
  };

  // 添加错误事件监听器
  window.addEventListener('error', resizeObserverErrHandler, { capture: true });
  
  // 返回清理函数
  return () => {
    // 确保移除监听器
    window.removeEventListener('error', resizeObserverErrHandler, { capture: true });
  };
};

onMounted(() => {
  // 处理ResizeObserver错误
  cleanupErrorHandler = handleResizeObserverError();
  
  // 加载数据
  loadData();
});

// 确保onBeforeUnmount在顶层，而不是嵌套在onMounted中
onBeforeUnmount(() => {
  // 确保清理错误处理器
  if (typeof cleanupErrorHandler === 'function') {
    cleanupErrorHandler();
    cleanupErrorHandler = null;
  }
});
</script>

<template>
  <div class="earthquake-container">
    <!-- 在表格上方集成地图组件 -->
    <div class="map-section">
      <EarthquakeMap :earthquake-data="dataSource" />
    </div>
    
    <!-- 数据统计卡片 -->
    <div class="stats-section">
      <div class="stats-card">
        <div class="stats-header">
          <h3>数据概览</h3>
          <button class="refresh-btn" @click="refreshData" :disabled="loading">
            <span class="refresh-icon">🔄</span>
            {{ loading ? '加载中...' : '刷新数据' }}
          </button>
        </div>
        <div class="stats-content">
          <div class="stat-item">
            <span class="stat-number">{{ filteredDataSource.length }}</span>
            <span class="stat-label">显示记录</span>
            <span class="stat-total">/ {{ dataSource.length }} 总数</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ getLatestTimestamp() }}</span>
            <span class="stat-label">数据更新</span>
          </div>
        </div>
        <!-- 震级分类统计 -->
        <div class="magnitude-stats">
          <div class="mag-stat-item high">
            <span class="mag-label">重大 (≥7.0)</span>
            <span class="mag-count">{{ magnitudeStats.high }}</span>
          </div>
          <div class="mag-stat-item medium">
            <span class="mag-label">中等 (5.0-7.0)</span>
            <span class="mag-count">{{ magnitudeStats.medium }}</span>
          </div>
          <div class="mag-stat-item low">
            <span class="mag-label">轻微 (3.0-5.0)</span>
            <span class="mag-count">{{ magnitudeStats.low }}</span>
          </div>
          <div class="mag-stat-item very-low">
            <span class="mag-label">微小 (&lt;3.0)</span>
            <span class="mag-count">{{ magnitudeStats.veryLow }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 筛选和排序工具栏 -->
    <div class="filter-section">
      <div class="filter-toolbar">
        <div class="filter-group">
          <label>震级筛选：</label>
          <select v-model="magnitudeFilter" @change="applyFilters" class="filter-select">
            <option :value="null">全部</option>
            <option value="high">重大 (≥7.0)</option>
            <option value="medium">中等 (5.0-7.0)</option>
            <option value="low">轻微 (3.0-5.0)</option>
            <option value="veryLow">微小 (&lt;3.0)</option>
          </select>
        </div>
        <div class="filter-group">
          <label>位置搜索：</label>
          <input 
            v-model="locationFilter" 
            @input="applyFilters"
            type="text" 
            placeholder="输入位置关键词..."
            class="filter-input"
          />
        </div>
        <div class="filter-group">
          <label>排序：</label>
          <select v-model="sortOrder" @change="applyFilters" class="filter-select">
            <option :value="null">默认</option>
            <option value="magnitude">按震级降序</option>
            <option value="time">按时间降序</option>
          </select>
        </div>
        <button v-if="magnitudeFilter || locationFilter || sortOrder" @click="clearFilters" class="clear-btn">
          清除筛选
        </button>
      </div>
    </div>
    
    <!-- 地震数据表格 -->
    <div class="table-section">
      <div class="table-header">
        <h2>地震数据列表</h2>
      </div>
      
      <!-- 添加外部容器来处理滚动，避免Table内部的ResizeObserver问题 -->
      <div class="table-wrapper">
        <Table 
          :columns="columns" 
          :data-source="filteredDataSource" 
          :loading="loading"
          :pagination="{ 
            pageSize: 20, 
            showSizeChanger: true, 
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条记录`,
            pageSizeOptions: ['10', '20', '50', '100']
          }"
          :row-key="'key'"
          :scroll="{ x: 'max-content', y: 600 }"
          class="earthquake-table"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.earthquake-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 地图区域样式 */
.map-section {
  margin-bottom: 2rem;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.map-section:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

/* 数据统计卡片样式 */
.stats-section {
  margin-bottom: 2rem;
}

.stats-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.stats-card h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-icon {
  display: inline-block;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.stats-content {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  text-align: center;
  flex: 1;
  min-width: 150px;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  opacity: 0.9;
}

.stat-total {
  display: block;
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 0.25rem;
}

/* 震级分类统计 */
.magnitude-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.mag-stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.mag-stat-item.high {
  border-left: 4px solid #ff4d4f;
}

.mag-stat-item.medium {
  border-left: 4px solid #faad14;
}

.mag-stat-item.low {
  border-left: 4px solid #52c41a;
}

.mag-stat-item.very-low {
  border-left: 4px solid #1890ff;
}

.mag-label {
  font-size: 0.85rem;
  opacity: 0.95;
}

.mag-count {
  font-size: 1.2rem;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

/* 筛选工具栏 */
.filter-section {
  margin-bottom: 1.5rem;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.filter-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

.filter-select,
.filter-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.filter-input {
  min-width: 200px;
}

.clear-btn {
  padding: 0.5rem 1rem;
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #666;
  transition: all 0.3s ease;
  margin-left: auto;
}

.clear-btn:hover {
  background: #e6e6e6;
  border-color: #999;
  color: #333;
}

/* 表格区域样式 */
.table-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.table-header {
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.table-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.6rem;
  font-weight: 600;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.earthquake-table {
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .earthquake-container {
    padding: 0 0.5rem;
  }
  
  .map-section,
  .stats-card,
  .table-section,
  .filter-section {
    padding: 1rem;
  }
  
  .stats-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .refresh-btn {
    width: 100%;
    justify-content: center;
  }
  
  .stats-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .stat-item {
    min-width: auto;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .magnitude-stats {
    grid-template-columns: 1fr;
  }
  
  .filter-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group label {
    margin-bottom: 0.25rem;
  }
  
  .filter-input {
    min-width: auto;
    width: 100%;
  }
  
  .clear-btn {
    margin-left: 0;
    width: 100%;
  }
  
  .table-header h2 {
    font-size: 1.3rem;
  }
}

/* 加载状态样式 */
:deep(.ant-table-placeholder) {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 美化表格行悬停效果 */
:deep(.ant-table-tbody > tr:hover) {
  background-color: #f0f7ff;
  transition: background-color 0.2s ease;
}

/* 美化表格头部 */
:deep(.ant-table-thead > tr > th) {
  background: #fafafa;
  font-weight: 600;
  color: #333;
}

/* 美化固定列 */
:deep(.ant-table-cell-fix-left) {
  background: white;
}

:deep(.ant-table-tbody > tr:hover .ant-table-cell-fix-left) {
  background: #f0f7ff;
}

/* 美化分页控件 */
:deep(.ant-pagination) {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
}
</style>