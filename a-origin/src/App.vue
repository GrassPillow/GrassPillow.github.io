<template>
<!-- 导航栏 -->
    <div class="nav-container">
        <router-link to="/home">首页</router-link>｜
        <router-link to="/about">关于</router-link>｜
        <router-link to="/clock">时钟</router-link>｜
        <router-link to="/map">地图</router-link>｜
        <router-link to="/weather">天气</router-link>
    </div>
    <router-view></router-view>
</template>

<script>
export default {
  name: "App",
  components: {
  },
  // 默认加载
  mounted() {
    // 获取ip地址
    // axios.get("http://ip-api.com/json?lang=zh-CN").then((res) => {
    //   console.log(res);
    // });
  },
};
</script>

<style>
body {
  background-color: #f5f5f7;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.nav-container {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

/* 导航栏样式 - 苹果风格 */
.router-link {
  color: #1d1d1f;
  text-decoration: none;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-weight: 500;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.router-link:hover {
  background-color: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

/* 内容区域 */
.router-view {
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  margin: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>
