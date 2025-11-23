<template>
  <MainLayout>
    <ProgressBar :loading="slowDataLoading" />
    
    <div class="content">
      <div class="page-header">
        <h1>Dashboard</h1>
        <div class="breadcrumb">
          <span>Home</span>
          <ChevronRight :size="16" />
          <span>Dashboard</span>
        </div>
      </div>

      <div v-if="authStore.isAdmin" class="admin-banner">
        <AlertCircle :size="20" />
        <span>You have admin privileges</span>
        <button class="btn btn-primary btn-sm" @click="loadSlowData" :disabled="slowDataLoading">
          <Loader v-if="slowDataLoading" class="spinner" :size="16" />
          {{ slowDataLoading ? 'Loading...' : 'Load Advanced Metrics' }}
        </button>
      </div>

      <div v-if="slowDataLoading" class="stats-grid">
        <SkeletonCard v-for="i in 4" :key="i" />
      </div>

      <div v-else-if="slowData" class="stats-grid">
        <div class="stat-card stat-success">
          <div class="stat-icon"><LayoutDashboard /></div>
          <div class="stat-content">
            <h3>Revenue</h3>
            <p class="stat-value">${{ slowData.metrics.revenue.toLocaleString() }}</p>
            <span class="stat-change positive">+{{ slowData.metrics.growth }}%</span>
          </div>
        </div>

        <div class="stat-card stat-info">
          <div class="stat-icon"><User /></div>
          <div class="stat-content">
            <h3>Customers</h3>
            <p class="stat-value">{{ slowData.metrics.customers.toLocaleString() }}</p>
            <span class="stat-change positive">+12.5%</span>
          </div>
        </div>

        <div class="stat-card stat-warning">
          <div class="stat-icon"><Settings /></div>
          <div class="stat-content">
            <h3>Growth Rate</h3>
            <p class="stat-value">{{ slowData.metrics.growth }}%</p>
            <span class="stat-change positive">Trending</span>
          </div>
        </div>

        <div class="stat-card stat-primary">
          <div class="stat-icon"><Lock /></div>
          <div class="stat-content">
            <h3>Last Updated</h3>
            <p class="stat-value">{{ formatTime(slowData.timestamp) }}</p>
            <span class="stat-change">Real-time</span>
          </div>
        </div>
      </div>

      <div v-else class="stats-grid">
        <div class="stat-card stat-primary">
          <div class="stat-icon"><User /></div>
          <div class="stat-content">
            <h3>Total Users</h3>
            <p class="stat-value">1,234</p>
            <span class="stat-change positive">+12.5%</span>
          </div>
        </div>

        <div class="stat-card stat-success">
          <div class="stat-icon"><LayoutDashboard /></div>
          <div class="stat-content">
            <h3>Active Sessions</h3>
            <p class="stat-value">856</p>
            <span class="stat-change positive">+8.2%</span>
          </div>
        </div>

        <div class="stat-card stat-warning">
          <div class="stat-icon"><Settings /></div>
          <div class="stat-content">
            <h3>Pending Tasks</h3>
            <p class="stat-value">42</p>
            <span class="stat-change negative">-3.1%</span>
          </div>
        </div>

        <div class="stat-card stat-info">
          <div class="stat-icon"><Lock /></div>
          <div class="stat-content">
            <h3>Security Score</h3>
            <p class="stat-value">98%</p>
            <span class="stat-change positive">+2.0%</span>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <div class="card">
          <div class="card-header">
            <h2>Recent Activity</h2>
          </div>
          <div class="card-body">
            <div class="activity-list">
              <div v-for="(activity, idx) in activities" :key="idx" class="activity-item">
                <div :class="`activity-badge ${activity.type}`"></div>
                <div class="activity-content">
                  <p>{{ activity.action }}</p>
                  <span>{{ activity.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div class="card-body">
            <div class="quick-actions">
              <button class="action-btn">
                <User :size="20" />
                <span>Add User</span>
              </button>
              <button class="action-btn" @click="$router.push('/admin/settings')">
                <Settings :size="20" />
                <span>Settings</span>
              </button>
              <button class="action-btn">
                <LayoutDashboard :size="20" />
                <span>Reports</span>
              </button>
              <button class="action-btn">
                <Lock :size="20" />
                <span>Security</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<!-- Script and styles in next part -->
 <!-- Thêm vào file DashboardView.vue sau template -->

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import MockAPI from '../api/mockApi';
import type { SlowData } from '../types';
import MainLayout from '../views/MainLayout.vue';
import ProgressBar from '../components/ProgressBar.vue';
import SkeletonCard from '../components/SkeletonCard.vue';
import { 
  User, Lock, LayoutDashboard, Settings, ChevronRight, 
  AlertCircle, Loader 
} from 'lucide-vue-next';

const authStore = useAuthStore();

const slowDataLoading = ref(false);
const slowData = ref<SlowData | null>(null);

const activities = [
  { action: 'New user registered', time: '2 minutes ago', type: 'success' },
  { action: 'System backup completed', time: '1 hour ago', type: 'info' },
  { action: 'Failed login attempt', time: '3 hours ago', type: 'warning' },
  { action: 'Database updated', time: '5 hours ago', type: 'success' }
];

const loadSlowData = async () => {
  // Ensure user is logged in and token is available before making the API call
  if (!authStore.isLoggedIn || !authStore.token) {
    console.warn('Cannot load slow data: User is not logged in or token is missing.');
    return;
  }
  
  slowDataLoading.value = true;
  
  try {
    const data = await MockAPI.getSlowData(authStore.token);
    slowData.value = data;
  } catch (err) {
    if ((err as Error).message === '401') {
      authStore.logout();
    }
  } finally {
    slowDataLoading.value = false;
  }
};

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString();
};
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

.admin-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  span {
    flex: 1;
    font-weight: 500;
  }
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.activity-badge {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;

  &.success {
    background: #48bb78;
  }
  &.info {
    background: #4299e1;
  }
  &.warning {
    background: #ed8936;
  }
}

.activity-content p {
  font-size: 14px;
  color: #2d3748;
  margin-bottom: 4px;
}

.activity-content span {
  font-size: 12px;
  color: #a0aec0;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.action-btn {
  padding: 16px;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: #2d3748;
  font-weight: 500;

  &:hover {
    background: #edf2f7;
    border-color: #cbd5e0;
    transform: translateY(-2px);
  }
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 24px;
  }

  .admin-banner {
    flex-direction: column;
    align-items: flex-start;

    .btn {
      width: 100%;
    }
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }
}
</style>