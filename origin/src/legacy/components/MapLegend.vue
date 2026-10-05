<template>
  <div class="legend">
    <span class="legend-item">
      <span class="legend-marker severity-minor"></span>
      <span>&lt; 5.0 级</span>
    </span>
    <span class="legend-item">
      <span class="legend-marker severity-medium"></span>
      <span>5.0 - 7.0 级</span>
    </span>
    <span class="legend-item">
      <span class="legend-marker severity-major"></span>
      <span>&gt;= 7.0 级</span>
    </span>
  </div>
</template>

<style scoped>
.legend {
  display: flex;
  gap: 20px;
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.legend-marker {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.legend-marker.severity-minor {
  background-color: #FF9999;
}

.legend-marker.severity-medium {
  background-color: #FF6600;
}

.legend-marker.severity-major {
  background-color: #FF0000;
}

@media (max-width: 768px) {
  .legend {
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style>
