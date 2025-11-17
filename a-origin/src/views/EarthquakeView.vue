<template>
  <div class="earthquake-page">
    <header class="page-header">
      <h1 class="page-title">地震数据监测平台</h1>
      <p class="page-description">实时展示全球地震活动，提供详细的地震数据和地理分布信息</p>
    </header>
    
    <main class="main-content">
      <EarthquakeList :earthquakes="earthquakes" />
    </main>
  </div>
</template>

<script>
import EarthquakeList from '@/components/EarthquakeList.vue'
export default {
  name: 'EarthquakeView',
  components: {
    EarthquakeList
  },
  data() {
    return {
      earthquakes: []
    }
  },
  created() {
    this.fetchEarthquakes()
  },
  methods: {
    fetchEarthquakes() {
      // 这里可以保留mock数据，但实际使用时会被EarthquakeList组件中的API调用覆盖
      this.earthquakes = [
        {
          "leve": "3.1",
          "addtime": "2025-03-28 19:56:37",
          "weidu": "34.75",
          "jingdu": "87.78",
          "shendu": "10",
          "tourl": "https://news.ceic.ac.cn/CD20250328195637.html",
          "weizhi": "西藏那曲市双湖县"
        },
        {
          "leve": "3.0",
          "addtime": "2025-03-28 17:48:16",
          "weidu": "23.80",
          "jingdu": "98.72",
          "shendu": "10",
          "tourl": "https://news.ceic.ac.cn/CD20250328174817.html",
          "weizhi": "云南临沧市镇康县"
        },
        {
          "leve": "3.0",
          "addtime": "2025-03-28 17:45:04",
          "weidu": "23.80",
          "jingdu": "98.72",
          "shendu": "10",
          "tourl": "https://news.ceic.ac.cn/CC20250328174504.html",
          "weizhi": "云南临沧市镇康县"
        }
      ]
    }
  }
}
</script>

<style scoped>
.earthquake-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 3rem 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.page-description {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
  max-width: 700px;
  margin: 0 auto;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .page-description {
    font-size: 1rem;
  }
  
  .page-header {
    padding: 2rem 1rem;
  }
}
</style>
