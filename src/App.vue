<script setup lang="ts">
// import Dashboard from './views/Dashboard.vue';
import LoginView from './views/LoginView.vue';
</script>

<template>
  <div>
    Dasshboard Admin - Vue 3 + Vite + TypeScript
    <LoginView msg="Vite + Vue" />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
