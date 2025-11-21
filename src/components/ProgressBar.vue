<template>
  <Transition name="fade">
    <div v-if="visible" class="progress-bar-container">
      <div class="progress-bar" :style="{ width: `${progress}%` }"></div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';

// Props
const props = defineProps<{
  loading: boolean;
}>();

// State
const progress = ref(0);
const visible = ref(false);
let interval: ReturnType<typeof setInterval> | null = null;
let timeout: ReturnType<typeof setTimeout> | null = null;

// Watch loading state
watch(() => props.loading, (isLoading) => {
  if (isLoading) {
    visible.value = true;
    progress.value = 0;
    
    // Clear existing interval
    if (interval) clearInterval(interval);
    
    // Animate progress
    interval = setInterval(() => {
      progress.value = Math.min(progress.value + Math.random() * 10, 90);
    }, 200);
  } else {
    // Complete the progress
    progress.value = 100;
    
    // Clear interval
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    
    // Hide after animation
    timeout = setTimeout(() => {
      visible.value = false;
      progress.value = 0;
    }, 400);
  }
});

// Cleanup
onUnmounted(() => {
  if (interval) clearInterval(interval);
  if (timeout) clearTimeout(timeout);
});
</script>

<style scoped lang="scss">
.progress-bar-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.2);
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
}

@keyframes shimmer {
  0% { background-position: -100% 0; }
  100% { background-position: 100% 0; }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>