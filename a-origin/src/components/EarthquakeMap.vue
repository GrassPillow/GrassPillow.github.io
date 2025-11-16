<template>
  <div class="earthquake-map">
    <h3>地震分布地图 - 按时间顺序展示</h3>
    <div id="map-container" ref="mapContainer"></div>
    <div class="controls">
      <button @click="startAnimation" :disabled="isAnimating">开始动画</button>
      <button @click="stopAnimation" :disabled="!isAnimating">停止动画</button>
      <button @click="resetAnimation">重置</button>
      <input type="range" v-model.number="animationSpeed" min="50" max="1000" step="50" 
             @input="updateAnimationSpeed" placeholder="动画速度">
      <span>{{ animationSpeed }}ms</span>
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
const animationSpeed = ref(300); // 默认300ms
let sortedData = []; // 存储按时间排序后的数据

// 显示信息窗口 - 确保在正确的作用域内
const showInfoWindow = (marker) => {
  console.log('Showing info window');
  if (!map || !marker || !AMap) return;
  
  const data = marker.getExtData();
  let infoContent = '<div style="padding: 10px;">';
  
  // 添加关键信息
  if (data.EventID) infoContent += `<p><strong>事件ID:</strong> ${data.EventID}</p>`;
  if (data.OriginTime) infoContent += `<p><strong>发生时间:</strong> ${data.OriginTime}</p>`;
  if (data.Latitude && data.Longitude) infoContent += `<p><strong>位置:</strong> 纬度${data.Latitude}, 经度${data.Longitude}</p>`;
  if (data.Depth) infoContent += `<p><strong>深度:</strong> ${data.Depth} km</p>`;
  if (data.Magnitude) infoContent += `<p><strong>震级:</strong> ${data.Magnitude}</p>`;
  if (data.Location) infoContent += `<p><strong>地点:</strong> ${data.Location}</p>`;
  
  infoContent += '</div>';
  
  // 创建并打开信息窗口
  map.openInfoWindow(new AMap.InfoWindow({
    content: infoContent,
    offset: new AMap.Pixel(0, -30)
  }), marker.getPosition());
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

// 创建单个标记
const createMarker = (item, index) => {
  try {
    // 使用通用函数获取坐标
    const coords = getCoordinates(item);
    
    if (coords && !isNaN(coords.lon) && !isNaN(coords.lat)) {
      // 获取震级
      const magnitude = getMagnitude(item);
      const markerSize = Math.max(10, magnitude * 3); // 最小10，根据震级放大
      
      // 创建带有动画效果的红色圆形标记
      const content = `<div style="width: ${markerSize}px; height: ${markerSize}px; background-color: #FF0000; border-radius: 50%; opacity: 0.8; display: flex; align-items: center; justify-content: center; border: 2px solid white; animation: pulse 0.6s ease-in-out;">${magnitude || ''}</div>`;
      
      const marker = new AMap.Marker({
        position: [coords.lon, coords.lat],
        content: content,
        offset: new AMap.Pixel(-markerSize/2, -markerSize/2),
        extData: item, // 存储原始数据用于弹出信息
        zIndex: 100 + index // 根据顺序设置z-index
      });
      
      // 添加点击事件
      marker.on('click', (e) => {
        showInfoWindow(e.target);
      });
      
      markers.push(marker);
      marker.setMap(map);
      
      // 调试信息
      console.log(`Marker added: ${index + 1}/${sortedData.length}, Time: ${item.OriginTime || item.time || 'Unknown'}`);
      
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
  
  // 自动开始动画
  startAnimation();
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
}

#map-container {
  width: 100%;
  height: 700px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.controls {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.controls button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.controls button:hover:not(:disabled) {
  background-color: #45a049;
}

.controls button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.controls input[type="range"] {
  width: 150px;
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
</style>