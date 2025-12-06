<template>
  <div class="earthquake-map">
    <div class="map-header">
      <h3>地震分布地图 - 按时间顺序展示</h3>
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
    </div>
    <div id="map-container" ref="mapContainer"></div>
    <div class="controls">
      <button class="control-btn start-btn" @click="startAnimation" :disabled="isAnimating">
        <i class="control-icon">▶</i> 开始动画
      </button>
      <button class="control-btn stop-btn" @click="stopAnimation" :disabled="!isAnimating">
        <i class="control-icon">■</i> 停止动画
      </button>
      <button class="control-btn reset-btn" @click="resetAnimation">
        <i class="control-icon">⟳</i> 重置
      </button>
      <div class="speed-control">
        <label for="animation-speed">动画速度:</label>
        <input id="animation-speed" type="range" v-model.number="animationSpeed" min="500" max="2000" step="100" 
               @input="updateAnimationSpeed">
        <span class="speed-value">{{ animationSpeed }}ms</span>
      </div>
      <div class="animation-status" v-if="isAnimating">
        <span class="status-indicator"></span>
        <span>动画进行中...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, defineProps } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';

// 接收地震数据作为props
const props = defineProps({
  earthquakeData: {
    type: Array,
    default: () => []
  }
});

console.log('EarthquakeMap component mounted');

const mapContainer = ref(null);
let map = null;
let markers = [];
let AMap = null; // 存储AMap实例
let animationTimer = null;
let currentIndex = 0;
const isAnimating = ref(false);
const animationSpeed = ref(1000); // 默认1000ms (500-2000ms范围)
let sortedData = []; // 存储按时间排序后的数据

// 显示信息窗口 - 确保在正确的作用域内
const showInfoWindow = (marker, autoClose = true) => {
  console.log('Showing info window');
  if (!map || !marker || !AMap) {
    console.warn('Cannot show info window: map, marker, or AMap is not available');
    return null;
  }
  
  const data = marker.getExtData();
  if (!data) {
    console.warn('Marker has no extData');
    return null;
  }
  
  // 创建简洁的信息窗口内容，只显示关键信息，紧凑为一行
  let infoContent = `
    <div class="earthquake-info-window">
      <div class="info-body">
  `;
  
  // 收集所有要显示的信息片段
  const infoParts = [];
  
  // 添加震级
  if (data.Magnitude || data.magnitude || data.M || data.leve) {
    const magnitude = parseFloat(data.Magnitude || data.magnitude || data.M || data.leve);
    if (!isNaN(magnitude)) {
      const severityClass = magnitude >= 7 ? 'severity-major' : 
                            magnitude >= 5 ? 'severity-medium' : 'severity-minor';
      infoParts.push(`<span class="info-magnitude ${severityClass}">${magnitude}</span>`);
    }
  }
  
  // 处理时间字段 - 支持多种可能的时间字段名，优先显示发生时间
  let timeField = null;
  const timeFields = ['OriginTime', 'time', 'addtime'];
  for (const field of timeFields) {
    if (data[field]) {
      timeField = field;
      break;
    }
  }
  
  if (timeField) {
    // 尝试格式化时间
    let formattedTime = data[timeField];
    try {
      const date = new Date(data[timeField]);
      if (!isNaN(date.getTime())) {
        formattedTime = date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      }
    } catch (e) {
      console.warn('Failed to format time:', e);
    }
    infoParts.push(`${formattedTime}`);
  }
  
  // 处理位置字段 - 优先显示中文位置，避免重复
  if (data.Location || data.weizhi || data.placeName) {
    const location = data.Location || data.weizhi || data.placeName;
    infoParts.push(`${location}`);
  }
  
  // 处理震源深度
  if (data.Depth || data.shendu) {
    const depth = data.Depth || data.shendu;
    infoParts.push(`${depth} km`);
  }
  
  // 处理经纬度 - 如果位置信息不存在，才显示坐标
  if (!data.Location && !data.weizhi && !data.placeName) {
    if (data.Latitude && data.Longitude) {
      infoParts.push(`${data.Latitude}°N, ${data.Longitude}°E`);
    } else if (data.weidu && data.jingdu) {
      infoParts.push(`${data.weidu}°N, ${data.jingdu}°E`);
    }
  }
  
  // 将所有信息片段用分隔符连接成一行
  infoContent += `<div class="info-line">${infoParts.join(' | ')}</div>`;
  
  infoContent += `
      </div>
    </div>
  `;
  
  // 创建信息窗口配置
  const infoWindowConfig = {
    content: infoContent,
    offset: new AMap.Pixel(0, -30),
    autoMove: true,
    closeWhenClickMap: autoClose
  };
  
  // 创建并打开信息窗口
  try {
    const infoWindow = new AMap.InfoWindow(infoWindowConfig);
    if (!infoWindow) {
      console.warn('Failed to create AMap.InfoWindow');
      return null;
    }
    
    // 在高德地图2.0版本中，使用infoWindow.open而不是map.openInfoWindow
    const position = marker.getPosition();
    if (!position) {
      console.warn('Marker has no position');
      return null;
    }
    
    infoWindow.open(map, position);
    
    // 保存信息窗口引用到标记对象
    marker.infoWindow = infoWindow;
    
    return infoWindow;
  } catch (error) {
    console.error('Error creating info window:', error);
    return null;
  }
};

