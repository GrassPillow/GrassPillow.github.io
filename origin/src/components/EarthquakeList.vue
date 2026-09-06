<template>
  <div class="earthquake-container">
    <!-- 在表格上方集成地图组件 -->
    <div class="map-section">
      <EarthquakeMap :earthquake-data="dataSource" />
    </div>

    <!-- 数据加载失败/刷新失败提示 -->
    <div v-if="errorMessage" class="error-banner" role="alert">
      <span class="error-text">⚠️ {{ errorMessage }}</span>
      <button class="error-retry" @click="loadData" :disabled="loading">
        {{ loading ? '重试中...' : '重试' }}
      </button>
    </div>
    
    <!-- 数据统计卡片 -->
    <div class="stats-section">
      <div class="stats-card">
        <div class="stats-header">
          <h3>数据概览</h3>
          <button class="refresh-btn" @click="loadData" :disabled="loading">
            <span class="refresh-icon" :class="{ spinning: loading }">🔄</span>
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
          <label>时间范围：</label>
          <select v-model="timeRangeFilter" @change="applyFilters" class="filter-select">
            <option value="all">全部</option>
            <option value="24h">近 24 小时</option>
            <option value="7d">近 7 天</option>
            <option value="30d">近 30 天</option>
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
        <button v-if="magnitudeFilter || locationFilter || sortOrder || timeRangeFilter !== 'all'" @click="clearFilters" class="clear-btn">
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
        <DataTable
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

<script setup>
import EarthquakeMap from './EarthquakeMap.vue'
import DataTable from './DataTable.vue'
import { useEarthquakeData } from '../composables/useEarthquakeData.js'

const {
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
} = useEarthquakeData()

const getLatestTimestamp = () => lastUpdated.value.toLocaleString('zh-CN')
</script>

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

/* 错误提示横幅 */
.error-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: #fff1f0;
  border: 1px solid #ffccc7;
  border-radius: 12px;
  padding: 0.9rem 1.2rem;
  margin-bottom: 1.5rem;
}

.error-text {
  color: #cf1322;
  font-size: 0.95rem;
}

.error-retry {
  padding: 0.4rem 1rem;
  background: #cf1322;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.error-retry:hover:not(:disabled) {
  background: #a8071a;
}

.error-retry:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
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

  .error-banner {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .error-retry {
    width: 100%;
  }
}
</style>
