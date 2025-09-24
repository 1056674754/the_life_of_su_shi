<template>
  <div class="timeline-container">
    <div class="timeline-wrapper">
      <!-- 只显示当前选中的内容 -->
      <div class="current-period-display" v-if="selectedPeriod">
        <div class="period-info">
          <div class="period-year poetry-font">{{ selectedPeriod.year }}</div>
          <div class="period-details">
            <h3 class="period-title heading-font">{{ selectedPeriod.period }}</h3>
            <p class="period-location body-font">{{ selectedPeriod.location }}</p>
          </div>
        </div>
        
        <!-- 进度指示器 -->
        <div class="progress-indicator">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>
          <div class="progress-text body-font">
            {{ selectedIndex + 1 }} / {{ lifeData.length }}
          </div>
        </div>
      </div>

      <!-- 如果没有选中任何时期，显示默认内容 -->
      <div class="default-display" v-else>
        <div class="default-content">
          <h3 class="default-title heading-font">选择时期</h3>
          <p class="default-subtitle body-font">点击下方按钮或时间轴开始探索</p>
        </div>
      </div>
    </div>
  </div>

  <!-- 独立的绝对定位左侧操作区域 -->
  <div class="timeline-controls-absolute">
    <button
      class="control-btn-vertical body-font"
      @click="previousPeriod"
      :disabled="!canGoPrevious"
    >
      ↑
    </button>

    <div class="dots-indicator">
      <div
        v-for="(item, index) in lifeData"
        :key="index"
        class="dot"
        :class="{ 'active': index === selectedIndex }"
        @click="selectPeriod(item)"
      ></div>
    </div>

    <button
      class="control-btn-vertical body-font"
      @click="nextPeriod"
      :disabled="!canGoNext"
    >
      ↓
    </button>
  </div>
</template>

<script>
export default {
  name: 'Timeline',
  props: {
    lifeData: {
      type: Array,
      required: true
    },
    selectedPeriod: {
      type: Object,
      default: null
    }
  },
  computed: {
    selectedIndex() {
      return this.lifeData.findIndex(item => item.id === this.selectedPeriod?.id)
    },
    canGoPrevious() {
      return this.selectedIndex > 0
    },
    canGoNext() {
      return this.selectedIndex < this.lifeData.length - 1
    },
    progressPercentage() {
      if (this.selectedIndex === -1) return 0
      return ((this.selectedIndex + 1) / this.lifeData.length) * 100
    }
  },
  methods: {
    selectPeriod(period) {
      this.$emit('period-select', period)
      this.scrollToTop()
    },

    previousPeriod() {
      if (this.canGoPrevious) {
        this.selectPeriod(this.lifeData[this.selectedIndex - 1])
      }
    },

    nextPeriod() {
      if (this.canGoNext) {
        this.selectPeriod(this.lifeData[this.selectedIndex + 1])
      }
    },

    scrollToTop() {
      // 平滑滚动到页面顶部，添加延迟确保内容更新后再滚动
      this.$nextTick(() => {
        // 使用requestAnimationFrame确保DOM更新完成
        requestAnimationFrame(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        })
      })
    }

  }
}
</script>

<style scoped>
/* 全局滚动行为 */
html {
  scroll-behavior: smooth;
}
.timeline-container {
  background: var(--beige);
  padding: 1rem 1.5rem;
  box-shadow: 0 -4px 20px var(--shadow);
  height: 140px;
  display: flex;
  align-items: center;
  position: relative;
  /* 确保滚动平滑 */
  scroll-behavior: smooth;
}


.timeline-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

/* 当前时期显示样式 */
.current-period-display {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.period-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: var(--cream);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px var(--shadow);
  border: 2px solid var(--light-ochre);
}

.period-year {
  background: var(--primary-ochre);
  color: var(--cream);
  padding: 0.8rem 1.2rem;
  border-radius: 20px;
  font-size: 1.1rem;
  font-weight: bold;
  box-shadow: 0 4px 8px var(--shadow);
  min-width: 80px;
  text-align: center;
  flex-shrink: 0;
}

.period-details {
  flex: 1;
  min-width: 0;
}

.period-title {
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
  color: var(--text-dark);
  line-height: 1.3;
}

.period-location {
  font-size: 0.95rem;
  color: var(--text-medium);
  margin: 0;
  line-height: 1.3;
}

/* 进度指示器样式 */
.progress-indicator {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--cream);
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px var(--shadow);
  border: 1px solid var(--light-ochre);
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: var(--wood-light);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--light-ochre), var(--primary-ochre));
  border-radius: 4px;
  transition: width 0.5s ease;
  box-shadow: 0 2px 4px var(--shadow);
}

