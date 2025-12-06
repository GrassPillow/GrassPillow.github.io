<template>
  <div id="container"></div>
</template>
<script>
import AMapLoader from "@amap/amap-jsapi-loader";
import axios from "axios";

export default {
  data() {
    return {
      lon: 116.39742,
      lat: 39.90923,
    };
  },
  name: "map-view",
  mounted() {
    this.initAMap();
    this.getEarthquakeData();
  },
  unmounted() {
    this.map?.destroy();
  },
  methods: {
    getLocationByIP() {
      axios.get("http://ip-api.com/json?lang=zh-CN").then((res) => {
        console.log(res);
        this.lon = res.data.lon;
        this.lat = res.data.lat;
        console.log(1,this.lon, this.lat);
      });
    },
    initAMap() {
      window._AMapSecurityConfig = {
        //   securityJsCode: "「你申请的安全密钥」",
        securityJsCode: "eb75f9c1522697027bc209a5118312bc",
      };
      AMapLoader.load({
        key: "9771b6c463e702fa00e2602f11b2f7f8", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
      })
        .then((AMap) => {
          console.log(2,this.lon, this.lat);
          this.map = new AMap.Map("container", {
            // 设置地图容器id
            viewMode: "3D", // 是否为3D地图模式
            zoom: 5, // 初始化地图级别
            center: [this.lon, this.lat], // 初始化地图中心点位置
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getEarthquakeData() {
      axios.get('https://cn.apihz.cn/api/tianqi/dizhen.php?id=88888888&key=88888888')
        .then(response => {
          console.log('地震数据:', response.data);
          // 这里可以添加处理地震数据并传递给地震图层的逻辑
        })
        .catch(error => {
          console.error('获取地震数据失败:', error);
        });
    },

  },
};
</script>
<style scoped>
#container {
  width: 100%;
  height: 800px;
}
</style>