// 获取经纬度数据，支持多种可能的字段名
const getCoordinates = (item) => {
  console.log('Checking coordinates for item keys:', Object.keys(item));
  // 尝试不同的经纬度字段名组合
  if (item.Longitude && item.Latitude) {
    console.log('Found Longitude/Latitude:', item.Longitude, item.Latitude);
    return { lon: parseFloat(item.Longitude), lat: parseFloat(item.Latitude), type: 'Longitude/Latitude' };
  } else if (item.lng && item.lat) {
    return { lon: parseFloat(item.lng), lat: parseFloat(item.lat), type: 'lng/lat' };
  } else if (item.lon && item.lat) {
    return { lon: parseFloat(item.lon), lat: parseFloat(item.lat), type: 'lon/lat' };
  } else if (item.Lng && item.Lat) {
    return { lon: parseFloat(item.Lng), lat: parseFloat(item.Lat), type: 'Lng/Lat' };
  } else if (item.Lon && item.Lat) {
    return { lon: parseFloat(item.Lon), lat: parseFloat(item.Lat), type: 'Lon/Lat' };
  }
  
  // 检查其他可能的字段名
  for (const key in item) {
    if (typeof item[key] === 'string' || typeof item[key] === 'number') {
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('lon') || lowerKey.includes('lng')) {
        const latKey = Object.keys(item).find(k => 
          k.toLowerCase().includes('lat') && k !== key
        );
        if (latKey) {
          console.log(`Found coordinates in ${key}/${latKey}:`, item[key], item[latKey]);
          return { 
            lon: parseFloat(item[key]), 
            lat: parseFloat(item[latKey]), 
            type: `${key}/${latKey}` 
          };
        }
      }
    }
  }
  
  console.log('No coordinates found for item');
  return null;
};

// 获取震级数据
const getMagnitude = (item) => {
  // 尝试不同的震级字段名
  if (item.Magnitude) return parseFloat(item.Magnitude);
  if (item.magnitude) return parseFloat(item.magnitude);
  if (item.M) return parseFloat(item.M);
  if (item.m) return parseFloat(item.m);
  if (item.Mag) return parseFloat(item.Mag);
  if (item.mag) return parseFloat(item.mag);
  
  // 查找包含mag相关的字段
  for (const key in item) {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('mag') && (typeof item[key] === 'string' || typeof item[key] === 'number')) {
      return parseFloat(item[key]);
    }
  }
  
  return 0;
};

// 获取时间数据
const getTime = (item) => {
  // 尝试不同的时间字段名
  if (item.OriginTime) return new Date(item.OriginTime).getTime();
  if (item.time) return new Date(item.time).getTime();
  if (item.Time) return new Date(item.Time).getTime();
  if (item.timestamp) return new Date(item.timestamp).getTime();
  if (item.Timestamp) return new Date(item.Timestamp).getTime();
  
  // 查找包含time相关的字段
  for (const key in item) {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('time') && typeof item[key] === 'string') {
      const timeValue = new Date(item[key]).getTime();
      if (!isNaN(timeValue)) return timeValue;
    }
  }
  
  // 如果没有找到时间，返回0
  return 0;
};

// 按时间排序地震数据
const sortByTime = (data) => {
  return [...data].sort((a, b) => {
    const timeA = getTime(a);
    const timeB = getTime(b);
    return timeA - timeB; // 升序排序，从早到晚
  });
};

// 记录上一个打开的信息窗口，用于自动关闭
let lastOpenedInfoWindow = null;

