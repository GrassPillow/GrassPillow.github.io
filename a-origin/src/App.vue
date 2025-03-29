<template>
  <div>
    <router-view></router-view>
  </div>
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
  background-color: rgb(102, 126, 126);
  margin: 0;
  padding: 0;
}
#app {
  height: 100vh;
}

#digital-clock-1 {
  height: 100vh;
  font-size: 16vw;
  line-height: 100vh;
  font-family: "Courier New", Courier, monospace;
  display: none;
}
#map-container {
  height: 100vh;
}
</style>
