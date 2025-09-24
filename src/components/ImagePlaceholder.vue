<template>
  <div class="image-placeholder" :style="{ width: width + 'px', height: height + 'px' }">
    <div class="placeholder-content">
      <div class="placeholder-icon">🍜</div>
      <div class="placeholder-text poetry-font">{{ foodName }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImagePlaceholder',
  props: {
    foodName: {
      type: String,
      default: '美食'
    },
    width: {
      type: Number,
      default: 300
    },
    height: {
      type: Number,
      default: 200
    }
  }
}
</script>

<style scoped>
.image-placeholder {
  background: linear-gradient(135deg, var(--wood-light) 0%, var(--wood-dark) 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed var(--light-ochre);
  transition: all 0.3s ease;
}

.placeholder-content {
  text-align: center;
}

.placeholder-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.placeholder-text {
  color: var(--text-medium);
  font-size: 1.2rem;
  font-weight: bold;
}

.image-placeholder:hover {
  border-color: var(--primary-ochre);
  background: linear-gradient(135deg, var(--wood-dark) 0%, var(--wood-light) 100%);
  transform: scale(1.02);
}
</style>