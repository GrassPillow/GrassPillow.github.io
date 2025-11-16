<template>
  <div class="earthquake-map">
    <h3>地震分布地图</h3>
    <div id="map-container" ref="mapContainer"></div>
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

// 根据地震数据更新地图标记
const updateMarkers = (data) => {
  console.log('Updating markers with data count:', data.length);
  
  if (!map || !AMap) {
    console.warn('Map or AMap instance not initialized');
    return;
  }
  
  // 清除旧标记
  if (markers.length > 0) {
    console.log('Clearing existing markers:', markers.length);
    markers.forEach(marker => {
      marker.setMap(null);
    });
    markers = [];
  }
  
  let markersAdded = 0;
  let markersFailed = 0;
  let coordinateTypes = {};
  
  // 添加新标记
  data.forEach((item, index) => {
    try {
      // 使用通用函数获取坐标
      const coords = getCoordinates(item);
      
      if (coords && !isNaN(coords.lon) && !isNaN(coords.lat)) {
        // 记录坐标类型
        coordinateTypes[coords.type] = (coordinateTypes[coords.type] || 0) + 1;
        
        // 获取震级
        const magnitude = getMagnitude(item);
        const markerSize = Math.max(10, magnitude * 3); // 最小10，根据震级放大
        
        // 创建简单的红色圆形标记，更容易识别
        const content = `<div style="width: ${markerSize}px; height: ${markerSize}px; background-color: #FF0000; border-radius: 50%; opacity: 0.8; display: flex; align-items: center; justify-content: center; border: 2px solid white;">${magnitude || ''}</div>`;
        
        const marker = new AMap.Marker({
          position: [coords.lon, coords.lat],
          content: content,
          offset: new AMap.Pixel(-markerSize/2, -markerSize/2),
          extData: item // 存储原始数据用于弹出信息
        });
        
        // 添加点击事件
        marker.on('click', (e) => {
          showInfoWindow(e.target);
        });
        
        markers.push(marker);
        marker.setMap(map);
        markersAdded++;
        
        // 调试：只显示前10个标记
        if (index < 10) {
          console.log(`Marker ${index}:`, {
            position: [coords.lon, coords.lat],
            magnitude: magnitude,
            coordinateType: coords.type
          });
        }
      } else {
        // 调试：记录没有坐标的项目
        if (index < 3) {
          console.log(`No coordinates found for item ${index}:`, Object.keys(item));
        }
        markersFailed++;
      }
    } catch (error) {
      console.warn(`Error adding marker ${index}:`, error);
      markersFailed++;
    }
  });
  
  console.log(`Marker update summary: ${markersAdded} added, ${markersFailed} failed`);
  console.log('Coordinate types found:', coordinateTypes);
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
  if (map) {
    map.destroy();
    map = null;
  }
  markers = [];
});
</script>

<style scoped>
.earthquake-map {
  width: 100%;
  margin-bottom: 20px;
}

#map-container {
  width: 100%;
  height: 400px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>