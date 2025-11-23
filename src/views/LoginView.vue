<template>
  <div class="login-page">
    <ProgressBar :loading="loading" />
    
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-circle">
            <Lock :size="32" />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to continue to your account</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div v-if="error" class="alert alert-error">
            <AlertCircle :size="16" />
            {{ error }}
          </div>
          
          <div class="form-group">
            <label for="username">Username</label>
            <div class="input-wrapper">
              <User :size="18" />
              <input
                id="username"
                v-model="formData.username"
                type="text"
                placeholder="Enter your username"
                :disabled="loading"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-wrapper">
              <Lock :size="18" />
              <input
                id="password"
                v-model="formData.password"
                type="password"
                placeholder="Enter your password"
                :disabled="loading"
                required
              />
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
            <Loader v-if="loading" class="spinner" :size="18" />
            {{ loading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>

        <div class="login-footer">
          <p>Demo accounts:</p>
          <div class="demo-accounts">
            <span><strong>Admin:</strong> admin / admin123</span>
            <span><strong>User:</strong> user / user123</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { Lock, User, AlertCircle, Loader } from 'lucide-vue-next';
import ProgressBar from '../components/ProgressBar.vue';

const router = useRouter();
const authStore = useAuthStore();

const formData = ref({
  username: '',
  password: ''
});

const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
// console.log(formData.value.password);

  try {
    await authStore.login(formData.value.username, formData.value.password);
    router.push('/dashboard');
  } catch (err) {
    error.value = 'Invalid username or password';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  padding: 20px;
  width: 100%;
  max-width: 440px;
}

.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 48px;
  animation: slideUp 0.4s ease;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: white;
}

.login-header h1 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1a202c;
}

.login-header p {
  color: #718096;
  font-size: 14px;
}

.login-form {
  margin-bottom: 24px;
}

.login-footer {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.login-footer p {
  color: #718096;
  font-size: 13px;
  margin-bottom: 12px;
}

.demo-accounts {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  color: #4a5568;
}

@media (max-width: 480px) {
  .login-card {
    padding: 32px 24px;
  }
}
</style>