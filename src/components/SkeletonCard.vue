<template>
  <div class="skeleton-card">
    <div class="skeleton-icon"></div>
    <div class="skeleton-content">
      <div class="skeleton-line skeleton-title"></div>
      <div class="skeleton-line skeleton-value"></div>
      <div class="skeleton-line skeleton-change"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.skeleton-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.skeleton-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  flex-shrink: 0;
}

.skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 16px;
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

.skeleton-title { 
  width: 60%; 
}

.skeleton-value { 
  width: 40%; 
  height: 24px; 
}

.skeleton-change { 
  width: 30%; 
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