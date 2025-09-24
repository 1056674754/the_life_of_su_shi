<template>
  <div class="timeline-container">
    <div class="timeline-header">
      <h2 class="timeline-title heading-font">东坡人生轨迹</h2>
      <p class="timeline-subtitle body-font">点击时间节点，探索对应的美食与诗词</p>
    </div>

    <div class="timeline-wrapper">
      <div class="timeline-line"></div>

      <div class="timeline-items">
        <div
          v-for="(item, index) in lifeData"
          :key="item.id"
          class="timeline-item"
          :class="{
            'active': selectedPeriod?.id === item.id,
            'completed': isCompleted(index)
          }"
          @click="selectPeriod(item)"
        >
          <div class="timeline-marker">
            <div class="marker-dot"></div>
            <div class="marker-year poetry-font">{{ item.year }}</div>
          </div>

          <div class="timeline-content">
            <h3 class="content-period heading-font">{{ item.period }}</h3>
            <p class="content-location body-font">{{ item.location }}</p>
            <p class="content-brief body-font">{{ item.experience.substring(0, 50) }}...</p>
          </div>
        </div>
      </div>
    </div>

    <div class="timeline-controls">
      <button
        class="control-btn body-font"
        @click="previousPeriod"
        :disabled="!canGoPrevious"
      >
        上一个时期
      </button>

      <button
        class="control-btn body-font"
        @click="nextPeriod"
        :disabled="!canGoNext"
      >
        下一个时期
      </button>
    </div>
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
    }
  },
  methods: {
    selectPeriod(period) {
      this.$emit('period-select', period)
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

    isCompleted(index) {
      return this.selectedIndex !== -1 && index < this.selectedIndex
    }
  }
}
</script>

<style scoped>
.timeline-container {
  background: var(--beige);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px var(--shadow);
  margin-bottom: 2rem;
}

.timeline-header {
  text-align: center;
  margin-bottom: 2rem;
}

.timeline-title {
  color: var(--primary-ochre);
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.timeline-subtitle {
  color: var(--text-medium);
  font-size: 1rem;
}

.timeline-wrapper {
  position: relative;
  margin-bottom: 2rem;
}

.timeline-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--light-ochre) 0%, var(--primary-ochre) 50%, var(--light-ochre) 100%);
  border-radius: 2px;
  transform: translateY(-50%);
}

.timeline-items {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 2rem 0;
}

.timeline-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.timeline-item:hover {
  transform: translateY(-5px);
}

.timeline-item.active .timeline-marker {
  transform: scale(1.3);
}

.timeline-item.active .marker-dot {
  background: var(--primary-ochre);
  box-shadow: 0 0 20px rgba(139, 69, 19, 0.6);
}

.timeline-item.completed .marker-dot {
  background: var(--secondary-ochre);
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.marker-dot {
  width: 16px;
  height: 16px;
  background: var(--wood-light);
  border: 3px solid var(--cream);
  border-radius: 50%;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px var(--shadow);
}

.marker-year {
  color: var(--text-dark);
  font-size: 1.1rem;
  font-weight: bold;
  background: var(--cream);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  box-shadow: 0 2px 8px var(--shadow);
}

.timeline-content {
  text-align: center;
  max-width: 150px;
  background: var(--cream);
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px var(--shadow);
  opacity: 0.8;
  transition: all 0.3s ease;
}

.timeline-item:hover .timeline-content {
  opacity: 1;
  transform: scale(1.05);
}

.timeline-item.active .timeline-content {
  opacity: 1;
  background: var(--primary-ochre);
  color: var(--cream);
}

.content-period {
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
}

.content-location {
  font-size: 0.9rem;
  color: var(--text-medium);
  margin-bottom: 0.5rem;
}

.timeline-item.active .content-location {
  color: var(--cream);
  opacity: 0.9;
}

.content-brief {
  font-size: 0.8rem;
  line-height: 1.4;
  color: var(--text-light);
}

.timeline-item.active .content-brief {
  color: var(--cream);
  opacity: 0.8;
}

.timeline-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.control-btn {
  background: var(--primary-ochre);
  color: var(--cream);
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px var(--shadow);
}

.control-btn:hover:not(:disabled) {
  background: var(--secondary-ochre);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px var(--shadow);
}

.control-btn:disabled {
  background: var(--wood-light);
  color: var(--text-light);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

@media (max-width: 768px) {
  .timeline-container {
    padding: 1rem;
  }

  .timeline-title {
    font-size: 1.5rem;
  }

  .timeline-items {
    overflow-x: auto;
    padding: 1rem;
    gap: 1rem;
  }

  .timeline-item {
    min-width: 120px;
  }

  .timeline-content {
    max-width: 120px;
    padding: 0.8rem;
  }

  .marker-year {
    font-size: 0.9rem;
    padding: 0.2rem 0.6rem;
  }

  .content-period {
    font-size: 1rem;
  }

  .content-location {
    font-size: 0.8rem;
  }

  .content-brief {
    font-size: 0.7rem;
  }

  .control-btn {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .timeline-items {
    gap: 0.5rem;
  }

  .timeline-item {
    min-width: 100px;
  }

  .timeline-content {
    max-width: 100px;
    padding: 0.6rem;
  }

  .marker-year {
    font-size: 0.8rem;
  }

  .content-period {
    font-size: 0.9rem;
  }
}
</style>