<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <Shield :size="32" />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to access your dashboard</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>
              <Mail :size="16" />
              Email Address
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div class="form-group">
            <label>
              <Key :size="16" />
              Password
            </label>
            <input
              v-model="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="demo-credentials">
          <p>Demo Credentials:</p>
          <div class="credential-card">
            <strong>👑 Admin:</strong> admin@company.com / admin123
          </div>
          <div class="credential-card">
            <strong>👤 User:</strong> user@company.com / user123
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Shield, Mail, Key } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const email = ref<string>('')
const password = ref<string>('')
const error = ref<string>('')
const loading = ref<boolean>(false)

const handleLogin = async (): Promise<void> => {
  error.value = ''
  loading.value = true

  setTimeout(() => {
    const result = authStore.login(email.value, password.value)
    if (result.success) {
      router.push('/dashboard')
    } else {
      error.value = result.error || 'Login failed'
    }
    loading.value = false
  }, 500)
}
</script>

<style lang="scss" scoped>
// Removed @import '../assets/styles/variables'; as variables are hardcoded
// Removed @import '../assets/styles/mixins'; as mixins are not directly replaced by variables

.login-page {
  background: linear-gradient(135deg, #f5f7ff 0%, #ffffff 50%, #faf5ff 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 32px;

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px; // Assuming $primary is #667eea and $secondary is #764ba2
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 12px;
    margin: 0 auto 16px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    color: #ffffff;
  }

  h1 {
    font-size: 2rem; // Assuming $gray-900 is #1a202c
    margin-bottom: 4px;
    color: #1a202c;
  }

  p {
    color: #718096;
    margin: 0;
  }
}

.login-form {
  margin-bottom: 24px;

  .form-group {
    margin-bottom: 16px;

    label {
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: 600; // Assuming $gray-700 is #4a5568
      color: #4a5568;
      margin-bottom: 4px;
      font-size: 0.875rem;
    }

    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #cbd5e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s;

      &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(#667eea, 0.1);
      }

      &::placeholder {
        color: #a0aec0;
      }
    }
  }

  .error-message {
    background: rgba(#f56565, 0.1);
    border: 1px solid rgba(#f56565, 0.3);
    color: #f56565;
    padding: 8px;
    border-radius: 8px;
    margin-bottom: 16px;
    font-size: 0.875rem;
    animation: shake 0.3s ease-in-out;
  }

  .btn-primary {
    width: 100%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: #ffffff;
    padding: 8px;
    border-radius: 8px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1rem;

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #556cd6, #653e8e);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      transform: translateY(-2px);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.demo-credentials {
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;

  p {
    text-align: center;
    color: #718096;
    font-size: 0.875rem;
    margin-bottom: 8px;
  }

  .credential-card {
    background: linear-gradient(135deg, rgba(#667eea, 0.05), rgba(#764ba2, 0.05));
    border: 1px solid rgba(#667eea, 0.1);
    padding: 8px;
    border-radius: 4px;
    margin-bottom: 4px;
    font-size: 0.875rem;

    &:last-child {
      margin-bottom: 0;
    }

    strong {
      color: #4a5568;
    }
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

@media (max-width: 640px) {
  .login-card {
    padding: 24px;
  }

  .login-header h1 {
    font-size: 1.5rem;
  }
}
</style>