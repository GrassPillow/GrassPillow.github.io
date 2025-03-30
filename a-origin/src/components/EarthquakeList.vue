<script setup>
import { Table } from 'ant-design-vue';
import axios from 'axios';
import { ref, onMounted } from 'vue';

const columns = ref([
  { title: '等级', dataIndex: 'leve', key: 'leve' },
  { title: '添加时间', dataIndex: 'addtime', key: 'addtime' },
  { title: '纬度', dataIndex: 'weidu', key: 'weidu' },
  { title: '经度', dataIndex: 'jingdu', key: 'jingdu' },
  { title: '深度', dataIndex: 'shendu', key: 'shendu' },
//   { title: '链接', dataIndex: 'tourl', key: 'tourl' },
  { title: '位置', dataIndex: 'weizhi', key: 'weizhi' },
]);

const dataSource = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get('/data.json');
    dataSource.value = response.data.data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
});
</script>

<template>
  <Table :columns="columns" :data-source="dataSource" />
</template>