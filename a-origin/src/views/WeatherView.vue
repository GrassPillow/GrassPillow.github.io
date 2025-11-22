<template>
  <div class="weather-view">
    <header class="page-header">
      <h1 class="page-title">天气预报</h1>
      <p class="page-description">实时天气信息，为您提供准确的天气预报服务</p>
    </header>

    <main class="main-content">
      <!-- 搜索框 -->
      <div class="search-container">
        <div class="search-box">
          <input
            v-model="searchCity"
            type="text"
            placeholder="输入城市名称，如：北京、Shanghai、Tokyo"
            class="search-input"
            @keyup.enter="searchWeather"
          />
          <button class="search-button" @click="searchWeather">
            <span>搜索</span>
          </button>
        </div>
        <div class="location-buttons">
          <button class="location-btn" @click="getCurrentLocation">
            <span>📍</span> 获取当前位置
          </button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>正在加载天气数据...</p>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="error-container">
        <p>{{ error }}</p>
        <button class="retry-button" @click="retry">重试</button>
      </div>

      <!-- 天气信息卡片 -->
      <div v-if="weatherData && !loading" class="weather-container">
        <!-- 当前天气 -->
        <div class="current-weather-card">
          <div class="weather-header">
            <div class="location-info">
              <h2 class="city-name">{{ weatherData.city }}</h2>
              <p class="location-detail">{{ weatherData.country }}</p>
            </div>
            <div class="weather-icon">
              <span v-if="weatherData.icon && weatherData.icon.startsWith('http')" class="icon-wrapper">
                <img
                  :src="weatherData.icon"
                  :alt="weatherData.description"
                  class="icon-img"
                />
              </span>
              <span v-else class="icon-emoji">{{ weatherData.icon || '☀️' }}</span>
            </div>
          </div>

          <div class="temperature-section">
            <div class="main-temp">{{ weatherData.temperature }}°C</div>
            <div v-if="weatherData.feelsLike !== weatherData.temperature" class="feels-like">体感温度: {{ weatherData.feelsLike }}°C</div>
            <div class="description">{{ weatherData.description }}</div>
          </div>

          <div class="weather-details">
            <div class="detail-item">
              <span class="detail-label">湿度</span>
              <span class="detail-value">{{ weatherData.humidity }}%</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">风速</span>
              <span class="detail-value">{{ weatherData.windSpeed }} m/s</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">气压</span>
              <span class="detail-value">{{ weatherData.pressure }} hPa</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">能见度</span>
              <span class="detail-value">{{ weatherData.visibility }} km</span>
            </div>
          </div>
        </div>

        <!-- 穿衣推荐 -->
        <div v-if="weatherData && weatherData.clothingAdvice && !loading" class="clothing-advice-card">
          <div class="advice-header">
            <h3 class="advice-title">👔 穿衣推荐</h3>
            <span class="advice-level" :class="getLevelClass(weatherData.clothingAdvice.level)">
              {{ weatherData.clothingAdvice.level }}
            </span>
          </div>
          
          <div class="advice-content">
            <div class="outfit-section">
              <h4 class="section-title">推荐穿搭</h4>
              <div class="outfit-tags">
                <span
                  v-for="(item, index) in weatherData.clothingAdvice.outfit"
                  :key="index"
                  class="outfit-tag"
                >
                  {{ item }}
                </span>
              </div>
            </div>
            
            <div v-if="weatherData.clothingAdvice.tips && weatherData.clothingAdvice.tips.length > 0" class="tips-section">
              <h4 class="section-title">温馨提示</h4>
              <ul class="tips-list">
                <li
                  v-for="(tip, index) in weatherData.clothingAdvice.tips"
                  :key="index"
                  class="tip-item"
                >
                  {{ tip }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 未来几天预报 -->
        <div v-if="forecastData && forecastData.length > 0" class="forecast-section">
          <h3 class="forecast-title">未来几天预报</h3>
          <div class="forecast-list">
            <div
              v-for="(day, index) in forecastData"
              :key="index"
              class="forecast-card"
            >
              <div class="forecast-date">{{ day.date }}</div>
              <div class="forecast-icon">
                <span v-if="day.icon && day.icon.startsWith('http')" class="forecast-icon-wrapper">
                  <img :src="day.icon" :alt="day.description" />
                </span>
                <span v-else class="forecast-icon-emoji">{{ day.icon || '☀️' }}</span>
              </div>
              <div class="forecast-temp">
                <span class="temp-high">{{ day.tempMax }}°</span>
                <span class="temp-low">/ {{ day.tempMin }}°</span>
              </div>
              <div class="forecast-desc">{{ day.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 默认提示 -->
      <div v-if="!weatherData && !loading && !error" class="welcome-container">
        <div class="welcome-icon">☀️</div>
        <h3>欢迎使用天气预报</h3>
        <p>请输入城市名称或点击"获取当前位置"来查看天气信息</p>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'WeatherView',
  data() {
    return {
      searchCity: '',
      weatherData: null,
      forecastData: [],
      loading: false,
      error: null,
      // 使用免费的 OpenWeatherMap API
      // 请访问 https://openweathermap.org/api 注册获取免费的 API Key
      // 或者使用 Open-Meteo API（无需API key，完全免费）
      apiKey: '', // 如果使用 OpenWeatherMap，请在这里填入您的 API Key
      useOpenWeatherMap: false // 设置为 true 使用 OpenWeatherMap，false 使用 Open-Meteo
    }
  },
  mounted() {
    // 默认加载北京天气
    this.searchCity = '北京'
    this.searchWeather()
  },
  methods: {
    async searchWeather() {
      if (!this.searchCity.trim()) {
        this.error = '请输入城市名称'
        return
      }

      this.loading = true
      this.error = null

      try {
        if (this.useOpenWeatherMap && this.apiKey) {
          await this.fetchOpenWeatherMap()
        } else {
          await this.fetchOpenMeteo()
        }
      } catch (err) {
        this.error = '获取天气数据失败，请检查网络连接或稍后重试'
        console.error('Weather API Error:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchOpenMeteo() {
      // 使用 Open-Meteo API（免费，无需API key）
      // 首先通过地理编码API获取城市坐标
      const city = encodeURIComponent(this.searchCity)
      
      // 使用 Open-Meteo 的地理编码API获取坐标
      const geocodeResponse = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=zh&format=json`,
        { timeout: 10000 }
      )

      if (!geocodeResponse.data.results || geocodeResponse.data.results.length === 0) {
        throw new Error('未找到该城市')
      }

      const location = geocodeResponse.data.results[0]
      const latitude = location.latitude
      const longitude = location.longitude
      const cityName = location.name
      const country = location.country || ''

      // 获取当前天气和预报
      const weatherResponse = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,pressure_msl,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FShanghai&forecast_days=6`,
        { timeout: 10000 }
      )

      const data = weatherResponse.data
      const current = data.current

      // 天气代码转中文描述
      const weatherDescriptions = {
        0: '晴朗', 1: '大部分晴朗', 2: '部分多云', 3: '阴天',
        45: '雾', 48: '沉积霜雾',
        51: '小雨', 53: '中雨', 55: '大雨',
        56: '冻雨', 57: '强冻雨',
        61: '小雨', 63: '中雨', 65: '大雨',
        66: '冻雨', 67: '强冻雨',
        71: '小雪', 73: '中雪', 75: '大雪',
        77: '雪粒',
        80: '小雨', 81: '中雨', 82: '大雨',
        85: '小雪', 86: '大雪',
        95: '雷暴', 96: '雷暴伴冰雹', 99: '强雷暴伴冰雹'
      }

      const weatherCode = current.weather_code
      const description = weatherDescriptions[weatherCode] || '未知'

      const temp = Math.round(current.temperature_2m)
      const windSpeed = Math.round(current.wind_speed_10m * 10) / 10
      
      this.weatherData = {
        city: cityName,
        country: country,
        temperature: temp,
        feelsLike: Math.round(current.temperature_2m), // Open-Meteo 不提供体感温度，使用当前温度
        description: description,
        humidity: current.relative_humidity_2m,
        windSpeed: windSpeed,
        pressure: Math.round(current.pressure_msl),
        visibility: current.visibility ? (current.visibility / 1000).toFixed(1) : 'N/A',
        icon: this.getWeatherIcon(weatherCode),
        weatherCode: weatherCode,
        clothingAdvice: this.getClothingAdvice(temp, weatherCode, windSpeed, current.relative_humidity_2m)
      }

      // 获取未来几天的预报
      if (data.daily && data.daily.time) {
        this.forecastData = data.daily.time.slice(1, 6).map((date, index) => {
          const code = data.daily.weather_code[index + 1]
          return {
            date: this.formatDate(date),
            tempMax: Math.round(data.daily.temperature_2m_max[index + 1]),
            tempMin: Math.round(data.daily.temperature_2m_min[index + 1]),
            description: weatherDescriptions[code] || '未知',
            icon: this.getWeatherIcon(code)
          }
        })
      }
    },

    getWeatherIcon(weatherCode) {
      // 根据天气代码返回图标URL（使用 Open-Meteo 推荐的图标服务）
      // 这里使用一个简单的天气图标映射
      const iconMap = {
        0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
        45: '🌫️', 48: '🌫️',
        51: '🌦️', 53: '🌦️', 55: '🌧️',
        56: '🌨️', 57: '🌨️',
        61: '🌦️', 63: '🌧️', 65: '🌧️',
        66: '🌨️', 67: '🌨️',
        71: '🌨️', 73: '🌨️', 75: '🌨️',
        77: '🌨️',
        80: '🌦️', 81: '🌧️', 82: '🌧️',
        85: '🌨️', 86: '🌨️',
        95: '⛈️', 96: '⛈️', 99: '⛈️'
      }
      return iconMap[weatherCode] || '☀️'
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      const month = date.getMonth() + 1
      const day = date.getDate()
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      const weekday = weekdays[date.getDay()]
      return `${month}月${day}日 ${weekday}`
    },

    getClothingAdvice(temperature, weatherCode, windSpeed, humidity = null) {
      // 根据温度、天气状况和风速提供穿衣建议
      const isRainy = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)
      const isSnowy = [71, 73, 75, 77, 85, 86].includes(weatherCode)
      const isStormy = [95, 96, 99].includes(weatherCode)
      const isWindy = windSpeed > 5 // 风速大于5m/s算大风
      
      let advice = {
        level: '', // 保暖等级：很冷、冷、凉爽、舒适、温暖、炎热
        outfit: [], // 推荐穿搭
        tips: [] // 额外提示
      }

      // 根据温度判断
      if (temperature <= 0) {
        advice.level = '很冷'
        advice.outfit = ['厚羽绒服', '保暖内衣', '毛衣', '厚裤子', '保暖靴', '围巾', '手套', '帽子']
        advice.tips = ['注意保暖，避免长时间户外活动']
      } else if (temperature <= 10) {
        advice.level = '冷'
        advice.outfit = ['羽绒服或厚外套', '长袖T恤或毛衣', '长裤', '运动鞋或靴子']
        if (isWindy) {
          advice.outfit.push('防风外套')
          advice.tips.push('风力较大，建议穿防风衣物')
        }
      } else if (temperature <= 20) {
        advice.level = '凉爽'
        advice.outfit = ['薄外套或风衣', '长袖T恤', '长裤', '运动鞋']
        if (isWindy) {
          advice.outfit.push('薄外套')
          advice.tips.push('有风，建议加件薄外套')
        }
      } else if (temperature <= 25) {
        advice.level = '舒适'
        advice.outfit = ['薄长袖或短袖', '薄长裤或九分裤', '运动鞋或休闲鞋']
        advice.tips = ['天气舒适，适合户外活动']
      } else if (temperature <= 30) {
        advice.level = '温暖'
        advice.outfit = ['短袖T恤', '短裤或薄长裤', '凉鞋或运动鞋']
        advice.tips = ['天气较热，注意防晒']
      } else {
        advice.level = '炎热'
        advice.outfit = ['短袖T恤', '短裤', '凉鞋', '遮阳帽']
        advice.tips = ['天气炎热，建议穿轻薄透气的衣物', '注意防暑降温']
      }

      // 根据天气状况调整
      if (isRainy) {
        advice.outfit.push('雨衣或雨伞')
        advice.tips.push('有雨，记得带雨具')
      }
      
      if (isSnowy) {
        advice.outfit.push('防滑靴')
        advice.tips.push('有雪，注意防滑')
      }
      
      if (isStormy) {
        advice.tips.push('有雷暴，建议避免户外活动')
      }

      // 根据湿度调整（高湿度时体感更冷或更热）
      if (humidity !== null && humidity > 80) {
        if (temperature < 20) {
          advice.tips.push('湿度较高，体感会更冷，建议多穿一件')
        } else if (temperature > 25) {
          advice.tips.push('湿度较高，体感会更热，注意防暑')
        }
      }

      return advice
    },

    getWeatherCodeFromOpenWeather(main, id) {
      // 将OpenWeatherMap的天气代码转换为Open-Meteo格式
      // OpenWeatherMap天气ID范围：2xx=雷暴, 3xx=毛毛雨, 5xx=雨, 6xx=雪, 7xx=大气现象, 800=晴朗, 80x=云
      if (id >= 200 && id < 300) return 95 // 雷暴
      if (id >= 300 && id < 400) return 51 // 毛毛雨
      if (id >= 500 && id < 600) {
        if (id < 520) return 61 // 小雨
        if (id < 530) return 63 // 中雨
        return 65 // 大雨
      }
      if (id >= 600 && id < 700) {
        if (id < 620) return 71 // 小雪
        if (id < 630) return 73 // 中雪
        return 75 // 大雪
      }
      if (id >= 700 && id < 800) {
        if (id === 701 || id === 741) return 45 // 雾
        return 48 // 其他大气现象
      }
      if (id === 800) return 0 // 晴朗
      if (id === 801) return 1 // 少云
      if (id === 802) return 2 // 部分多云
      return 3 // 多云或阴天
    },

    async fetchOpenWeatherMap() {
      // 使用 OpenWeatherMap API（需要API key）
      const city = encodeURIComponent(this.searchCity)
      const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric&lang=zh_cn`
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric&lang=zh_cn`

      const [currentResponse, forecastResponse] = await Promise.all([
        axios.get(currentUrl, { timeout: 10000 }),
        axios.get(forecastUrl, { timeout: 10000 })
      ])

      const current = currentResponse.data
      const forecast = forecastResponse.data

      const temp = Math.round(current.main.temp)
      const weatherCode = this.getWeatherCodeFromOpenWeather(current.weather[0].main, current.weather[0].id)
      
      this.weatherData = {
        city: current.name,
        country: current.sys.country,
        temperature: temp,
        feelsLike: Math.round(current.main.feels_like),
        description: current.weather[0].description,
        humidity: current.main.humidity,
        windSpeed: current.wind.speed,
        pressure: current.main.pressure,
        visibility: (current.visibility / 1000).toFixed(1),
        icon: `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`,
        weatherCode: weatherCode,
        clothingAdvice: this.getClothingAdvice(temp, weatherCode, current.wind.speed, current.main.humidity)
      }

      // 处理未来几天的预报
      const dailyForecast = {}
      forecast.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0]
        if (!dailyForecast[date]) {
          dailyForecast[date] = {
            date: date,
            tempMax: item.main.temp_max,
            tempMin: item.main.temp_min,
            description: item.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
          }
        } else {
          dailyForecast[date].tempMax = Math.max(dailyForecast[date].tempMax, item.main.temp_max)
          dailyForecast[date].tempMin = Math.min(dailyForecast[date].tempMin, item.main.temp_min)
        }
      })

      this.forecastData = Object.values(dailyForecast).slice(0, 5).map(day => ({
        ...day,
        tempMax: Math.round(day.tempMax),
        tempMin: Math.round(day.tempMin)
      }))
    },

    async getCurrentLocation() {
      if (!navigator.geolocation) {
        this.error = '您的浏览器不支持地理位置功能'
        return
      }

      this.loading = true
      this.error = null

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            // 使用逆地理编码获取城市名称
            const response = await axios.get(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=zh`,
              { timeout: 10000 }
            )
            const city = response.data.city || response.data.locality || '当前位置'
            this.searchCity = city
            await this.searchWeather()
          } catch (err) {
            // 如果逆地理编码失败，直接使用坐标查询天气
            this.error = '无法获取城市名称，请手动输入城市名称'
            this.loading = false
          }
        },
        () => {
          this.error = '无法获取您的位置，请允许位置权限或手动输入城市名称'
          this.loading = false
        }
      )
    },

    retry() {
      this.error = null
      if (this.searchCity) {
        this.searchWeather()
      }
    },

    getLevelClass(level) {
      // 根据温度等级返回对应的CSS类
      const levelMap = {
        '很冷': 'level-very-cold',
        '冷': 'level-cold',
        '凉爽': 'level-cool',
        '舒适': 'level-comfortable',
        '温暖': 'level-warm',
        '炎热': 'level-hot'
      }
      return levelMap[level] || 'level-comfortable'
    }
  }
}
</script>

<style scoped>
.weather-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding-bottom: 2rem;
}

.page-header {
  background: linear-gradient(135deg, #2d7a6b 0%, #2d7a6b 50%, #8b6f47 50%, #8b6f47 100%);
  color: white;
  text-align: center;
  padding: 3rem 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.page-description {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
  max-width: 700px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 搜索框样式 */
.search-container {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease;
}

.search-container:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

.search-box {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.search-input:focus {
  outline: none;
  border-color: #2d7a6b;
  box-shadow: 0 0 0 3px rgba(45, 122, 107, 0.1);
}

.search-button {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #2d7a6b 0%, #2d7a6b 50%, #8b6f47 50%, #8b6f47 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 12px rgba(45, 122, 107, 0.3);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.search-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(45, 122, 107, 0.4);
  background: linear-gradient(135deg, #1e5a4a 0%, #1e5a4a 50%, #6b5537 50%, #6b5537 100%);
}

.search-button:active {
  transform: translateY(0);
}

.location-buttons {
  display: flex;
  gap: 1rem;
}

.location-btn {
  padding: 0.75rem 1.5rem;
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #2d5a4f;
}

.location-btn:hover {
  background: linear-gradient(135deg, rgba(45, 122, 107, 0.1) 0%, rgba(139, 111, 71, 0.1) 100%);
  border-color: #2d7a6b;
  color: #2d5a4f;
}

/* 加载和错误状态 */
.loading-container,
.error-container,
.welcome-container {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2d7a6b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container p {
  color: #e74c3c;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.retry-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.retry-button:hover {
  background: linear-gradient(135deg, #1e5a4a 0%, #6b5537 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(45, 122, 107, 0.3);
}

.welcome-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.welcome-container h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.welcome-container p {
  color: #666;
}

/* 当前天气卡片 */
.current-weather-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.current-weather-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.location-info {
  flex: 1;
}

.city-name {
  font-size: 2rem;
  font-weight: 700;
  color: #2d5a4f;
  margin: 0 0 0.5rem 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.location-detail {
  color: #666;
  font-size: 1rem;
  margin: 0;
}

.weather-icon {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper {
  width: 100%;
  height: 100%;
}

.icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.icon-emoji {
  font-size: 5rem;
  line-height: 1;
}

.temperature-section {
  text-align: center;
  margin-bottom: 2rem;
}

.main-temp {
  font-size: 4rem;
  font-weight: 700;
  background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 0.5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.feels-like {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.description {
  font-size: 1.3rem;
  color: #2d5a4f;
  text-transform: capitalize;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.detail-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.detail-value {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d5a4f;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* 穿衣推荐卡片 */
.clothing-advice-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.clothing-advice-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

.advice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.advice-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d5a4f;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.advice-level {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
}

.level-very-cold {
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
}

.level-cold {
  background: linear-gradient(135deg, #5dade2 0%, #3498db 100%);
}

.level-cool {
  background: linear-gradient(135deg, #85c1e9 0%, #5dade2 100%);
}

.level-comfortable {
  background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
}

.level-warm {
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
}

.level-hot {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.advice-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.outfit-section,
.tips-section {
  flex: 1;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d5a4f;
  margin: 0 0 1rem 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.outfit-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.outfit-tag {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #dee2e6;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #495057;
  transition: all 0.3s ease;
}

.outfit-tag:hover {
  background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(45, 122, 107, 0.3);
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tip-item {
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  border-radius: 8px;
  color: #856404;
  font-size: 0.95rem;
  line-height: 1.6;
}

.tip-item:last-child {
  margin-bottom: 0;
}

/* 预报部分 */
.forecast-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease;
}

.forecast-section:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

.forecast-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d5a4f;
  margin: 0 0 1.5rem 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.forecast-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.forecast-card {
  text-align: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.forecast-card:hover {
  background: #e9ecef;
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.forecast-date {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.forecast-icon {
  width: 60px;
  height: 60px;
  margin: 0.5rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.forecast-icon-wrapper {
  width: 100%;
  height: 100%;
}

.forecast-icon-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.forecast-icon-emoji {
  font-size: 3rem;
  line-height: 1;
}

.forecast-temp {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0.5rem 0;
}

.temp-high {
  color: #2d7a6b;
}

.temp-low {
  color: #999;
}

.forecast-desc {
  font-size: 0.85rem;
  color: #666;
  text-transform: capitalize;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .page-description {
    font-size: 1rem;
  }

  .search-box {
    flex-direction: column;
  }

  .main-temp {
    font-size: 3rem;
  }

  .weather-details {
    grid-template-columns: repeat(2, 1fr);
  }

  .forecast-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .advice-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .advice-level {
    align-self: flex-start;
  }

  .outfit-tags {
    gap: 0.5rem;
  }

  .outfit-tag {
    font-size: 0.85rem;
    padding: 0.4rem 0.8rem;
  }
}

@media (max-width: 480px) {
  .weather-details {
    grid-template-columns: 1fr;
  }

  .forecast-list {
    grid-template-columns: 1fr;
  }
}
</style>
