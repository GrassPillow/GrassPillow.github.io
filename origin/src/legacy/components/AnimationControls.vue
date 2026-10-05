<template>
  <div class="controls">
    <button class="control-btn start-btn" @click="$emit('start')" :disabled="isAnimating">
      <i class="control-icon">▶</i> 开始动画
    </button>
    <button class="control-btn stop-btn" @click="$emit('stop')" :disabled="!isAnimating">
      <i class="control-icon">■</i> 停止动画
    </button>
    <button class="control-btn reset-btn" @click="$emit('reset')">
      <i class="control-icon">⟳</i> 重置
    </button>
    <div class="speed-control">
      <label for="animation-speed">动画速度:</label>
      <input id="animation-speed" type="range" min="500" max="2000" step="100"
             :value="animationSpeed"
             @input="$emit('update:speed', Number($event.target.value))">
      <span class="speed-value">{{ animationSpeed }}ms</span>
    </div>
    <div class="animation-status" v-if="isAnimating">
      <span class="status-indicator"></span>
      <span>动画进行中...</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isAnimating: { type: Boolean, default: false },
    animationSpeed: { type: Number, default: 1000 }
  },
  emits: ['start', 'stop', 'reset', 'update:speed']
}
</script>

<style scoped>
.controls {
  margin-top: 20px;
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  background: white;
  padding: 15px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.control-btn {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.control-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.start-btn {
  background-color: #4CAF50;
  color: white;
}

.start-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.stop-btn {
  background-color: #f44336;
  color: white;
}

.stop-btn:hover:not(:disabled) {
  background-color: #d32f2f;
}

.reset-btn {
  background-color: #2196F3;
  color: white;
}

.reset-btn:hover:not(:disabled) {
  background-color: #1976D2;
}

.control-icon {
  font-size: 16px;
}

.speed-control {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8f9fa;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.speed-control label {
  font-size: 14px;
  font-weight: 500;
  color: #555;
  white-space: nowrap;
}

.speed-control input[type="range"] {
  width: 150px;
  height: 6px;
  border-radius: 3px;
  background: #ddd;
  outline: none;
  transition: background 0.3s;
}

.speed-control input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #2196F3;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(33, 150, 243, 0.3);
  transition: all 0.3s ease;
}

.speed-control input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 3px 10px rgba(33, 150, 243, 0.5);
}

.speed-value {
  font-size: 14px;
  font-weight: 600;
  color: #2196F3;
  min-width: 60px;
}

.animation-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #4CAF50;
}

.status-indicator {
  width: 8px;
  height: 8px;
  background-color: #4CAF50;
  border-radius: 50%;
  animation: status-blink 1s infinite;
}

@keyframes status-blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .control-btn {
    justify-content: center;
  }

  .speed-control {
    flex-direction: column;
    gap: 8px;
  }

  .speed-control input[type="range"] {
    width: 100%;
  }
}
</style>
