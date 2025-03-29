<template>
  <div class="map-view">
    <map-container></map-container>
    <!-- 展示地震数据 https://developer.aliyun.com/article/1639985 -->
     
  </div>
</template>

<script>
import MapContainer from '@/components/MapContainer.vue'

export default {
  name: 'MapView',
  components: {
    MapContainer
  }
}
</script>

<style scoped>
.map-view {
  width: 100%;
  height: 100%;
}
</style>