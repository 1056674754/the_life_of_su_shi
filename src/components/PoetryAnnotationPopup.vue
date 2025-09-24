<template>
  <div class="popup-overlay" @click="closePopup">
    <div class="popup-content" @click.stop>
      <div class="popup-header">
        <h3 class="popup-title poetry-font">诗词注解</h3>
        <button class="close-btn" @click="closePopup">&times;</button>
      </div>

      <div class="popup-body">
        <div class="poetry-line-section">
          <h4 class="section-title heading-font">原句</h4>
          <div class="poetry-line poetry-font">{{ annotation.line }}</div>
        </div>

        <div class="annotation-section">
          <h4 class="section-title heading-font">词语注释</h4>
          <p class="annotation-text body-font">{{ annotation.annotation }}</p>
        </div>

        <div class="cultural-section">
          <h4 class="section-title heading-font">文化内涵</h4>
          <p class="cultural-text body-font">{{ annotation.culturalMeaning }}</p>
        </div>

        <div class="related-section" v-if="relatedPoems.length > 0">
          <h4 class="section-title heading-font">相关诗句</h4>
          <div class="related-poems">
            <div
              v-for="poem in relatedPoems"
              :key="poem.line"
              class="related-poem poetry-font"
              @click="selectRelatedPoem(poem.line)"
            >
              {{ poem.line }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PoetryAnnotationPopup',
  props: {
    annotation: {
      type: Object,
      required: true
    }
  },
  computed: {
    relatedPoems() {
      const related = []
      const allAnnotations = this.$parent.$options.data().poetryAnnotations || {}

      for (const [line, data] of Object.entries(allAnnotations)) {
        if (line !== this.annotation.line &&
            (data.culturalMeaning.includes('苏轼') ||
             data.culturalMeaning.includes('人生') ||
             data.culturalMeaning.includes('豁达') ||
             data.annotation.includes('竹杖') ||
             data.annotation.includes('风雨'))) {
          related.push({ line, ...data })
        }
      }

      return related.slice(0, 3)
    }
  },
  methods: {
    closePopup() {
      this.$emit('close')
    },

    selectRelatedPoem(line) {
      this.$emit('select-related', line)
    }
  },
  mounted() {
    document.addEventListener('keydown', this.handleEscape)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleEscape)
  }
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.popup-content {
  background: var(--cream);
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 2px solid var(--light-ochre);
}

.popup-title {
  color: var(--primary-ochre);
  font-size: 1.8rem;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--text-medium);
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: var(--light-ochre);
  color: var(--primary-ochre);
}

.popup-body {
  padding: 2rem;
}

.poetry-line-section,
.annotation-section,
.cultural-section,
.related-section {
  margin-bottom: 2rem;
}

.section-title {
  color: var(--primary-ochre);
  font-size: 1.2rem;
  margin-bottom: 1rem;
  border-left: 4px solid var(--accent-red);
  padding-left: 1rem;
}

.poetry-line {
  font-size: 1.5rem;
  color: var(--accent-red);
  text-align: center;
  padding: 1.5rem;
  background: var(--beige);
  border-radius: 12px;
  border: 2px solid var(--accent-red);
  box-shadow: 0 4px 16px rgba(196, 77, 52, 0.1);
}

.annotation-text,
.cultural-text {
  color: var(--text-dark);
  line-height: 1.8;
  font-size: 1rem;
  text-align: justify;
}

.related-poems {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.related-poem {
  background: var(--beige);
  padding: 1rem;
  border-radius: 8px;
  color: var(--text-medium);
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 3px solid var(--light-ochre);
}

.related-poem:hover {
  background: var(--wood-light);
  color: var(--primary-ochre);
  border-left-color: var(--primary-ochre);
  transform: translateX(5px);
}

@media (max-width: 768px) {
  .popup-content {
    width: 95%;
    max-height: 85vh;
  }

  .popup-header {
    padding: 1.5rem 1.5rem 1rem;
  }

  .popup-title {
    font-size: 1.5rem;
  }

  .popup-body {
    padding: 2rem;
  }

  .poetry-line {
    font-size: 1.3rem;
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.1rem;
  }

  .annotation-text,
  .cultural-text {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .popup-header {
    padding: 1rem 1rem 0.8rem;
  }

  .popup-title {
    font-size: 1.3rem;
  }

  .popup-body {
    padding: 2rem;
  }

  .poetry-line {
    font-size: 1.1rem;
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1rem;
    margin-bottom: 0.8rem;
  }

  .annotation-text,
  .cultural-text {
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .related-poem {
    padding: 1rem;
    font-size: 0.9rem;
  }
}

/* 滚动条样式 */
.popup-content::-webkit-scrollbar {
  width: 6px;
}

.popup-content::-webkit-scrollbar-track {
  background: var(--beige);
  border-radius: 3px;
}

.popup-content::-webkit-scrollbar-thumb {
  background: var(--light-ochre);
  border-radius: 3px;
}

.popup-content::-webkit-scrollbar-thumb:hover {
  background: var(--secondary-ochre);
}
</style>