<template>
  <div class="clock-view">
    <digital-clock></digital-clock>
  </div>
</template>

<script>
import DigitalClock from '@/components/DigitalClock.vue'

export default {
  name: 'ClockView',
  components: {
    DigitalClock
  }
}
</script>

<style scoped>
.clock-view {
  width: 100%;
  height: 100%;
}
</style>