// 创建单个标记
const createMarker = (item, index) => {
  try {
    // 使用通用函数获取坐标
    const coords = getCoordinates(item);
    
    if (coords && !isNaN(coords.lon) && !isNaN(coords.lat)) {
      // 获取震级
      const magnitude = getMagnitude(item);
      const markerSize = Math.max(10, magnitude * 3); // 最小10，根据震级放大
      
      // 根据震级设置不同颜色
      let markerColor = '#FF9999'; // 小地震 - 浅红色
      if (magnitude >= 5 && magnitude < 7) {
        markerColor = '#FF6600'; // 中等地震 - 橙色
      } else if (magnitude >= 7) {
        markerColor = '#FF0000'; // 大地震 - 红色
      }
      
      // 创建带有动画效果的标记
      const content = `
        <div class="earthquake-marker" style="
          width: ${markerSize}px; 
          height: ${markerSize}px; 
          background-color: ${markerColor}; 
          border-radius: 50%; 
          opacity: 0.8; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          border: 2px solid white; 
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          font-size: ${Math.max(10, markerSize * 0.4)}px;
          font-weight: 600;
          color: white;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        ">${magnitude || ''}</div>
        <div class="marker-pulse" style="
          position: absolute;
          width: ${markerSize * 1.5}px;
          height: ${markerSize * 1.5}px;
          background-color: ${markerColor};
          border-radius: 50%;
          opacity: 0.5;
          animation: pulse-ring 1.5s infinite;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "></div>
      `;
      
      const marker = new AMap.Marker({
        position: [coords.lon, coords.lat],
        content: content,
        offset: new AMap.Pixel(-markerSize/2, -markerSize/2),
        extData: item, // 存储原始数据用于弹出信息
        zIndex: 100 + index // 根据顺序设置z-index
      });
      
      // 添加点击事件
      marker.on('click', (e) => {
        showInfoWindow(e.target, false); // 点击时不自动关闭，用户可以主动关闭
      });
      
      markers.push(marker);
      marker.setMap(map);
      
      // 在添加标记后自动显示信息窗口，并管理之前打开的窗口
      setTimeout(() => {
        // 如果之前有打开的信息窗口，先关闭它
        if (lastOpenedInfoWindow && typeof lastOpenedInfoWindow.getMap === 'function' && lastOpenedInfoWindow.getMap()) {
          lastOpenedInfoWindow.close();
        }
        
        // 为当前标记显示信息窗口，并设置为不随地图点击关闭
        const infoWindow = showInfoWindow(marker, false);
        if (!infoWindow) {
          console.warn('Failed to create info window for marker');
          return;
        }
        
        lastOpenedInfoWindow = infoWindow;
        
        // 设置自动关闭计时器，3秒后自动关闭，除非用户手动交互
        const closeTimer = setTimeout(() => {
          if (infoWindow === lastOpenedInfoWindow && 
              typeof infoWindow.getMap === 'function' && 
              infoWindow.getMap()) {
            infoWindow.close();
          }
        }, 3000);
        
        // 监听信息窗口的打开和关闭事件（需要检查方法是否存在）
        if (infoWindow && typeof infoWindow.on === 'function') {
          infoWindow.on('open', () => {
            lastOpenedInfoWindow = infoWindow;
          });
          
          infoWindow.on('close', () => {
            clearTimeout(closeTimer);
          });
        }
      }, 500); // 延迟显示信息窗口，让标记动画先完成
      
      // 调试信息
      console.log(`Marker added: ${index + 1}/${sortedData.length}, Time: ${item.OriginTime || item.time || 'Unknown'}, Magnitude: ${magnitude}`);
      
      return true;
    } else {
      console.log(`No coordinates found for item at index ${index}`);
      return false;
    }
  } catch (error) {
    console.warn(`Error adding marker at index ${index}:`, error);
    return false;
  }
};

// 按时间顺序依次添加标记
const addMarkersSequentially = () => {
  if (currentIndex < sortedData.length) {
    const success = createMarker(sortedData[currentIndex], currentIndex);
    if (success) {
      currentIndex++;
    } else {
      // 如果当前项无法添加，直接跳到下一项
      currentIndex++;
    }
    
    // 设置下一个定时器
    if (currentIndex < sortedData.length && isAnimating.value) {
      animationTimer = setTimeout(addMarkersSequentially, animationSpeed.value);
    } else if (currentIndex >= sortedData.length) {
      // 动画完成
      isAnimating.value = false;
      console.log('Animation completed, all markers added');
    }
  }
};

// 开始动画
const startAnimation = () => {
  if (!map || !AMap || sortedData.length === 0) {
    console.warn('Cannot start animation: map not initialized or no data');
    return;
  }
  
  isAnimating.value = true;
  console.log('Starting animation with speed:', animationSpeed.value, 'ms');
  addMarkersSequentially();
};

// 停止动画
const stopAnimation = () => {
  isAnimating.value = false;
  if (animationTimer) {
    clearTimeout(animationTimer);
    animationTimer = null;
  }
  console.log('Animation stopped at index:', currentIndex);
};

// 重置动画
const resetAnimation = () => {
  stopAnimation();
  
  // 清除所有标记
  if (markers.length > 0) {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
  }
  
  currentIndex = 0;
  console.log('Animation reset');
};

