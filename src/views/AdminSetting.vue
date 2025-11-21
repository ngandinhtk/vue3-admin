<template>
  <div v-if="!isAllowed" class="access-denied-page">
    <div class="access-denied-card">
      <div class="denied-icon">
        <Lock :size="48" />
      </div>
      <h2>Access Denied</h2>
      <p>You don't have permission to access this page. Admin role is required.</p>
      <button @click="router.push('/dashboard')" class="btn-primary">
        Back to Dashboard
      </button>
    </div>
  </div>

  <div v-else-if="isAllowed" class="settings-page">
    <header class="settings-header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <button @click="router.push('/dashboard')" class="btn-back">
              <ChevronRight :size="20" class="icon-rotate" />
            </button>
            <div class="logo">
              <Settings :size="24" />
            </div>
            <div class="header-title">
              <h1>Admin Settings</h1>
              <p>System Configuration</p>
            </div>
          </div>

          <div class="header-right">
            <div class="user-info">
              <div class="user-details">
                <p class="user-name">{{ authStore.currentUser?.name }}</p>
                <p class="user-role">
                  <Crown :size="12" />
                  {{ authStore.currentUser?.role?.toUpperCase() }}
                </p>
              </div>
              <div class="user-avatar">
                {{ authStore.currentUser?.avatar }}
              </div>
            </div>
            <button @click="handleLogout" class="btn-icon" title="Logout">
              <LogOut :size="20" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="settings-main">
      <div class="container">
        <div class="settings-card">
          <h2 class="settings-title">Security Settings</h2>

          <div class="settings-list">
            <!-- Two Factor Auth -->
            <div class="setting-item">
              <div class="setting-info">
                <h3>Two-Factor Authentication</h3>
                <p>Require 2FA for all admin accounts</p>
              </div>
              <label class="toggle-switch">
                <input
                  type="checkbox"
                  v-model="settings.twoFactorAuth"
                  @change="handleSettingChange"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <!-- Email Notifications -->
            <div class="setting-item">
              <div class="setting-info">
                <h3>Email Notifications</h3>
                <p>Send alerts for security events</p>
              </div>
              <label class="toggle-switch">
                <input
                  type="checkbox"
                  v-model="settings.emailNotifications"
                  @change="handleSettingChange"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <!-- API Access -->
            <div class="setting-item">
              <div class="setting-info">
                <h3>API Access</h3>
                <p>Enable external API integrations</p>
              </div>
              <label class="toggle-switch">
                <input
                  type="checkbox"
                  v-model="settings.apiAccess"
                  @change="handleSettingChange"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <!-- Audit Logging -->
            <div class="setting-item">
              <div class="setting-info">
                <h3>Audit Logging</h3>
                <p>Log all user activities</p>
              </div>
              <label class="toggle-switch">
                <input
                  type="checkbox"
                  v-model="settings.auditLogging"
                  @change="handleSettingChange"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <!-- Session Timeout -->
            <div class="setting-item setting-full">
              <div class="setting-info">
                <h3>Session Timeout</h3>
                <p>Automatic logout after inactivity</p>
              </div>
              <div class="slider-container">
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  v-model="settings.sessionTimeout"
                  class="range-slider"
                />
                <span class="slider-value">{{ settings.sessionTimeout }} min</span>
              </div>
            </div>
          </div>

          <div class="settings-actions">
            <button @click="router.push('/dashboard')" class="btn-secondary">
              Cancel
            </button>
            <button @click="handleSave" class="btn-primary">
              Save Changes
            </button>
          </div>
        </div>

        <!-- System Info -->
        <div class="system-info-card">
          <h3>System Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <p class="info-label">Version</p>
              <p class="info-value">v2.5.1</p>
            </div>
            <div class="info-item">
              <p class="info-label">Last Update</p>
              <p class="info-value">Nov 21, 2025</p>
            </div>
            <div class="info-item">
              <p class="info-label">Database Status</p>
              <p class="info-value status-connected">● Connected</p>
            </div>
            <div class="info-item">
              <p class="info-label">Active Sessions</p>
              <p class="info-value">847</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import {
  Settings,
  Crown,
  LogOut,
  ChevronRight,
  Lock
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const isAllowed = computed(() => authStore.isAdmin)

// onMounted(() => {
//   if (!isAllowed.value) {
//     router.push('/dashboard')
//   }
// })

const settings = ref({
  twoFactorAuth: true,
  emailNotifications: true,
  apiAccess: false,
  auditLogging: true,
  sessionTimeout: 30
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const handleSettingChange = () => {
  console.log('Settings changed:', settings.value)
}

const handleSave = () => {
  // Simulate save
  alert('Settings saved successfully!')
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/main.scss';

.access-denied-page {
  background: linear-gradient(135deg, #f5f7ff 0%, #ffffff 50%, #faf5ff 100%); // Assuming gradient-bg mixin expands to this
  min-height: 100vh;
  @include flex-center;
  padding: 16px;

  .access-denied-card {
    @include card;
    max-width: 500px;
    text-align: center;
    padding: 32px;

    .denied-icon {
      @include flex-center;
      width: 80px;
      height: 80px;
      background: rgba(#f56565, 0.1);
      border-radius: 50%;
      margin: 0 auto 16px;
      color: #f56565;
    }

    h2 {
      font-size: 2rem;
      margin-bottom: 8px;
    }

    p {
      color: #718096;
      margin-bottom: 24px;
    }

    .btn-primary {
      @include button-primary;
    }
  }
}

.settings-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
}

.settings-header {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  .container {
    padding: 16px;
  }

  .header-content {
    @include flex-between;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .btn-back {
      @include flex-center;
      width: 40px;
      height: 40px;
      background: transparent;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      color: #718096;
      transition: all 0.2s;

      &:hover {
        background: #edf2f7;
      }

      .icon-rotate {
        transform: rotate(180deg);
      }
    }

    .logo {
      @include flex-center;
      width: 40px;
      height: 40px; // Assuming $secondary is #764ba2
      background: linear-gradient(135deg, #764ba2, #ec4899);
      border-radius: 8px;
      color: #ffffff;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    .header-title {
      h1 {
        font-size: 1.5rem;
        margin: 0;
      }

      p {
        font-size: 0.875rem;
        color: #718096;
        margin: 0;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: $spacing-md;

    .user-info {
      display: flex;
      align-items: center;
      gap: $spacing-md;

      .user-details {
        text-align: right;

        .user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: $gray-900;
          margin: 0;
        }

        .user-role {
          font-size: 0.75rem;
          color: $gray-600;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 4px;
          margin: 0;
        }
      }

      .user-avatar {
        @include flex-center;
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, $secondary, #ec4899);
        border-radius: 50%;
        font-size: 1.25rem;
        box-shadow: $shadow-lg;
      }
    }

    .btn-icon {
      @include flex-center;
      width: 40px;
      height: 40px;
      background: transparent;
      border: none;
      border-radius: $radius-md;
      cursor: pointer;
      color: $gray-600;
      transition: all $transition-fast;

      &:hover {
        background: $gray-100;
      }
    }
  }
}

.settings-main {
  padding: $spacing-xl 0;

  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 $spacing-md;
  }
}

.settings-card {
  @include card;
  padding: $spacing-xl;
  margin-bottom: $spacing-xl;

  .settings-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 $spacing-lg 0;
  }
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md;
  border: 1px solid $gray-200;
  border-radius: $radius-md;
  transition: all $transition-fast;

  &:hover {
    background: $gray-50;
  }

  &.setting-full {
    flex-direction: column;
    align-items: stretch;
  }

  .setting-info {
    h3 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 4px 0;
    }

    p {
      font-size: 0.875rem;
      color: #718096;
      margin: 0;
    }
  }

  .slider-container {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 16px;

    .range-slider {
      flex: 1;
      height: 8px;
      background: #e2e8f0; // $gray-200
      border-radius: 9999px;
      outline: none;
      appearance: none;
      cursor: pointer;

      &::-webkit-slider-thumb {
        appearance: none;
        width: 20px;
        height: 20px;
        background: #667eea; // $primary
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          transform: scale(1.2);
        }
      }

      &::-moz-range-thumb {
        width: 20px;
        height: 20px;
        background: #667eea; // $primary
        border-radius: 50%;
        cursor: pointer;
        border: none;
        transition: all 0.2s;

        &:hover {
          transform: scale(1.2);
        }
      }
    }

    .slider-value {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1a202c; // $gray-900
      min-width: 70px;
      text-align: right;
    }
  }
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 56px;
  height: 32px;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .toggle-slider {
      background: #667eea; // $primary

      &:before {
        transform: translateX(24px);
      }
    }

    &:focus + .toggle-slider {
      box-shadow: 0 0 0 4px rgba(#667eea, 0.2); // $primary
    }
  }

  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #cbd5e0; // $gray-300
    border-radius: 9999px;
    transition: all 0.2s; // $transition-fast

    &:before {
      content: '';
      position: absolute;
      height: 24px;
      width: 24px;
      left: 4px;
      bottom: 4px;
      background: #ffffff; // $white
      border-radius: 50%;
      transition: all 0.2s; // $transition-fast
    }
  }
}

.settings-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 32px; // $spacing-xl
  gap: 16px; // $spacing-md
}

</style>