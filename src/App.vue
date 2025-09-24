<template>
  <div id="app">
    <header class="app-header">
      <h1 class="main-title poetry-font">东坡诗意美食</h1>
      <p class="subtitle body-font">品味文化人生 · 感悟诗词美味</p>
    </header>

    <main class="main-content">
      <section class="timeline-section">
        <Timeline
          :lifeData="lifeData"
          :selectedPeriod="selectedPeriod"
          @period-select="handlePeriodSelect"
        />
      </section>

      <section class="map-section" v-if="selectedPeriod">
        <MapVisualization
          :location="selectedPeriod.location"
          :coordinates="selectedPeriod.coordinates"
        />
      </section>

      <section class="content-section" v-if="selectedPeriod">
        <FoodPoetryCard
          :period="selectedPeriod"
          @show-poetry-annotation="showPoetryAnnotation"
          @show-food-story="showFoodStory"
        />
      </section>
    </main>

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
.app-header {
  text-align: center;
  padding: 2rem 0;
  background: linear-gradient(135deg, var(--primary-ochre) 0%, var(--secondary-ochre) 100%);
  color: var(--cream);
  margin-bottom: 2rem;
}

.main-title {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.timeline-section {
  margin-bottom: 3rem;
}

.map-section {
  margin-bottom: 3rem;
  background: var(--beige);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px var(--shadow);
}

.content-section {
  margin-bottom: 3rem;
}

@media (max-width: 768px) {
  .main-title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .map-section {
    padding: 1rem;
  }
}
</style>