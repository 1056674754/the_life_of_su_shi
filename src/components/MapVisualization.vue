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
        '湖北黄州': {
          description: '位于长江中游北岸，今湖北黄冈市，是苏轼被贬的重要地点',
          cultural: '黄州是楚文化的重要区域，苏轼在此留下了大量传世名作，如《赤壁赋》《念奴娇·赤壁怀古》等。'
        },
        '广东惠州': {
          description: '位于珠江三角洲东岸，是苏轼晚年被贬的岭南地区',
          cultural: '惠州是岭南文化的重要城市，苏轼在此推广农业技术，深受百姓爱戴，留下了丰富的文化遗产。'
        },
        '海南儋州': {
          description: '位于海南岛西北部，是苏轼被贬的最远地区',
          cultural: '儋州是海南文化的重要发源地，苏轼在此开办学堂，传播中原文化，对海南文化发展产生了深远影响。'
        },
        '江苏常州': {
          description: '位于长江三角洲地区，是苏轼北归途中逝世的地方',
          cultural: '常州是江南文化的重要城市，素有"中吴要辅"之称，苏轼多次在此停留，与常州有着深厚的文化渊源。'
        },
        '浙江杭州': {
          description: '位于长江三角洲南翼，是苏轼两次任职的重要城市',
          cultural: '杭州是江南文化的代表城市，苏轼在此疏浚西湖，修筑苏堤，留下了丰富的文化遗产和美丽传说。'
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
        const x = (location.value[0] - 70) * canvas.width / 50
        const y = (55 - location.value[1]) * canvas.height / 30

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
        const fromX = (path.coords[0][0] - 70) * canvas.width / 50
        const fromY = (55 - path.coords[0][1]) * canvas.height / 30
        const toX = (path.coords[1][0] - 70) * canvas.width / 50
        const toY = (55 - path.coords[1][1]) * canvas.height / 30

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
          left: 'center',
          textStyle: {
            color: '#3a2618',
            fontSize: 18,
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
          zoom: 1.2,
          center: [104, 35],
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
        { name: '四川眉山', coords: [103.8, 30.0], period: '出生', cuisine: '眉州东坡泡菜', poetry: '和子由渑池怀旧' },
        { name: '湖北黄州', coords: [114.9, 30.5], period: '贬谪', cuisine: '东坡羹', poetry: '定风波' },
        { name: '浙江杭州', coords: [120.2, 30.3], period: '仕宦', cuisine: '东坡肉', poetry: '饮湖上初晴后雨' },
        { name: '广东惠州', coords: [114.4, 23.1], period: '再贬', cuisine: '东坡豆腐', poetry: '题西林壁' },
        { name: '海南儋州', coords: [109.5, 19.5], period: '远贬', cuisine: '东坡饼', poetry: '六月二十日夜渡海' },
        { name: '江苏常州', coords: [119.9, 31.8], period: '逝世', cuisine: '东坡肘子', poetry: '自题金山画像' }
      ]

      return locations.map(item => ({
        name: item.name,
        value: item.coords,
        period: item.period,
        cuisine: item.cuisine,
        poetry: item.poetry,
        isCurrent: item.name === this.location
      }))
    },

    getTrajectoryData() {
      const trajectory = [
        { fromName: '四川眉山', toName: '浙江杭州', coords: [[103.8, 30.0], [120.2, 30.3]] },
        { fromName: '浙江杭州', toName: '湖北黄州', coords: [[120.2, 30.3], [114.9, 30.5]] },
        { fromName: '湖北黄州', toName: '浙江杭州', coords: [[114.9, 30.5], [120.2, 30.3]] },
        { fromName: '浙江杭州', toName: '广东惠州', coords: [[120.2, 30.3], [114.4, 23.1]] },
        { fromName: '广东惠州', toName: '海南儋州', coords: [[114.4, 23.1], [109.5, 19.5]] },
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
  gap: 2rem;
  min-height: 400px;
  max-height: 500px;
}

.map-chart {
  flex: 1;
  height: 400px;
  background: var(--cream);
  border-radius: 12px;
  box-shadow: 0 4px 16px var(--shadow);
  overflow: hidden;
}

.map-info {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-card {
  background: var(--cream);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px var(--shadow);
  flex: 1;
}

.info-title {
  color: var(--primary-ochre);
  font-size: 1.2rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid var(--light-ochre);
  padding-bottom: 0.5rem;
}

.info-content {
  color: var(--text-dark);
  line-height: 1.6;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .map-wrapper {
    flex-direction: column;
    height: auto;
  }

  .map-chart {
    height: 300px;
  }

  .map-info {
    width: 100%;
  }

  .info-card {
    padding: 1rem;
  }

  .info-title {
    font-size: 1.1rem;
  }

  .info-content {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .map-chart {
    height: 250px;
  }

  .map-title {
    font-size: 1.3rem;
  }

  .map-subtitle {
    font-size: 0.9rem;
  }
}
</style>