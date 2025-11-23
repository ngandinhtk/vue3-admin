import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index'
import { useAuthStore } from './stores/auth'
import "../src/assets/styles/main.scss";

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
// Initialize auth store after Pinia is installed
useAuthStore().initializeAuth()
app.use(router)
app.mount('#app')