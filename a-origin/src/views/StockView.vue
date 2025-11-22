<template>
  <div class="stock-view">
    <header class="page-header">
      <h1 class="page-title">股票市场</h1>
      <p class="page-description">实时股票行情，为您提供准确的股票市场数据</p>
    </header>

    <main class="main-content">
      <!-- 搜索框 -->
      <div class="search-container">
        <div class="search-box">
          <input
            v-model="searchSymbol"
            type="text"
            placeholder="输入股票代码，如：AAPL（苹果）、TSLA（特斯拉）、MSFT（微软）、000001（平安银行）"
            class="search-input"
            @keyup.enter="searchStock"
          />
          <button class="search-button" @click="searchStock">
            <span>搜索</span>
          </button>
        </div>
        <div class="popular-stocks">
          <span class="popular-label">热门股票：</span>
          <button
            v-for="symbol in popularStocks"
            :key="symbol"
            class="popular-btn"
            @click="selectStock(symbol)"
          >
            {{ symbol }}
          </button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>正在加载股票数据...</p>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="error-container">
        <p>{{ error }}</p>
        <button class="retry-button" @click="retry">重试</button>
      </div>

      <!-- 股票信息卡片 -->
      <div v-if="stockData && !loading" class="stock-container">
        <!-- 当前股票信息 -->
        <div class="current-stock-card">
          <div class="stock-header">
            <div class="stock-info">
              <h2 class="stock-name">{{ stockData.name }}</h2>
              <p class="stock-symbol">{{ stockData.symbol }}</p>
            </div>
            <div class="stock-price-section">
              <div class="current-price" :class="getPriceClass(stockData.changePercent)">
                {{ formatPrice(stockData.price) }}
              </div>
              <div class="price-change" :class="getPriceClass(stockData.changePercent)">
                <span v-if="stockData.change >= 0">+</span>{{ formatPrice(stockData.change) }}
                <span class="change-percent">
                  (<span v-if="stockData.changePercent >= 0">+</span>{{ stockData.changePercent.toFixed(2) }}%)
                </span>
              </div>
            </div>
          </div>

          <!-- 价格区间可视化 -->
          <div class="price-range-visualization">
            <div class="range-header">
              <span class="range-label">今日价格区间</span>
              <span class="range-values">
                <span class="range-low">{{ formatPrice(stockData.low) }}</span>
                <span class="range-separator">→</span>
                <span class="range-high">{{ formatPrice(stockData.high) }}</span>
              </span>
            </div>
            <div class="range-bar">
              <div class="range-track">
                <div 
                  class="range-fill" 
                  :style="getPriceRangeStyle()"
                  :class="getPriceClass(stockData.changePercent)"
                ></div>
                <div 
                  class="range-indicator" 
                  :style="{ left: getPricePosition() + '%' }"
                  :class="getPriceClass(stockData.changePercent)"
                >
                  <span class="indicator-dot"></span>
                  <span class="indicator-label">{{ formatPrice(stockData.price) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- OHLC 可视化 -->
          <div class="ohlc-visualization">
            <h4 class="visualization-title">价格走势 (OHLC)</h4>
            <div class="ohlc-chart">
              <div class="ohlc-bar" :class="getPriceClass(stockData.changePercent)">
                <div class="ohlc-line" :style="getOHLCLineStyle()"></div>
                <div class="ohlc-body" :style="getOHLCBodyStyle()"></div>
              </div>
              <div class="ohlc-labels">
                <div class="ohlc-label">
                  <span class="label-name">开盘</span>
                  <span class="label-value">{{ formatPrice(stockData.open) }}</span>
                </div>
                <div class="ohlc-label">
                  <span class="label-name">最高</span>
                  <span class="label-value high">{{ formatPrice(stockData.high) }}</span>
                </div>
                <div class="ohlc-label">
                  <span class="label-name">最低</span>
                  <span class="label-value low">{{ formatPrice(stockData.low) }}</span>
                </div>
                <div class="ohlc-label">
                  <span class="label-name">收盘</span>
                  <span class="label-value">{{ formatPrice(stockData.close) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 涨跌幅可视化 -->
          <div class="change-visualization">
            <h4 class="visualization-title">涨跌幅</h4>
            <div class="change-meter">
              <div class="meter-bar">
                <div 
                  class="meter-fill" 
                  :class="getPriceClass(stockData.changePercent)"
                  :style="{ width: Math.min(Math.abs(stockData.changePercent), 10) * 10 + '%' }"
                ></div>
              </div>
              <div class="meter-value" :class="getPriceClass(stockData.changePercent)">
                {{ stockData.changePercent >= 0 ? '+' : '' }}{{ stockData.changePercent.toFixed(2) }}%
              </div>
            </div>
          </div>

          <!-- 成交量可视化 -->
          <div class="volume-visualization" v-if="stockData.volume > 0">
            <h4 class="visualization-title">成交量</h4>
            <div class="volume-bar-container">
              <div class="volume-bar" :style="{ width: getVolumePercentage() + '%' }">
                <span class="volume-text">{{ formatVolume(stockData.volume) }}</span>
              </div>
            </div>
          </div>

          <div class="stock-details">
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">开盘价</span>
                <span class="detail-value">{{ formatPrice(stockData.open) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">最高价</span>
                <span class="detail-value high">{{ formatPrice(stockData.high) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">最低价</span>
                <span class="detail-value low">{{ formatPrice(stockData.low) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">收盘价</span>
                <span class="detail-value">{{ formatPrice(stockData.close) }}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">成交量</span>
                <span class="detail-value">{{ formatVolume(stockData.volume) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">市值</span>
                <span class="detail-value">{{ stockData.marketCap || 'N/A' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">更新时间</span>
                <span class="detail-value">{{ stockData.lastUpdate }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 股票图表区域 -->
        <div v-if="stockData.chartData && stockData.chartData.length > 0" class="chart-section">
          <h3 class="section-title">近期价格走势</h3>
          <div class="chart-container">
            <!-- 折线图 -->
            <div class="line-chart">
              <svg class="chart-svg" viewBox="0 0 400 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" :style="{ stopColor: stockData.changePercent >= 0 ? '#e74c3c' : '#27ae60', stopOpacity: 0.3 }" />
                    <stop offset="100%" :style="{ stopColor: stockData.changePercent >= 0 ? '#e74c3c' : '#27ae60', stopOpacity: 0 }" />
                  </linearGradient>
                </defs>
                <polyline
                  :points="getLineChartPoints()"
                  fill="url(#priceGradient)"
                  :stroke="stockData.changePercent >= 0 ? '#e74c3c' : '#27ae60'"
                  stroke-width="2"
                  class="price-line"
                />
                <polyline
                  :points="getLineChartPoints()"
                  fill="none"
                  :stroke="stockData.changePercent >= 0 ? '#e74c3c' : '#27ae60'"
                  stroke-width="2"
                  class="price-line-outline"
                />
              </svg>
              <div class="chart-price-labels">
                <span class="price-label-min">{{ formatPrice(stockData.minChartPrice) }}</span>
                <span class="price-label-max">{{ formatPrice(stockData.maxChartPrice) }}</span>
              </div>
            </div>
            <!-- 柱状图 -->
            <div class="bar-chart">
              <div class="simple-chart">
                <div
                  v-for="(point, index) in stockData.chartData"
                  :key="index"
                  class="chart-bar"
                  :style="{ height: `${(point / stockData.maxPrice) * 100}%` }"
                  :title="formatPrice(point)"
                  :class="getBarColorClass(index)"
                ></div>
              </div>
              <div class="chart-labels">
                <span v-for="(point, index) in stockData.chartData" :key="index" class="chart-label">
                  {{ index + 1 }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 默认提示 -->
      <div v-if="!stockData && !loading && !error" class="welcome-container">
        <div class="welcome-icon">📈</div>
        <h3>欢迎使用股票市场</h3>
        <p>请输入股票代码或点击热门股票来查看实时行情</p>
        <div class="help-text">
          <p><strong>提示：</strong></p>
          <ul>
            <li>美股代码：如 AAPL（苹果）、TSLA（特斯拉）</li>
            <li>A股代码：如 000001（平安银行）、600519（贵州茅台）</li>
            <li>港股代码：如 00700（腾讯控股）</li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'StockView',
  data() {
    return {
      searchSymbol: '',
      stockData: null,
      loading: false,
      error: null,
      popularStocks: ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', '000001', '600519'],
      // 使用免费的股票API
      // 注意：某些API可能有请求限制，建议注册获取API key
      apiKey: '' // 如果使用需要API key的服务，请在这里填入
    }
  },
  mounted() {
    // 默认加载苹果股票
    this.searchSymbol = 'AAPL'
    this.searchStock()
  },
  methods: {
    async searchStock() {
      if (!this.searchSymbol.trim()) {
        this.error = '请输入股票代码'
        return
      }

      this.loading = true
      this.error = null

      try {
        await this.fetchStockData()
      } catch (err) {
        const errorMsg = err.message || '获取股票数据失败'
        if (errorMsg.includes('网络') || errorMsg.includes('连接')) {
          this.error = '网络连接失败，请检查网络后重试'
        } else if (errorMsg.includes('未找到') || errorMsg.includes('不存在')) {
          this.error = '未找到该股票代码，请检查代码是否正确'
        } else {
          this.error = '获取股票数据失败，请检查股票代码或稍后重试。提示：美股代码如AAPL、TSLA，A股代码如000001、600519'
        }
        console.error('Stock API Error:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchStockData() {
      const symbol = this.searchSymbol.toUpperCase().trim()
      
      // 判断是A股还是美股
      const isAStock = /^\d{6}$/.test(symbol)
      
      if (isAStock) {
        // A股使用新浪财经API
        await this.fetchAStock(symbol)
      } else {
        // 美股使用Yahoo Finance API（通过代理）
        await this.fetchUSStock(symbol)
      }
    },

    async fetchAStock(symbol) {
      // 使用新浪财经API获取A股数据
      const url = `https://hq.sinajs.cn/list=${symbol.startsWith('6') ? 'sh' : 'sz'}${symbol}`
      
      try {
        const response = await axios.get(url, {
          timeout: 10000,
          responseType: 'text',
          headers: {
            'Referer': 'https://finance.sina.com.cn'
          }
        })

        // 解析新浪财经数据格式
        const data = response.data.match(/="([^"]+)"/)
        if (!data || !data[1]) {
          throw new Error('数据格式错误')
        }

        const fields = data[1].split(',')
        if (fields.length < 32) {
          throw new Error('数据不完整')
        }

        const name = fields[0]
        const open = parseFloat(fields[1])
        const yesterdayClose = parseFloat(fields[2])
        const currentPrice = parseFloat(fields[3])
        const high = parseFloat(fields[4])
        const low = parseFloat(fields[5])
        const volume = parseFloat(fields[8])
        const amount = parseFloat(fields[9])
        const date = fields[30]
        const time = fields[31]

        const change = currentPrice - yesterdayClose
        const changePercent = (change / yesterdayClose) * 100

        this.stockData = {
          symbol: symbol,
          name: name,
          price: currentPrice,
          open: open,
          high: high,
          low: low,
          close: currentPrice,
          volume: volume,
          change: change,
          changePercent: changePercent,
          amount: amount,
          lastUpdate: `${date} ${time}`,
          marketCap: 'N/A' // A股API不提供市值数据
        }

        // 生成图表数据（使用最近的价格点）
        const pricePoints = [yesterdayClose, open, low, high, currentPrice]
        this.generateChartData(pricePoints)
      } catch (err) {
        throw new Error('获取A股数据失败：' + err.message)
      }
    },

    async fetchUSStock(symbol) {
      // 使用多个备用API，提高成功率
      // 方案1：使用CORS代理访问Yahoo Finance
      // 方案2：使用Alpha Vantage（需要API key）
      // 方案3：使用其他免费股票API
      
      const proxies = [
        // 使用CORS代理
        `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`)}`,
        // 备用：直接访问（可能失败）
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`
      ]
      
      for (const url of proxies) {
        try {
          const response = await axios.get(url, {
            timeout: 15000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'application/json'
            }
          })

          // 处理代理返回的数据格式
          let data = response.data
          if (typeof data === 'string') {
            try {
              data = JSON.parse(data)
            } catch (e) {
              continue // 尝试下一个代理
            }
          }

          const result = data.chart?.result?.[0]
          if (!result) {
            continue // 尝试下一个代理
          }

          const meta = result.meta
          const quote = result.indicators?.quote?.[0]
          
          if (!meta) {
            continue
          }

          const currentPrice = meta.regularMarketPrice || meta.previousClose
          const previousClose = meta.previousClose || currentPrice
          const open = meta.regularMarketOpen || (quote?.open?.[quote.open.length - 1]) || currentPrice
          const high = meta.regularMarketDayHigh || (quote?.high ? Math.max(...quote.high.filter(v => v)) : currentPrice)
          const low = meta.regularMarketDayLow || (quote?.low ? Math.min(...quote.low.filter(v => v)) : currentPrice)
          const volume = meta.regularMarketVolume || (quote?.volume?.[quote.volume.length - 1]) || 0

          const change = currentPrice - previousClose
          const changePercent = previousClose ? (change / previousClose) * 100 : 0

          this.stockData = {
            symbol: symbol,
            name: meta.longName || meta.shortName || symbol,
            price: currentPrice,
            open: open,
            high: high,
            low: low,
            close: currentPrice,
            volume: volume,
            change: change,
            changePercent: changePercent,
            marketCap: meta.marketCap ? this.formatMarketCap(meta.marketCap) : 'N/A',
            lastUpdate: meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toLocaleString('zh-CN') : new Date().toLocaleString('zh-CN')
          }

          // 生成图表数据
          if (quote?.close && quote.close.length > 0) {
            const validPrices = quote.close.filter(p => p && p > 0)
            if (validPrices.length > 0) {
              this.generateChartData(validPrices.slice(-10))
            }
          }
          
          return // 成功获取数据，退出循环
        } catch (err) {
          // 继续尝试下一个代理
          continue
        }
      }

      // 所有代理都失败，抛出错误
      throw new Error('无法获取股票数据，请检查网络连接或稍后重试')
    },

    generateChartData(prices) {
      if (!prices || prices.length === 0) return
      
      const maxPrice = Math.max(...prices)
      const minPrice = Math.min(...prices)
      const range = maxPrice - minPrice || 1
      
      // 归一化价格数据用于显示
      this.stockData.chartData = prices.map(price => ((price - minPrice) / range) * maxPrice)
      this.stockData.maxPrice = maxPrice
      this.stockData.minChartPrice = minPrice
      this.stockData.maxChartPrice = maxPrice
      this.stockData.rawPrices = prices // 保存原始价格用于折线图
    },

    getPriceRangeStyle() {
      const { low, high, price } = this.stockData
      const range = high - low || 1
      const position = ((price - low) / range) * 100
      return {
        width: `${position}%`
      }
    },

    getPricePosition() {
      const { low, high, price } = this.stockData
      const range = high - low || 1
      return ((price - low) / range) * 100
    },

    getOHLCLineStyle() {
      const { low, high, open, close } = this.stockData
      const range = high - low || 1
      const top = ((high - Math.max(open, close)) / range) * 100
      const bottom = ((Math.min(open, close) - low) / range) * 100
      return {
        top: `${top}%`,
        height: `${100 - top - bottom}%`
      }
    },

    getOHLCBodyStyle() {
      const { low, high, open, close } = this.stockData
      const range = high - low || 1
      const top = ((high - Math.max(open, close)) / range) * 100
      const height = (Math.abs(close - open) / range) * 100
      return {
        top: `${top}%`,
        height: `${height}%`
      }
    },

    getVolumePercentage() {
      // 假设最大成交量为当前成交量的2倍（用于可视化）
      const maxVolume = this.stockData.volume * 2 || 1
      return Math.min((this.stockData.volume / maxVolume) * 100, 100)
    },

    getLineChartPoints() {
      if (!this.stockData.rawPrices || this.stockData.rawPrices.length === 0) return ''
      const prices = this.stockData.rawPrices
      const maxPrice = Math.max(...prices)
      const minPrice = Math.min(...prices)
      const range = maxPrice - minPrice || 1
      const width = 400
      const height = 200
      const stepX = width / (prices.length - 1)
      
      return prices.map((price, index) => {
        const x = index * stepX
        const y = height - ((price - minPrice) / range) * height
        return `${x},${y}`
      }).join(' ')
    },

    getBarColorClass(index) {
      if (!this.stockData.rawPrices || index === 0) return ''
      const currentPrice = this.stockData.rawPrices[index]
      const previousPrice = this.stockData.rawPrices[index - 1]
      return currentPrice >= previousPrice ? 'bar-up' : 'bar-down'
    },

    selectStock(symbol) {
      this.searchSymbol = symbol
      this.searchStock()
    },

    formatPrice(price) {
      if (price === null || price === undefined || isNaN(price)) return 'N/A'
      return price.toFixed(2)
    },

    formatVolume(volume) {
      if (!volume || isNaN(volume)) return 'N/A'
      if (volume >= 1000000000) {
        return (volume / 1000000000).toFixed(2) + 'B'
      } else if (volume >= 1000000) {
        return (volume / 1000000).toFixed(2) + 'M'
      } else if (volume >= 1000) {
        return (volume / 1000).toFixed(2) + 'K'
      }
      return volume.toString()
    },

    formatMarketCap(marketCap) {
      if (!marketCap || marketCap === 'N/A') return 'N/A'
      if (typeof marketCap === 'number') {
        if (marketCap >= 1000000000000) {
          return (marketCap / 1000000000000).toFixed(2) + 'T'
        } else if (marketCap >= 1000000000) {
          return (marketCap / 1000000000).toFixed(2) + 'B'
        } else if (marketCap >= 1000000) {
          return (marketCap / 1000000).toFixed(2) + 'M'
        }
      }
      return marketCap.toString()
    },

    getPriceClass(changePercent) {
      if (changePercent > 0) return 'price-up'
      if (changePercent < 0) return 'price-down'
      return 'price-neutral'
    },

    retry() {
      this.error = null
      if (this.searchSymbol) {
        this.searchStock()
      }
    }
  }
}
</script>

<style scoped>
.stock-view {
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

.popular-stocks {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.popular-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.popular-btn {
  padding: 0.5rem 1rem;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #2d5a4f;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.popular-btn:hover {
  background: linear-gradient(135deg, rgba(45, 122, 107, 0.1) 0%, rgba(139, 111, 71, 0.1) 100%);
  border-color: #2d7a6b;
  transform: translateY(-2px);
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
  color: #2d5a4f;
  margin-bottom: 0.5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.welcome-container p {
  color: #666;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.help-text {
  margin-top: 2rem;
  text-align: left;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.help-text p {
  color: #2d5a4f;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.help-text ul {
  color: #666;
  line-height: 1.8;
}

/* 股票信息卡片 */
.current-stock-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.current-stock-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

.stock-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.stock-info {
  flex: 1;
}

.stock-name {
  font-size: 2rem;
  font-weight: 700;
  color: #2d5a4f;
  margin: 0 0 0.5rem 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.stock-symbol {
  font-size: 1.2rem;
  color: #666;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.stock-price-section {
  text-align: right;
}

.current-price {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.price-up {
  color: #e74c3c;
}

.price-down {
  color: #27ae60;
}

.price-neutral {
  color: #2d5a4f;
}

.price-change {
  font-size: 1.3rem;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.change-percent {
  font-size: 1rem;
  margin-left: 0.5rem;
}

.stock-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.detail-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d5a4f;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.detail-value.high {
  color: #e74c3c;
}

.detail-value.low {
  color: #27ae60;
}

/* 价格区间可视化 */
.price-range-visualization {
  margin: 2rem 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
}

.range-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.range-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
}

.range-values {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.range-low {
  color: #27ae60;
  font-weight: 600;
}

.range-high {
  color: #e74c3c;
  font-weight: 600;
}

.range-separator {
  color: #999;
}

.range-bar {
  position: relative;
  height: 40px;
}

.range-track {
  position: relative;
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.range-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 4px;
  opacity: 0.3;
  transition: width 0.5s ease;
}

.range-fill.price-up {
  background: linear-gradient(90deg, #e74c3c 0%, #c0392b 100%);
}

.range-fill.price-down {
  background: linear-gradient(90deg, #27ae60 0%, #229954 100%);
}

.range-indicator {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: left 0.5s ease;
}

.indicator-dot {
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.range-indicator.price-up .indicator-dot {
  background: #e74c3c;
}

.range-indicator.price-down .indicator-dot {
  background: #27ae60;
}

.indicator-label {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  background: white;
  padding: 2px 6px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* OHLC 可视化 */
.ohlc-visualization {
  margin: 2rem 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
}

.visualization-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2d5a4f;
  margin: 0 0 1rem 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.ohlc-chart {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ohlc-bar {
  position: relative;
  height: 120px;
  background: white;
  border-radius: 8px;
  padding: 1rem;
}

.ohlc-line {
  position: absolute;
  left: 50%;
  width: 2px;
  background: currentColor;
  opacity: 0.6;
}

.ohlc-body {
  position: absolute;
  left: calc(50% - 20px);
  width: 40px;
  background: currentColor;
  border-radius: 4px;
}

.ohlc-bar.price-up {
  color: #e74c3c;
}

.ohlc-bar.price-down {
  color: #27ae60;
}

.ohlc-labels {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.ohlc-label {
  text-align: center;
  padding: 0.5rem;
  background: white;
  border-radius: 6px;
}

.label-name {
  display: block;
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.label-value {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d5a4f;
}

.label-value.high {
  color: #e74c3c;
}

.label-value.low {
  color: #27ae60;
}

/* 涨跌幅可视化 */
.change-visualization {
  margin: 2rem 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
}

.change-meter {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.meter-bar {
  flex: 1;
  height: 24px;
  background: #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.meter-fill {
  height: 100%;
  border-radius: 12px;
  transition: width 0.5s ease;
  position: relative;
}

.meter-fill.price-up {
  background: linear-gradient(90deg, #e74c3c 0%, #c0392b 100%);
}

.meter-fill.price-down {
  background: linear-gradient(90deg, #27ae60 0%, #229954 100%);
}

.meter-value {
  font-size: 1.1rem;
  font-weight: 700;
  min-width: 80px;
  text-align: right;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* 成交量可视化 */
.volume-visualization {
  margin: 2rem 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
}

.volume-bar-container {
  position: relative;
  height: 40px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.volume-bar {
  height: 100%;
  background: linear-gradient(90deg, #2d7a6b 0%, #8b6f47 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 1rem;
  transition: width 0.5s ease;
  min-width: 100px;
}

.volume-text {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

/* 图表部分 */
.chart-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d5a4f;
  margin: 0 0 1.5rem 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* 折线图 */
.line-chart {
  position: relative;
  height: 250px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 1rem;
  overflow: hidden;
}

.chart-svg {
  width: 100%;
  height: 100%;
}

.price-line {
  transition: all 0.3s ease;
}

.price-line-outline {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.chart-price-labels {
  position: absolute;
  right: 1rem;
  top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #666;
}

.price-label-min {
  color: #27ae60;
}

.price-label-max {
  color: #e74c3c;
}

/* 柱状图 */
.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.simple-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 200px;
  gap: 4px;
  padding: 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(135deg, #2d7a6b 0%, #8b6f47 100%);
  border-radius: 4px 4px 0 0;
  min-height: 4px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.chart-bar:hover {
  opacity: 0.8;
  transform: scaleY(1.05);
}

.chart-bar.bar-up {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.chart-bar.bar-down {
  background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
}

.chart-labels {
  display: flex;
  justify-content: space-around;
  gap: 4px;
}

.chart-label {
  flex: 1;
  text-align: center;
  font-size: 0.75rem;
  color: #666;
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

  .current-price {
    font-size: 2.5rem;
  }

  .stock-header {
    flex-direction: column;
    gap: 1rem;
  }

  .stock-price-section {
    text-align: left;
  }

  .detail-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .price-range-visualization,
  .ohlc-visualization,
  .change-visualization,
  .volume-visualization {
    padding: 1rem;
  }

  .ohlc-labels {
    grid-template-columns: repeat(2, 1fr);
  }

  .change-meter {
    flex-direction: column;
    align-items: stretch;
  }

  .meter-value {
    text-align: center;
  }

  .line-chart {
    height: 200px;
  }

  .chart-container {
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .detail-row {
    grid-template-columns: 1fr;
  }

  .popular-stocks {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

