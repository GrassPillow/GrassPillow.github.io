<template>  
    <div class="digital-clock">  
      {{ formattedTime }}  
    </div>  
  </template>  
    
  <script>  
  import { ref, onMounted, onUnmounted } from 'vue';  
    
  export default {  
    name: 'DigitalClock',  
    
    setup() {  
      const currentTime = ref(new Date());  
      const formattedTime = ref('');  
    
      const updateTime = () => {  
        currentTime.value = new Date();  
        console.log('Current time:', currentTime.value);  
        formattedTime.value = currentTime.value.toLocaleTimeString();  
        console.log('Formatted time:', formattedTime.value);  
      };  
    
      const timerId = setInterval(updateTime, 1000);  
    
      onMounted(() => {  
        updateTime();  
      });  
    
      onUnmounted(() => {  
        clearInterval(timerId);  
      });  
    
      return {  
        formattedTime,  
      };  
    },  
  };  
  </script>  
    
  <style scoped>  
  .digital-clock {  
    text-align: center;  
    font-size: 36dvh;
    padding-top: 32dvh;
    font-family: 'Arial', sans-serif;  
  }  
  </style>