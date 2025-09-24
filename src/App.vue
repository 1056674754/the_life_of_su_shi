<template>
  <div id="app">
    <header class="app-header">
      <h1 class="main-title poetry-font">东坡诗意美食</h1>
      <p class="subtitle body-font">品味文化人生 · 感悟诗词美味</p>
    </header>

    <main class="main-content">
      <div class="content-grid" v-if="selectedPeriod">
        <section class="map-section">
          <MapVisualization
            :location="selectedPeriod.location"
            :coordinates="selectedPeriod.coordinates"
          />
        </section>

        <section class="content-section">
          <FoodPoetryCard
            :period="selectedPeriod"
            @show-poetry-annotation="showPoetryAnnotation"
            @show-food-story="showFoodStory"
          />
        </section>
      </div>
    </main>

    <footer class="timeline-footer">
      <Timeline
        :lifeData="lifeData"
        :selectedPeriod="selectedPeriod"
        @period-select="handlePeriodSelect"
      />
    </footer>

    <PoetryAnnotationPopup
      v-if="showAnnotation"
      :annotation="currentAnnotation"
      @close="showAnnotation = false"
    />

    <FoodStoryPopup
      v-if="showStory"
      :story="currentStory"
      @close="showStory = false"
    />
  </div>
</template>

<script>
import Timeline from './components/Timeline.vue'
import MapVisualization from './components/MapVisualization.vue'
import FoodPoetryCard from './components/FoodPoetryCard.vue'
import PoetryAnnotationPopup from './components/PoetryAnnotationPopup.vue'
import FoodStoryPopup from './components/FoodStoryPopup.vue'

import lifeData from './data/dongpoLifeData.json'
import poetryAnnotations from './data/poetryAnnotations.json'
import foodStories from './data/foodStories.json'

export default {
  name: 'App',
  components: {
    Timeline,
    MapVisualization,
    FoodPoetryCard,
    PoetryAnnotationPopup,
    FoodStoryPopup
  },
  data() {
    return {
      lifeData,
      selectedPeriod: null,
      showAnnotation: false,
      showStory: false,
      currentAnnotation: null,
      currentStory: null
    }
  },
  methods: {
    handlePeriodSelect(period) {
      this.selectedPeriod = period
    },

    showPoetryAnnotation(line) {
      const annotation = poetryAnnotations[line]
      if (annotation) {
        this.currentAnnotation = {
          line,
          ...annotation
        }
        this.showAnnotation = true
      }
    },

    showFoodStory(foodName) {
      const story = foodStories[foodName]
      if (story) {
        this.currentStory = {
          name: foodName,
          ...story
        }
        this.showStory = true
      }
    }
  },
  mounted() {
    this.selectedPeriod = this.lifeData[0]
  }
}
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--cream);
}

.app-header {
  text-align: center;
  padding: 1rem 0;
  background: linear-gradient(135deg, var(--primary-ochre) 0%, var(--secondary-ochre) 100%);
  color: var(--cream);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.main-title {
  font-size: 2rem;
  margin-bottom: 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: 0;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  max-width: 760px;
  margin: 0 auto;
  width: 100%;
  padding: 1rem;
}

.content-grid {
  display: grid;
  gap: 1.5rem;
  height: 100%;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;
}

.map-section {
  min-height: 300px;
}

.content-section {
  min-height: 500px;
}

.timeline-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--beige);
  border-top: 3px solid var(--primary-ochre);
  box-shadow: 0 -4px 20px var(--shadow);
  z-index: 1000;
}

/* 为底部时间栏留出空间 */
.main-content {
  padding-bottom: 160px;
}

/* 平板和桌面优化 */
@media (min-width: 768px) {
  .main-content {
    padding: 0.8rem;
    padding-bottom: 180px;
  }
  
  .map-section {
    min-height: 350px;
  }
  
  .content-section {
    min-height: 600px;
  }
}

/* 大屏幕优化 */
@media (min-width: 1024px) {
  .main-title {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .main-content {
    padding: 1rem;
    padding-bottom: 160px;
  }
  
  .content-grid {
    gap: 1rem;
  }
  
  .map-section {
    min-height: 400px;
  }
  
  .content-section {
    min-height: 700px;
  }
}

/* 手机竖屏优化 */
@media (max-width: 767px) {
  .app-header {
    flex-direction: column;
    gap: 0.3rem;
    padding: 0.8rem 0;
  }

  .main-title {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 0.8rem;
  }

  .map-section {
    min-height: 250px;
  }
  
  .content-section {
    min-height: 400px;
  }
  
  .main-content {
    padding: 1rem;
    padding-bottom: 140px;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .app-header {
    padding: 0.6rem 0;
  }

  .main-title {
    font-size: 1.6rem;
  }
  
  .subtitle {
    font-size: 0.75rem;
  }
  
  .map-section {
    min-height: 200px;
  }
  
  .content-section {
    min-height: 350px;
  }
}
</style>