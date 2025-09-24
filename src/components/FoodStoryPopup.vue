<template>
  <div class="popup-overlay" @click="closePopup">
    <div class="popup-content" @click.stop>
      <div class="popup-header">
        <h3 class="popup-title poetry-font">{{ story.name }}的故事</h3>
        <button class="close-btn" @click="closePopup">&times;</button>
      </div>

      <div class="popup-body">
        <div class="story-section">
          <h4 class="section-title heading-font">历史故事</h4>
          <p class="story-text body-font">{{ story.story }}</p>
        </div>

        <div class="cultural-section">
          <h4 class="section-title heading-font">文化内涵</h4>
          <p class="cultural-text body-font">{{ story.culturalMeaning }}</p>
        </div>

        <div class="cooking-section" v-if="story.cookingMethod">
          <h4 class="section-title heading-font">制作方法</h4>
          <p class="cooking-text body-font">{{ story.cookingMethod }}</p>
        </div>

        <div class="related-section">
          <h4 class="section-title heading-font">相关诗词</h4>
          <div class="related-poetry">
            <div class="poetry-item" v-for="poem in relatedPoetry" :key="poem.title">
              <h5 class="poetry-item-title poetry-font">{{ poem.title }}</h5>
              <p class="poetry-item-content body-font">{{ poem.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FoodStoryPopup',
  props: {
    story: {
      type: Object,
      required: true
    }
  },
  computed: {
    relatedPoetry() {
      const poetryMap = {
        '东坡肉': [
          {
            title: '《饮湖上初晴后雨》',
            content: '水光潋滟晴方好，山色空蒙雨亦奇。欲把西湖比西子，淡妆浓抹总相宜。'
          }
        ],
        '东坡羹': [
          {
            title: '《定风波·莫听穿林打叶声》',
            content: '竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。'
          }
        ],
        '东坡饼': [
          {
            title: '《六月二十日夜渡海》',
            content: '九死南荒吾不恨，兹游奇绝冠平生。'
          }
        ],
        '眉州东坡泡菜': [
          {
            title: '《和子由渑池怀旧》',
            content: '人生到处知何似，应似飞鸿踏雪泥。'
          }
        ],
        '东坡豆腐': [
          {
            title: '《题西林壁》',
            content: '不识庐山真面目，只缘身在此山中。'
          }
        ],
        '东坡肘子': [
          {
            title: '《自题金山画像》',
            content: '问汝平生功业，黄州惠州儋州。'
          }
        ]
      }

      return poetryMap[this.story.name] || []
    }
  },
  methods: {
    closePopup() {
      this.$emit('close')
    },

    handleEscape(event) {
      if (event.key === 'Escape') {
        this.closePopup()
      }
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
  max-width: 700px;
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
  background: linear-gradient(135deg, var(--primary-ochre) 0%, var(--secondary-ochre) 100%);
  color: var(--cream);
  border-radius: 20px 20px 0 0;
}

.popup-title {
  font-size: 1.8rem;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--cream);
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
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.popup-body {
  padding: 2rem;
}

.story-section,
.cultural-section,
.cooking-section,
.related-section {
  margin-bottom: 2rem;
}

.section-title {
  color: var(--primary-ochre);
  font-size: 1.2rem;
  margin-bottom: 1rem;
  border-left: 4px solid var(--accent-red);
  padding-left: 1rem;
  background: var(--beige);
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 0 8px 8px 0;
}

.story-text,
.cultural-text,
.cooking-text {
  color: var(--text-dark);
  line-height: 1.8;
  font-size: 1rem;
  text-align: justify;
  background: var(--beige);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--light-ochre);
}

.related-poetry {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.poetry-item {
  background: var(--beige);
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid var(--primary-ochre);
  box-shadow: 0 4px 12px var(--shadow);
}

.poetry-item-title {
  color: var(--primary-ochre);
  font-size: 1.1rem;
  margin-bottom: 1rem;
  text-align: center;
}

.poetry-item-content {
  color: var(--text-dark);
  line-height: 1.8;
  font-size: 1rem;
  text-align: center;
  white-space: pre-line;
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
    padding: 1.5rem;
  }

  .story-text,
  .cultural-text,
  .cooking-text {
    font-size: 0.95rem;
    padding: 1rem;
  }

  .section-title {
    font-size: 1.1rem;
  }

  .poetry-item {
    padding: 1rem;
  }

  .poetry-item-title {
    font-size: 1rem;
  }

  .poetry-item-content {
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
    padding: 1rem;
  }

  .story-text,
  .cultural-text,
  .cooking-text {
    font-size: 0.9rem;
    line-height: 1.6;
    padding: 0.8rem;
  }

  .section-title {
    font-size: 1rem;
    margin-bottom: 0.8rem;
  }

  .poetry-item {
    padding: 0.8rem;
  }

  .poetry-item-title {
    font-size: 0.9rem;
    margin-bottom: 0.8rem;
  }

  .poetry-item-content {
    font-size: 0.9rem;
    line-height: 1.6;
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