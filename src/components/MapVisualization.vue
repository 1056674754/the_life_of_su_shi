<template>
  <div class="map-container">
    <div class="map-header">
      <h3 class="map-title heading-font">{{ location }} - 地域分布</h3>
      <p class="map-subtitle body-font">苏轼在此时期的活动轨迹</p>
    </div>

    <div class="map-wrapper">
      <div ref="mapChart" class="map-chart"></div>
      <div class="map-info">
        <div class="info-card">
          <h4 class="info-title body-font">地理位置</h4>
          <p class="info-content body-font">{{ getLocationInfo(location) }}</p>
        </div>

        <div class="info-card">
          <h4 class="info-title body-font">文化背景</h4>
          <p class="info-content body-font">{{ getCulturalBackground(location) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts/lib/chart/map'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/chart/lines'
import 'echarts/lib/component/geo'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import chinaMapData from '../data/china.json'

export default {
  name: 'MapVisualization',
  props: {
    location: {
      type: String,
      required: true
    },
    coordinates: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chartInstance: null,
      locationData: {
        '四川眉山': {
          description: '位于四川盆地西南部，是苏轼的故乡',
          cultural: '眉山是巴蜀文化的重要发源地，素有"千载诗书城"之美誉，孕育了苏洵、苏轼、苏辙三父子。'
        },
        '陕西凤翔': {
          description: '位于关中平原西部，苏轼首次出仕的地方',
          cultural: '凤翔是周秦文化的发源地，苏轼在此任凤翔府判官，开始了他的仕途生涯。'
        },
        '浙江杭州': {
          description: '位于长江三角洲南翼，是苏轼两次任职的重要城市',
          cultural: '杭州是江南文化的代表城市，苏轼在此疏浚西湖，修筑苏堤，留下了丰富的文化遗产和美丽传说。'
        },
        '山东密州': {
          description: '位于山东半岛中部，苏轼任密州知州',
          cultural: '密州是齐鲁文化的重要区域，苏轼在此创作了《江城子·密州出猎》等名篇。'
        },
        '江苏徐州': {
          description: '位于苏北平原，苏轼任徐州知州',
          cultural: '徐州是汉文化的重要发源地，苏轼在此治理水患，关心民生，深受百姓爱戴。'
        },
        '湖北黄州': {
          description: '位于长江中游北岸，今湖北黄冈市，是苏轼被贬的重要地点',
          cultural: '黄州是楚文化的重要区域，苏轼在此留下了大量传世名作，如《赤壁赋》《念奴娇·赤壁怀古》等。'
        },
        '江苏常州': {
          description: '位于长江三角洲地区，是苏轼北归途中逝世的地方',
          cultural: '常州是江南文化的重要城市，素有"中吴要辅"之称，苏轼多次在此停留，与常州有着深厚的文化渊源。'
        },
        '山东登州': {
          description: '位于山东半岛最东端，苏轼任登州知州',
          cultural: '登州是古代海上丝绸之路的重要港口，苏轼在此虽任职仅五日，但留下了深刻印象。'
        },
        '安徽颍州': {
          description: '位于淮河流域，苏轼任颍州知州',
          cultural: '颍州是淮河文化的重要区域，苏轼在此治理水患，关心民生，体现了他的政治才能。'
        },
        '江苏扬州': {
          description: '位于长江与京杭大运河交汇处，苏轼任扬州知州',
          cultural: '扬州是江南文化的重镇，苏轼在此继续推行惠民政策，深受百姓爱戴。'
        },
        '广东惠州': {
          description: '位于珠江三角洲东岸，是苏轼晚年被贬的岭南地区',
          cultural: '惠州是岭南文化的重要城市，苏轼在此推广农业技术，深受百姓爱戴，留下了丰富的文化遗产。'
        },
        '海南儋州': {
          description: '位于海南岛西北部，是苏轼被贬的最远地区',
          cultural: '儋州是海南文化的重要发源地，苏轼在此开办学堂，传播中原文化，对海南文化发展产生了深远影响。'
        }
      }
    }
  },
  mounted() {
    // 延迟加载图表，确保DOM完全渲染
    this.$nextTick(() => {
      this.initChart()
    })
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
    if (this.chartInstance) {
      this.chartInstance.dispose()
      this.chartInstance = null
    }
  },
  watch: {
    location() {
      this.updateChart()
    },
    coordinates() {
      this.updateChart()
    }
  },
  methods: {
    initChart() {
      if (!this.$refs.mapChart) return

      try {
        this.chartInstance = echarts.init(this.$refs.mapChart)
        this.updateChart()
      } catch (error) {
        console.warn('地图初始化失败，使用简化模式', error)
        this.showSimpleMap()
      }
    },

    showSimpleMap() {
      // 简化地图模式，当ECharts地图不可用时使用
      const canvas = document.createElement('canvas')
      canvas.width = this.$refs.mapChart.offsetWidth
      canvas.height = this.$refs.mapChart.offsetHeight
      this.$refs.mapChart.appendChild(canvas)

      const ctx = canvas.getContext('2d')

      // 绘制简化的中国地图轮廓
      ctx.fillStyle = '#e8dcc0'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 绘制主要地点
      const locations = this.getMapData()
      locations.forEach(location => {
        const x = (location.value[0] - 100) * canvas.width / 30
        const y = (40 - location.value[1]) * canvas.height / 20

        ctx.fillStyle = location.isCurrent ? '#c44d34' : '#8b4513'
        ctx.beginPath()
        ctx.arc(x, y, location.isCurrent ? 12 : 8, 0, 2 * Math.PI)
        ctx.fill()

        // 添加城市名称
        ctx.fillStyle = '#3a2618'
        ctx.font = '12px Noto Serif SC'
        ctx.textAlign = 'center'
        ctx.fillText(location.name, x, y - 15)
      })

      // 绘制连线
      ctx.strokeStyle = '#8b4513'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])

      const trajectory = this.getTrajectoryData()
      trajectory.forEach(path => {
        ctx.beginPath()
        const fromX = (path.coords[0][0] - 100) * canvas.width / 30
        const fromY = (40 - path.coords[0][1]) * canvas.height / 20
        const toX = (path.coords[1][0] - 100) * canvas.width / 30
        const toY = (40 - path.coords[1][1]) * canvas.height / 20

        ctx.moveTo(fromX, fromY)
        ctx.lineTo(toX, toY)
        ctx.stroke()
      })
    },

    updateChart() {
      if (!this.chartInstance) return

      // 注册简化的中国地图数据
      this.registerChinaMap()

      const option = {
        title: {
          text: '苏轼人生轨迹地图',
          left: 'right',
          top: 10,
          textStyle: {
            color: '#3a2618',
            fontSize: 16,
            fontFamily: 'Noto Serif SC'
          }
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: '#faf8f5',
          borderColor: '#8b4513',
          borderWidth: 1,
          textStyle: {
            color: '#3a2618',
            fontFamily: 'Noto Serif SC'
          },
          formatter: (params) => {
            if (params.seriesType === 'scatter') {
              return `<div style="padding: 10px;">
                <div style="font-weight: bold; margin-bottom: 5px;">${params.name}</div>
                <div style="margin-bottom: 3px;">时期：${params.data.period}</div>
                <div style="margin-bottom: 3px;">美食：${params.data.cuisine}</div>
                <div>代表诗词：${params.data.poetry}</div>
              </div>`
            }
            return params.name
          }
        },
        geo: {
          map: 'china',
          roam: true,
          zoom: 2.2,
          center: [110, 29],
          itemStyle: {
            areaColor: '#f5f5f5',
            borderColor: '#ddd',
            borderWidth: 1
          },
          emphasis: {
            itemStyle: {
              areaColor: '#e8dcc0'
            }
          }
        },
        series: [
          {
            name: '苏轼人生轨迹',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: this.getMapData(),
            symbolSize: (val, params) => {
              return params.data.isCurrent ? 25 : 15
            },
            itemStyle: {
              color: (params) => {
                return params.data.isCurrent ? '#c44d34' : '#8b4513'
              },
              shadowBlur: 10,
              shadowColor: 'rgba(139, 69, 19, 0.3)'
            },
            emphasis: {
              itemStyle: {
                color: '#c44d34',
                shadowBlur: 20,
                shadowColor: 'rgba(196, 77, 52, 0.5)'
              }
            }
          },
          {
            name: '轨迹线',
            type: 'lines',
            coordinateSystem: 'geo',
            data: this.getTrajectoryData(),
            lineStyle: {
              color: '#8b4513',
              width: 2,
              opacity: 0.6,
              curveness: 0.2
            },
            effect: {
              show: true,
              period: 4,
              color: '#c44d34',
              symbol: 'circle',
              symbolSize: 3,
              trailLength: 0.2
            }
          }
        ]
      }

      this.chartInstance.setOption(option)
    },

    registerChinaMap() {
      // 注册中国地图数据
      echarts.registerMap('china', chinaMapData)
    },

    getMapData() {
      const locations = [
        // 出生地
        { name: '四川眉山', coords: [103.8, 30.0], period: '出生', cuisine: '眉州东坡泡菜', poetry: '和子由渑池怀旧' },
        
        // 仕途初期 (1061-1079年)
        { name: '陕西凤翔', coords: [107.2, 34.3], period: '仕途初期', cuisine: '凤翔羊肉', poetry: '凤翔八观' },
        { name: '浙江杭州', coords: [120.2, 30.3], period: '仕途初期', cuisine: '东坡肉', poetry: '饮湖上初晴后雨' },
        { name: '山东密州', coords: [119.4, 36.1], period: '仕途初期', cuisine: '密州烧饼', poetry: '江城子·密州出猎' },
        { name: '江苏徐州', coords: [117.2, 34.3], period: '仕途初期', cuisine: '徐州羊肉', poetry: '徐州诗' },
        
        // 贬谪黄州 (1079-1084年)
        { name: '湖北黄州', coords: [114.9, 30.5], period: '贬谪', cuisine: '东坡羹', poetry: '定风波' },
        
        // 复起与再仕 (1084-1094年)
        { name: '江苏常州', coords: [119.9, 31.8], period: '复起与再仕', cuisine: '常州豆腐', poetry: '常州诗' },
        { name: '山东登州', coords: [120.7, 37.8], period: '复起与再仕', cuisine: '登州海鲜', poetry: '登州诗' },
        { name: '安徽颍州', coords: [115.8, 32.9], period: '复起与再仕', cuisine: '颍州面食', poetry: '颍州诗' },
        { name: '江苏扬州', coords: [119.4, 32.4], period: '复起与再仕', cuisine: '扬州炒饭', poetry: '扬州诗' },
        
        // 再贬惠州儋州 (1094-1100年)
        { name: '广东惠州', coords: [114.4, 23.1], period: '再贬', cuisine: '东坡豆腐', poetry: '题西林壁' },
        { name: '海南儋州', coords: [109.5, 19.5], period: '远贬', cuisine: '东坡饼', poetry: '六月二十日夜渡海' },
        
        // 北归逝世 (1101年)
        { name: '江苏常州', coords: [119.9, 31.8], period: '逝世', cuisine: '东坡肘子', poetry: '自题金山画像' }
      ]

      return locations.map(item => ({
        name: item.name,
        value: item.coords,
        period: item.period,
        cuisine: item.cuisine,
        poetry: item.poetry,
        isCurrent: this.isLocationInCurrentPeriod(item.name, item.period)
      }))
    },

    getTrajectoryData() {
      const trajectory = [
        // 从眉山到凤翔
        { fromName: '四川眉山', toName: '陕西凤翔', coords: [[103.8, 30.0], [107.2, 34.3]] },
        // 从凤翔到杭州
        { fromName: '陕西凤翔', toName: '浙江杭州', coords: [[107.2, 34.3], [120.2, 30.3]] },
        // 从杭州到密州
        { fromName: '浙江杭州', toName: '山东密州', coords: [[120.2, 30.3], [119.4, 36.1]] },
        // 从密州到徐州
        { fromName: '山东密州', toName: '江苏徐州', coords: [[119.4, 36.1], [117.2, 34.3]] },
        // 从徐州到黄州
        { fromName: '江苏徐州', toName: '湖北黄州', coords: [[117.2, 34.3], [114.9, 30.5]] },
        // 从黄州到常州
        { fromName: '湖北黄州', toName: '江苏常州', coords: [[114.9, 30.5], [119.9, 31.8]] },
        // 从常州到登州
        { fromName: '江苏常州', toName: '山东登州', coords: [[119.9, 31.8], [120.7, 37.8]] },
        // 从登州到颍州
        { fromName: '山东登州', toName: '安徽颍州', coords: [[120.7, 37.8], [115.8, 32.9]] },
        // 从颍州到扬州
        { fromName: '安徽颍州', toName: '江苏扬州', coords: [[115.8, 32.9], [119.4, 32.4]] },
        // 从扬州到惠州
        { fromName: '江苏扬州', toName: '广东惠州', coords: [[119.4, 32.4], [114.4, 23.1]] },
        // 从惠州到儋州
        { fromName: '广东惠州', toName: '海南儋州', coords: [[114.4, 23.1], [109.5, 19.5]] },
        // 从儋州北归到常州
        { fromName: '海南儋州', toName: '江苏常州', coords: [[109.5, 19.5], [119.9, 31.8]] }
      ]

      return trajectory.map(item => ({
        fromName: item.fromName,
        toName: item.toName,
        coords: item.coords
      }))
    },

    getLocationInfo(location) {
      return this.locationData[location]?.description || '暂无详细信息'
    },

    getCulturalBackground(location) {
      return this.locationData[location]?.cultural || '暂无文化背景信息'
    },

    isLocationInCurrentPeriod(cityName, cityPeriod) {
      // 如果location是单个城市名，直接匹配
      if (this.location === cityName) {
        return true
      }
      
      // 如果location包含多个城市（用逗号分隔），检查是否包含当前城市
      if (this.location && this.location.includes(',')) {
        const cities = this.location.split('、').map(city => city.trim())
        return cities.includes(cityName)
      }
      
      // 根据时间段匹配
      const periodMapping = {
        '四川眉山': ['出生'],
        '凤翔、杭州、密州、徐州': ['仕途初期'],
        '湖北黄州': ['贬谪'],
        '常州、登州、杭州、颍州、扬州': ['复起与再仕'],
        '广东惠州、海南儋州': ['再贬', '远贬'],
        '江苏常州': ['逝世']
      }
      
      // 检查当前location对应的时间段
      for (const [locationKey, periods] of Object.entries(periodMapping)) {
        if (this.location === locationKey && periods.includes(cityPeriod)) {
          return true
        }
      }
      
      return false
    },

    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize()
      }
    }
  }
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}

