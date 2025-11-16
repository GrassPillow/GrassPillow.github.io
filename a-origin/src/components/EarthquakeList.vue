<script setup>
import { Table } from 'ant-design-vue';
import axios from 'axios';
import { ref, onMounted, onBeforeUnmount } from 'vue';

const columns = ref([]);
const dataSource = ref([]);

// 数据加载函数
async function loadData() {
  try {
    const response = await axios.get('https://api.wolfx.jp/cenc_eqlist.json');
    
    if (response.data) {
      if (typeof response.data === 'object' && !Array.isArray(response.data)) {
        const rawData = Object.values(response.data);
        
        if (rawData.length > 0) {
          // 动态获取所有字段并生成列配置，但使用更安全的方式
          const allFields = Object.keys(rawData[0]);
          
          // 先生成完整的列配置数组
          const generatedColumns = allFields.map(key => ({
            title: key,
            dataIndex: key,
            key: key,
            // 设置合理的固定宽度，避免动态计算
            width: 150
          }));
          
          // 一次性设置列配置
          columns.value = generatedColumns;
          
          // 为每个数据项添加key字段
          dataSource.value = rawData.map(item => ({
            ...item,
            key: item.EventID || Math.random().toString(36).substr(2, 9)
          }));
        }
      } else if (Array.isArray(response.data) && response.data.length > 0) {
        // 同样处理数组格式的数据
        const allFields = Object.keys(response.data[0]);
        
        const generatedColumns = allFields.map(key => ({
          title: key,
          dataIndex: key,
          key: key,
          width: 150
        }));
        
        columns.value = generatedColumns;
        
        dataSource.value = response.data.map(item => ({
          ...item,
          key: item.EventID || Math.random().toString(36).substr(2, 9)
        }));
      }
    }
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}

// 全局ResizeObserver错误处理
onMounted(() => {
  // 全局错误捕获
  const originalError = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    if (message && typeof message === 'string' && message.includes('ResizeObserver loop')) {
      return true; // 阻止错误传播
    }
    if (originalError) {
      return originalError(message, source, lineno, colno, error);
    }
    return false;
  };
  
  // 加载数据
  loadData();
});

onBeforeUnmount(() => {
  // 清理错误处理器
  window.onerror = null;
});
</script>

<template>
  <div style="width: 80%; margin: 0 auto;">
    <!-- 添加外部容器来处理滚动，避免Table内部的ResizeObserver问题 -->
    <div style="overflow-x: auto;">
      <Table 
        :columns="columns" 
        :data-source="dataSource" 
        :pagination="false"
        :row-key="'key'"
        size="small"
      />
    </div>
  </div>
</template>