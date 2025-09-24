<template>
  <div class="card-container">
    <div class="card-header">
      <h2 class="card-title heading-font">{{ period.period }} · {{ period.year }}</h2>
      <p class="card-location body-font">{{ period.location }}</p>
    </div>

    <div class="card-content">
      <div class="food-section">
        <div class="food-image-container">
          <img
            v-if="imageExists"
            :src="period.cuisine.image"
            :alt="period.cuisine.name"
            class="food-image"
            @click="showFoodStory"
            @error="handleImageError"
          >
          <ImagePlaceholder
            v-else
            :foodName="period.cuisine.name"
            :width="300"
            :height="200"
            @click="showFoodStory"
          />
          <div class="food-overlay">
            <p class="overlay-text poetry-font">点击查看故事</p>
          </div>
        </div>

        <div class="food-info">
          <h3 class="food-name poetry-font">{{ period.cuisine.name }}</h3>
          <p class="food-description body-font">{{ period.cuisine.description }}</p>
        </div>
      </div>

      <div class="poetry-section">
        <div class="poetry-header">
          <h3 class="poetry-title heading-font">{{ period.poetry.title }}</h3>
          <p class="poetry-dynasty body-font">{{ period.poetry.dynasty }}</p>
        </div>

        <div class="poetry-content">
          <div
            v-for="(line, index) in poetryLines"
            :key="index"
            class="poetry-line poetry-font"
            :class="{ 'highlighted': isHighlighted(line) }"
            @click="showPoetryAnnotation(line)"
          >
            {{ line }}
          </div>
        </div>

        <div class="poetry-insight">
          <h4 class="insight-title heading-font">文化解读</h4>
          <p class="insight-content body-font">{{ period.culturalInsight }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImagePlaceholder from './ImagePlaceholder.vue'

export default {
  name: 'FoodPoetryCard',
  components: {
    ImagePlaceholder
  },
  props: {
    period: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      imageExists: true
    }
  },
  computed: {
    poetryLines() {
      return this.period.poetry.content.split('\n')
    }
  },
  methods: {
    isHighlighted(line) {
      return this.period.poetry.highlightedLines.includes(line)
    },

    showPoetryAnnotation(line) {
      if (this.isHighlighted(line)) {
        this.$emit('show-poetry-annotation', line)
      }
    },

    showFoodStory() {
      this.$emit('show-food-story', this.period.cuisine.name)
    },

    handleImageError() {
      this.imageExists = false
    }
  }
}
</script>

<style scoped>
.card-container {
  background: var(--cream);
  border-radius: 20px;
  box-shadow: 0 12px 48px var(--shadow);
  overflow: hidden;
  transition: all 0.3s ease;
}

.card-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 64px rgba(139, 69, 19, 0.2);
}

.card-header {
  background: linear-gradient(135deg, var(--primary-ochre) 0%, var(--secondary-ochre) 100%);
  color: var(--cream);
  padding: 2rem;
  text-align: center;
}

.card-title {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

.card-location {
  font-size: 1.1rem;
  opacity: 0.9;
  font-style: italic;
}

.card-content {
  display: flex;
  min-height: 600px;
}

.food-section {
  flex: 1;
  padding: 2rem;
  background: linear-gradient(135deg, var(--beige) 0%, var(--cream) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.food-image-container {
  position: relative;
  width: 300px;
  height: 200px;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 2rem;
  cursor: pointer;
  box-shadow: 0 8px 32px var(--shadow);
  transition: all 0.3s ease;
}

.food-image-container:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 48px rgba(139, 69, 19, 0.25);
}

.food-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.food-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(139, 69, 19, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.food-image-container:hover .food-overlay {
  opacity: 1;
}

.overlay-text {
  color: var(--cream);
  font-size: 1.3rem;
  text-align: center;
}

.food-info {
  text-align: center;
  max-width: 300px;
}

.food-name {
  font-size: 1.8rem;
  color: var(--primary-ochre);
  margin-bottom: 1rem;
  text-align: center;
}

.food-description {
  color: var(--text-dark);
  line-height: 1.6;
  font-size: 1rem;
}

.poetry-section {
  flex: 1;
  padding: 2rem;
  background: var(--cream);
  display: flex;
  flex-direction: column;
}

.poetry-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--light-ochre);
}

.poetry-title {
  font-size: 1.5rem;
  color: var(--primary-ochre);
  margin-bottom: 0.5rem;
}

.poetry-dynasty {
  color: var(--text-medium);
  font-size: 0.9rem;
  font-style: italic;
}

.poetry-content {
  flex: 1;
  padding: 1.5rem;
  background: var(--beige);
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: center;
}

.poetry-line {
  font-size: 1.3rem;
  line-height: 2;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 0.3rem 0;
  border-radius: 6px;
}

.poetry-line:hover {
  background: rgba(139, 69, 19, 0.1);
}

.poetry-line.highlighted {
  color: var(--accent-red);
  font-weight: bold;
  position: relative;
}

.poetry-line.highlighted:hover {
  background: rgba(196, 77, 52, 0.1);
  transform: scale(1.05);
}

.poetry-line.highlighted::after {
  content: '💡';
  position: absolute;
  right: -30px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
}

.poetry-insight {
  background: linear-gradient(135deg, var(--wood-light) 0%, var(--wood-dark) 100%);
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid var(--primary-ochre);
}

.insight-title {
  color: var(--primary-ochre);
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.insight-content {
  color: var(--text-dark);
  line-height: 1.7;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .card-content {
    flex-direction: column;
    min-height: auto;
  }

  .food-section {
    padding: 1.5rem;
  }

  .food-image-container {
    width: 250px;
    height: 160px;
  }

  .food-name {
    font-size: 1.5rem;
  }

  .poetry-section {
    padding: 1.5rem;
  }

  .poetry-content {
    padding: 1rem;
  }

  .poetry-line {
    font-size: 1.1rem;
  }

  .card-header {
    padding: 1.5rem;
  }

  .card-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .food-image-container {
    width: 200px;
    height: 130px;
  }

  .food-name {
    font-size: 1.3rem;
  }

  .poetry-line {
    font-size: 1rem;
  }

  .card-title {
    font-size: 1.3rem;
  }

  .card-location {
    font-size: 1rem;
  }
}

/* 动画效果 */
.card-container {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.poetry-line.highlighted {
  animation: pulseGlow 2s infinite;
}

@keyframes pulseGlow {
  0%, 100% {
    text-shadow: 0 0 5px rgba(196, 77, 52, 0.3);
  }
  50% {
    text-shadow: 0 0 15px rgba(196, 77, 52, 0.6);
  }
}
</style>