// 更新动画速度
const updateAnimationSpeed = () => {
  console.log('Animation speed updated to:', animationSpeed.value, 'ms');
  
  // 如果动画正在运行，重新设置定时器
  if (isAnimating.value && animationTimer) {
    clearTimeout(animationTimer);
    animationTimer = setTimeout(addMarkersSequentially, animationSpeed.value);
  }
};

// 根据地震数据更新地图标记（修改为支持按时间顺序显示）
const updateMarkers = (data) => {
  console.log('Updating markers with data count:', data.length);
  
  if (!map || !AMap) {
    console.warn('Map or AMap instance not initialized');
    return;
  }
  
  // 重置动画状态
  resetAnimation();
  
  // 按时间排序数据
  sortedData = sortByTime(data);
  console.log('Data sorted by time, count:', sortedData.length);
  
  // 显示前几个数据点的时间信息用于调试
  if (sortedData.length > 0) {
    const firstFew = sortedData.slice(0, Math.min(3, sortedData.length));
    console.log('First few sorted items:', firstFew.map(item => ({
      time: item.OriginTime || item.time || 'Unknown',
      magnitude: getMagnitude(item)
    })));
  }
  
  // 默认不开启动画，用户需要手动点击"开始动画"按钮
  // startAnimation();
};

// 初始化地图
const initMap = () => {
  console.log('Initializing map...');
  window._AMapSecurityConfig = {
    securityJsCode: "eb75f9c1522697027bc209a5118312bc",
  };
  
  AMapLoader.load({
    key: "9771b6c463e702fa00e2602f11b2f7f8", // 申请好的Web端开发者Key
    version: "2.0",
    plugins: ["AMap.Scale"],
  })
    .then((amapInstance) => {
      console.log('Map loaded successfully');
      // 保存AMap实例
      AMap = amapInstance;
      
      // 初始化地图，设置为全球视图
      map = new AMap.Map(mapContainer.value, {
        viewMode: "3D",
        zoom: 2, // 设置较小的缩放级别以显示全球
        center: [0, 20], // 设置初始中心点
      });
      
      // 添加比例尺控件
      map.addControl(new AMap.Scale());
      
      console.log('Map initialized with data count:', props.earthquakeData.length);
      // 如果已有数据，添加标记
      if (props.earthquakeData.length > 0) {
        updateMarkers(props.earthquakeData);
      }
    })
    .catch((e) => {
      console.error('地图初始化失败:', e);
    });
};

// 监听数据变化
watch(() => props.earthquakeData, (newData, oldData) => {
  console.log(`Data changed: ${oldData?.length || 0} -> ${newData?.length || 0}`);
  if (newData && newData.length > 0) {
    updateMarkers(newData);
  }
}, { deep: true, immediate: true });

// 组件挂载时初始化地图
onMounted(() => {
  console.log('Component mounted, initializing map...');
  initMap();
});

// 组件销毁时清理地图实例
onUnmounted(() => {
  stopAnimation();
  if (map) {
    map.destroy();
    map = null;
  }
  markers = [];
  sortedData = [];
});
</script>

<style scoped>
.earthquake-map {
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

/* 地图头部样式 */
.map-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
}

.map-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
}

/* 图例样式 */
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

#map-container {
  width: 100%;
  height: 500px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 控件样式 */
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

/* 按钮样式 */
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

/* 速度控制样式 */
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

/* 动画状态指示器 */
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

/* 添加脉冲动画效果 */
@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
}

/* 脉冲环动画 */
@keyframes pulse-ring {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.7;
  }
  70% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0;
  }
}

/* 状态指示器闪烁动画 */
@keyframes status-blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .earthquake-map {
    padding: 15px;
  }
  
  .map-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .map-header h3 {
    font-size: 20px;
  }
  
  .legend {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  #map-container {
    height: 350px;
  }
  
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

/* 信息窗口样式 */
:deep(.earthquake-info-window) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  max-width: 320px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

:deep(.earthquake-info-window:hover) {
  transform: translateY(-2px);
}

:deep(.earthquake-info-window .info-body) {
  background-color: white;
  padding: 8px 12px;
  border-radius: 8px;
}

:deep(.earthquake-info-window .info-line) {
  font-size: 13px;
  line-height: 1.4;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.earthquake-info-window .info-magnitude) {
  font-size: 15px !important;
  font-weight: 700;
  margin-right: 4px;
}

:deep(.earthquake-info-window .severity-major) {
  color: #C62828;
}

:deep(.earthquake-info-window .severity-medium) {
  color: #E65100;
}

:deep(.earthquake-info-window .severity-minor) {
  color: #1B5E20;
}
</style>