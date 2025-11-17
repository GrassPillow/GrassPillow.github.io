<script setup>
import { Table } from 'ant-design-vue';
import axios from 'axios';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import EarthquakeMap from './EarthquakeMap.vue'; // 导入地图组件

const columns = ref([]);
const dataSource = ref([]);
const loading = ref(true);
const lastUpdated = ref(new Date());

// 获取最新时间戳显示
const getLatestTimestamp = () => {
  return lastUpdated.value.toLocaleString('zh-CN');
};

// 格式化震级显示
const formatMagnitude = (value) => {
  const magnitude = parseFloat(value);
  if (isNaN(magnitude)) return value;
  
  let color = '#1890ff';
  if (magnitude >= 7) color = '#ff4d4f';
  else if (magnitude >= 5) color = '#faad14';
  else if (magnitude >= 3) color = '#52c41a';
  
  return `<span style="font-weight: bold; color: ${color};">${magnitude}</span>`;
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
        
        const generatedColumns = allFields.map(key => {
          // 定义友好的中文标题映射
          const titleMap = {
            'Magnitude': '震级',
            'magnitude': '震级',
            'M': '震级',
            'EventID': '事件ID',
            'OriginTime': '发生时间',
            'time': '发生时间',
            'Location': '位置',
            'Depth': '震源深度(km)',
            'Latitude': '纬度',
            'Longitude': '经度',
            'leve': '震级',
            'addtime': '发生时间',
            'weidu': '纬度',
            'jingdu': '经度',
            'shendu': '震源深度(km)',
            'weizhi': '位置'
          };
          
          const columnConfig = {
            title: titleMap[key] || key,
            dataIndex: key,
            key: key,
            width: 150,
            ellipsis: true
          };
          
          // 为震级字段添加自定义渲染
          if (['Magnitude', 'magnitude', 'M', 'leve'].includes(key)) {
            columnConfig.customRender = ({ text }) => formatMagnitude(text);
            columnConfig.width = 100;
          }
          
          // 为时间字段调整宽度
          if (['OriginTime', 'time', 'addtime'].includes(key)) {
            columnConfig.width = 200;
          }
          
          // 为位置字段调整宽度
          if (['Location', 'weizhi'].includes(key)) {
            columnConfig.width = 250;
          }
          
          return columnConfig;
        });
        
        // 一次性设置列配置和数据源
        columns.value = generatedColumns;
        dataSource.value = processedData;
        lastUpdated.value = new Date();
        
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
        <h3>数据概览</h3>
        <div class="stats-content">
          <div class="stat-item">
            <span class="stat-number">{{ dataSource.length }}</span>
            <span class="stat-label">地震记录</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ getLatestTimestamp() }}</span>
            <span class="stat-label">数据更新</span>
          </div>
        </div>
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
          :data-source="dataSource" 
          :pagination="{ pageSize: 10, showSizeChanger: true, showTotal: total => `共 ${total} 条记录` }"
          :row-key="'key'"
          :scroll="{ x: 'max-content' }"
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

.stats-card h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.3rem;
  font-weight: 600;
}

.stats-content {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 1.5rem;
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
  .table-section {
    padding: 1rem;
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
  background-color: #fafafa;
}

/* 美化分页控件 */
:deep(.ant-pagination) {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
}
</style>