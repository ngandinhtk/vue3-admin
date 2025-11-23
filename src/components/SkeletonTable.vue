<template>
  <div class="skeleton-table">
    <div v-for="i in rows" :key="i" class="skeleton-row"></div>
  </div>
</template>

<script setup lang="ts">
// Props
withDefaults(defineProps<{
  rows?: number;
}>(), {
  rows: 4
});
</script>

<style scoped lang="scss">
.skeleton-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-row {
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% { 
    background-position: -100% 0; 
  }
  100% { 
    background-position: 100% 0; 
  }
}
</style>