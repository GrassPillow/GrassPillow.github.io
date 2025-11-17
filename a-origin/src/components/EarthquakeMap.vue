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
const showInfoWindow = (marker, autoClose = true) => {
  console.log('Showing info window');
  if (!map || !marker || !AMap) return;
  
  const data = marker.getExtData();
  
  // 创建更美观的信息窗口内容
  let infoContent = `
    <div class="earthquake-info-window">
      <div class="info-header">
        <h4>地震详情</h4>
      </div>
      <div class="info-body">
  `;
  
  // 已显示字段的跟踪，避免重复显示
  const displayedFields = new Set();
  
  // 添加关键信息，优先显示重要字段
  if (data.Magnitude) {
    const magnitude = parseFloat(data.Magnitude);
    const severityClass = magnitude >= 7 ? 'severity-major' : 
                          magnitude >= 5 ? 'severity-medium' : 'severity-minor';
    infoContent += `<div class="info-magnitude ${severityClass}"><strong>震级:</strong> ${magnitude}</div>`;
    displayedFields.add('Magnitude');
  }
  
  // 处理时间字段 - 支持多种可能的时间字段名
  let timeField = null;
  const timeFields = ['OriginTime', 'time', 'Time', 'timestamp', 'Timestamp'];
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
    infoContent += `<div><strong>发生时间:</strong> ${formattedTime}</div>`;
    displayedFields.add(timeField);
  }
  
  // 处理位置字段
  if (data.Location) {
    infoContent += `<div><strong>地点:</strong> ${data.Location}</div>`;
    displayedFields.add('Location');
  } else if (data.Latitude && data.Longitude) {
    infoContent += `<div><strong>位置坐标:</strong> 纬度${data.Latitude}, 经度${data.Longitude}</div>`;
    displayedFields.add('Latitude');
    displayedFields.add('Longitude');
  }
  
  // 处理震源深度
  if (data.Depth) {
    infoContent += `<div><strong>震源深度:</strong> ${data.Depth} km</div>`;
    displayedFields.add('Depth');
  }
  
  // 处理事件ID
  if (data.EventID) {
    infoContent += `<div><strong>事件ID:</strong> ${data.EventID}</div>`;
    displayedFields.add('EventID');
  }
  
  // 添加额外信息字段
  const additionalFields = ['Source', 'Region', 'Type'];
  additionalFields.forEach(field => {
    if (data[field]) {
      infoContent += `<div><strong>${field}:</strong> ${data[field]}</div>`;
      displayedFields.add(field);
    }
  });
  
  // 添加分隔线，准备显示其他所有可用字段
  infoContent += '<hr style="margin: 10px 0; border: none; border-top: 1px solid #eee;">';
  infoContent += '<div style="font-size: 12px; margin-bottom: 8px; color: #666; font-weight: 500;">详细信息:</div>';
  
  // 显示所有其他未显示的非空字段
  let extraFieldCount = 0;
  for (const [key, value] of Object.entries(data)) {
    // 跳过已显示的字段和空值
    if (displayedFields.has(key) || value === null || value === undefined || value === '') {
      continue;
    }
    
    // 跳过复杂对象和数组，只显示简单类型的值
    if (typeof value === 'object' && value !== null) {
      continue;
    }
    
    // 格式化键名，使其更易读（例如将驼峰命名转换为空格分隔的形式）
    let formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
    formattedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
    
    infoContent += `<div><strong>${formattedKey}:</strong> ${String(value)}</div>`;
    extraFieldCount++;
  }
  
  // 如果没有额外字段，显示提示信息
  if (extraFieldCount === 0) {
    infoContent += '<div style="color: #999; font-style: italic; font-size: 12px;">暂无其他详细信息</div>';
  }
  
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
  const infoWindow = new AMap.InfoWindow(infoWindowConfig);
  // 在高德地图2.0版本中，使用infoWindow.open而不是map.openInfoWindow
  infoWindow.open(map, marker.getPosition());
  
  // 保存信息窗口引用到标记对象
  marker.infoWindow = infoWindow;
  
  return infoWindow;
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
      const content = `<div style="width: ${markerSize}px; height: ${markerSize}px; background-color: ${markerColor}; border-radius: 50%; opacity: 0.8; display: flex; align-items: center; justify-content: center; border: 2px solid white; animation: pulse 0.6s ease-in-out;">${magnitude || ''}</div>`;
      
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
        if (lastOpenedInfoWindow && lastOpenedInfoWindow.getMap()) {
          lastOpenedInfoWindow.close();
        }
        
        // 为当前标记显示信息窗口，并设置为不随地图点击关闭
        const infoWindow = showInfoWindow(marker, false);
        lastOpenedInfoWindow = infoWindow;
        
        // 设置自动关闭计时器，3秒后自动关闭，除非用户手动交互
        const closeTimer = setTimeout(() => {
          if (infoWindow === lastOpenedInfoWindow && infoWindow.getMap()) {
            infoWindow.close();
          }
        }, 3000);
        
        // 监听信息窗口的打开和关闭事件
        infoWindow.on('open', () => {
          lastOpenedInfoWindow = infoWindow;
        });
        
        infoWindow.on('close', () => {
          clearTimeout(closeTimer);
        });
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

/* 信息窗口样式 */
:deep(.earthquake-info-window) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 300px;
}

:deep(.earthquake-info-window .info-header) {
  background-color: #1E88E5;
  color: white;
  padding: 10px 15px;
  margin: 0;
}

:deep(.earthquake-info-window .info-header h4) {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

:deep(.earthquake-info-window .info-body) {
  background-color: white;
  padding: 12px 15px;
}

:deep(.earthquake-info-window .info-body div) {
  margin: 6px 0;
  font-size: 14px;
  line-height: 1.4;
}

:deep(.earthquake-info-window .info-body strong) {
  color: #333;
  display: inline-block;
  width: 80px;
}

:deep(.earthquake-info-window .info-magnitude) {
  font-size: 16px !important;
  font-weight: 600;
  margin-bottom: 10px !important;
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