.progress-text {
  color: var(--text-dark);
  font-size: 0.9rem;
  font-weight: 600;
  min-width: 60px;
  text-align: center;
}

/* 默认显示样式 */
.default-display {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.default-content {
  text-align: center;
  background: var(--cream);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px var(--shadow);
  border: 2px solid var(--light-ochre);
}

.default-title {
  font-size: 1.3rem;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
}

.default-subtitle {
  font-size: 1rem;
  color: var(--text-medium);
  margin: 0;
}


.control-btn {
  background: #ff6b35;
  color: white;
  border: 2px solid #ff6b35;
  padding: 0.6rem 1rem;
  border-radius: 25px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
  min-width: 50px;
  display: inline-block;
  font-weight: bold;
  text-align: center;
}

.control-btn:hover:not(:disabled) {
  background: var(--secondary-ochre);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--shadow);
}

.control-btn:disabled {
  background: var(--wood-light);
  color: var(--text-light);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 独立的绝对定位左侧操作区域 */
.timeline-controls-absolute {
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  z-index: 1001;
  background: rgba(245, 242, 237, 0.95);
  padding: 1rem;
  border-radius: 20px;
  box-shadow: 0 8px 32px var(--shadow);
  backdrop-filter: blur(10px);
}

.control-btn-vertical {
  background: var(--primary-ochre);
  color: var(--cream);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px var(--shadow);
  font-weight: bold;
}

.control-btn-vertical:hover:not(:disabled) {
  background: var(--secondary-ochre);
  transform: scale(1.1);
  box-shadow: 0 6px 16px var(--shadow);
}

.control-btn-vertical:disabled {
  background: var(--wood-light);
  color: var(--text-light);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.dots-indicator {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d2b48c;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot:hover {
  background: var(--secondary-ochre);
  transform: scale(1.2);
}

.dot.active {
  background: #8b4513;
  transform: scale(1.4);
  box-shadow: 0 0 12px rgba(139, 69, 19, 0.6);
}

@media (max-width: 768px) {
  .timeline-container {
    padding: 0.8rem 1rem;
    height: 120px;
    /* 移动端优化滚动 */
    -webkit-overflow-scrolling: touch;
  }
  
  .timeline-controls-absolute {
    left: 15px;
    padding: 0.8rem;
    gap: 0.8rem;
  }
  
  .control-btn-vertical {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
  
  .dots-indicator {
    gap: 0.4rem;
  }
  
  .dot {
    width: 6px;
    height: 6px;
  }

  .current-period-display {
    gap: 0.8rem;
  }

  .period-info {
    padding: 0.8rem 1rem;
    gap: 1rem;
  }

  .period-year {
    padding: 0.6rem 1rem;
    font-size: 1rem;
    min-width: 70px;
  }

  .period-title {
    font-size: 1.1rem;
  }

  .period-location {
    font-size: 0.9rem;
  }

  .progress-indicator {
    padding: 0.6rem 1rem;
    gap: 0.8rem;
  }

  .progress-text {
    font-size: 0.8rem;
    min-width: 50px;
  }

  .default-content {
    padding: 1.5rem;
  }

  .default-title {
    font-size: 1.1rem;
  }

  .default-subtitle {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .timeline-container {
    padding: 0.6rem 0.8rem;
    height: 100px;
    /* 小屏幕设备优化滚动 */
    -webkit-overflow-scrolling: touch;
  }
  
  .timeline-controls-absolute {
    left: 10px;
    padding: 0.6rem;
    gap: 0.6rem;
  }
  
  .control-btn-vertical {
    width: 30px;
    height: 30px;
    font-size: 0.9rem;
  }
  
  .dots-indicator {
    gap: 0.3rem;
  }
  
  .dot {
    width: 5px;
    height: 5px;
  }

  .current-period-display {
    gap: 0.6rem;
  }

  .period-info {
    padding: 0.6rem 0.8rem;
    gap: 0.8rem;
    flex-direction: column;
    align-items: flex-start;
  }

  .period-year {
    padding: 0.5rem 0.8rem;
    font-size: 0.9rem;
    min-width: 60px;
    align-self: center;
  }

  .period-details {
    width: 100%;
    text-align: center;
  }

  .period-title {
    font-size: 1rem;
  }

  .period-location {
    font-size: 0.85rem;
  }

  .progress-indicator {
    padding: 0.5rem 0.8rem;
    gap: 0.6rem;
  }

  .progress-text {
    font-size: 0.75rem;
    min-width: 45px;
  }

  .default-content {
    padding: 1rem;
  }

  .default-title {
    font-size: 1rem;
  }

  .default-subtitle {
    font-size: 0.85rem;
  }
}
</style>