.map-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.map-title {
  color: var(--primary-ochre);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.map-subtitle {
  color: var(--text-medium);
  font-size: 1rem;
}

.map-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  min-height: 350px;
  height: 100%;
}

.map-chart {
  height: 280px;
  background: var(--cream);
  border-radius: 12px;
  box-shadow: 0 4px 16px var(--shadow);
  overflow: hidden;
}

.map-info {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 0.8rem;
  flex-shrink: 0;
}

.info-card {
  background: var(--cream);
  padding: 0.8rem;
  border-radius: 10px;
  box-shadow: 0 4px 16px var(--shadow);
  flex: 1;
}

.info-title {
  color: var(--primary-ochre);
  font-size: 1rem;
  margin-bottom: 0.6rem;
  border-bottom: 2px solid var(--light-ochre);
  padding-bottom: 0.3rem;
}

.info-content {
  color: var(--text-dark);
  line-height: 1.5;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .map-wrapper {
    gap: 0.8rem;
  }

  .map-chart {
    height: 240px;
  }

  .map-info {
    flex-direction: column;
    gap: 0.6rem;
  }

  .info-card {
    padding: 0.8rem;
  }

  .info-title {
    font-size: 0.9rem;
  }

  .info-content {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .map-chart {
    height: 200px;
  }

  .info-card {
    padding: 0.8rem;
  }

  .map-title {
    font-size: 1.1rem;
  }

  .map-subtitle {
    font-size: 0.8rem;
  }

  .info-title {
    font-size: 0.85rem;
  }

  .info-content {
    font-size: 0.75rem;
  }
}
</style>