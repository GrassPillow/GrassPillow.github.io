<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <div>
    <digital-clock id="digital-clock-1"></digital-clock>
  </div>
</template>

<script>
import DigitalClock from "./components/DigitalClock.vue";
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: "App",
  components: {
    DigitalClock,
    // HelloWorld
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
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50; */
  /* margin-top: 60px; */
}

#digital-clock-1 {
  height: 100vh;
  font-size: 16vw;
  line-height: 100vh;
  font-family: "Courier New", Courier, monospace;
}
</style>
