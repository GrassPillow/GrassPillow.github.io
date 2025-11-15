//home-view.vue
<template>
  <div class="home">
    <h1>Home</h1>
    <p>Welcome to the home page!</p>
    <EarthquakeList :earthquakes="earthquakes" />
  </div>
</template>

<script>
import EarthquakeList from '@/components/EarthquakeList.vue'
export default {
  name: 'HomeView',
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
.home {
  text-align: center;
  margin-top: 50px;
}
</style>
