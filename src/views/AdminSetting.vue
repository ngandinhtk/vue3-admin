<template>
  <MainLayout>
    <ProgressBar :loading="loading" />
    
    <div class="content">
      <div class="page-header">
        <h1>Admin Settings</h1>
        <div class="breadcrumb">
          <span>Home</span>
          <ChevronRight :size="16" />
          <span>Admin</span>
          <ChevronRight :size="16" />
          <span>Settings</span>
        </div>
      </div>

      <div v-if="error" class="alert alert-error">
        <AlertCircle :size="18" />
        {{ error }}
      </div>


         <!-- User Management -->
        <div class="card">
          <div class="card-header">
            <h2>User Management</h2>
            <button class="btn btn-primary btn-sm" @click="loadUsers" :disabled="loading">
              <Loader v-if="loading" class="spinner" :size="16" />
              {{ loading ? 'Loading...' : 'Refresh' }}
            </button>
          </div>
          <div class="card-body">
            <SkeletonTable v-if="loading && authStore.usersList.length === 0" :rows="4" />
            
            <div v-else class="user-table">
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in authStore.usersList" :key="user.id">
                    <td>{{ user.username }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>
                      <span :class="`badge badge-${user.role.toLowerCase()}`">
                        {{ user.role }}
                      </span>
                    </td>
                    <td>
                      <span :class="`badge badge-${user.status.toLowerCase()}`">
                        {{ user.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      <div class="settings-grid">
        <!-- System Configuration -->
        <div class="card">
          <div class="card-header">
            <h2>System Configuration</h2>
          </div>
          <div class="card-body">
            <div class="settings-list">
              <div class="setting-item">
                <div>
                  <h4>Two-Factor Authentication</h4>
                  <p>Require 2FA for all admin accounts</p>
                </div>
                <label class="toggle">
                  <input type="checkbox" checked />
                  <span class="toggle-slider"></span>
                </label>
              </div>

              <div class="setting-item">
                <div>
                  <h4>Email Notifications</h4>
                  <p>Send email alerts for critical events</p>
                </div>
                <label class="toggle">
                  <input type="checkbox" checked />
                  <span class="toggle-slider"></span>
                </label>
              </div>

              <div class="setting-item">
                <div>
                  <h4>Auto Backup</h4>
                  <p>Automatically backup database daily</p>
                </div>
                <label class="toggle">
                  <input type="checkbox" checked />
                  <span class="toggle-slider"></span>
                </label>
              </div>

              <div class="setting-item">
                <div>
                  <h4>Maintenance Mode</h4>
                  <p>Enable maintenance mode for updates</p>
                </div>
                <label class="toggle">
                  <input type="checkbox" />
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

     
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import MainLayout from './MainLayout.vue';
import ProgressBar from '../components/ProgressBar.vue';
import SkeletonTable from '../components/SkeletonTable.vue';
import { ChevronRight, AlertCircle, Loader } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const error = ref('');

const loadUsers = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    await authStore.fetchUsers(router);
  } catch (err) {
    error.value = (err as Error).message;
    
    if ((err as Error).message.includes('Session expired')) {
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (authStore.usersList.length === 0) {
    loadUsers();
  }
});
</script>

<style scoped lang="scss">
.content {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;

  h1 {
    font-size: 32px;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 8px;
  }
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #718096;
  font-size: 14px;
}

.settings-grid {
  display: grid;
  gap: 24px;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f7fafc;
  border-radius: 10px;

  h4 {
    font-size: 15px;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 4px;
  }

  p {
    font-size: 13px;
    color: #718096;
  }
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 24px;
  }

  .user-table {
    font-size: 12px;

    th,
    td {
      padding: 8px;
    }
  }
}
</style>