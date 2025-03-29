<template>
  <div class="map-view">
    <map-container></map-container>
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