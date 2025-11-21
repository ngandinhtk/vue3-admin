<template>
  <div class="dashboard-page">
    <header class="dashboard-header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <div class="logo">
              <Shield :size="24" />
            </div>
            <div class="header-title">
              <h1>RBAC Dashboard</h1>
              <p>Role-Based Access Control</p>
            </div>
          </div>

          <div class="header-right">
            <div class="user-info">
              <div class="user-details">
                <p class="user-name">{{ authStore.currentUser?.name }}</p>
                <p class="user-role">
                  <Crown v-if="authStore.isAdmin" :size="12" />
                  <User v-else :size="12" />
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

    <main class="dashboard-main">
      <div class="container">
        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card stat-primary">
            <div class="stat-header">
              <div class="stat-icon">
                <Users :size="24" />
              </div>
              <span class="stat-badge">+12%</span>
            </div>
            <h3 class="stat-value">{{ stats.totalUsers }}</h3>
            <p class="stat-label">Total Users</p>
          </div>

          <div class="stat-card stat-success">
            <div class="stat-header">
              <div class="stat-icon">
                <UserCheck :size="24" />
              </div>
              <span class="stat-badge">+8%</span>
            </div>
            <h3 class="stat-value">{{ stats.activeUsers }}</h3>
            <p class="stat-label">Active Users</p>
          </div>

          <div class="stat-card stat-warning">
            <div class="stat-header">
              <div class="stat-icon">
                <Lock :size="24" />
              </div>
              <span class="stat-badge">{{ stats.pendingRequests }}</span>
            </div>
            <h3 class="stat-value">{{ stats.pendingRequests }}</h3>
            <p class="stat-label">Pending Requests</p>
          </div>

          <div class="stat-card stat-info">
            <div class="stat-header">
              <div class="stat-icon">
                <Activity :size="24" />
              </div>
              <span class="stat-badge">Healthy</span>
            </div>
            <h3 class="stat-value">{{ stats.systemHealth }}%</h3>
            <p class="stat-label">System Health</p>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="section-card">
          <h2 class="section-title">Quick Actions</h2>
          <div class="actions-grid">
            <button class="action-card">
              <div class="action-content">
                <div class="action-icon">
                  <Users :size="20" />
                </div>
                <div class="action-text">
                  <p class="action-title">Manage Users</p>
                  <p class="action-description">View and edit user accounts</p>
                </div>
              </div>
              <ChevronRight :size="20" class="action-arrow" />
            </button>

            <button
              @click="navigateToSettings"
              :disabled="!authStore.isAdmin"
              :class="['action-card', { 'action-disabled': !authStore.isAdmin }]"
            >
              <div class="action-content">
                <div class="action-icon">
                  <Settings :size="20" />
                </div>
                <div class="action-text">
                  <p class="action-title">Admin Settings</p>
                  <p class="action-description">
                    {{ authStore.isAdmin ? 'Configure system settings' : 'Admin access required' }}
                  </p>
                </div>
              </div>
              <ChevronRight v-if="authStore.isAdmin" :size="20" class="action-arrow" />
              <Lock v-else :size="20" class="action-lock" />
            </button>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="section-card">
          <h2 class="section-title">Recent Activity</h2>
          <div class="activity-list">
            <div
              v-for="(activity, idx) in activities"
              :key="idx"
              class="activity-item"
            >
              <div class="activity-content">
                <div :class="['activity-dot', `activity-${activity.type}`]"></div>
                <div class="activity-info">
                  <p class="activity-action">{{ activity.action }}</p>
                  <p class="activity-user">{{ activity.user }}</p>
                </div>
              </div>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import type { Stats, Activity } from '../types/index'
import {
  Shield,
  Users,
  UserCheck,
  Lock,
  // Activity as ActivityIcon,
  Crown,
  User,
  LogOut,
  Settings,
  ChevronRight
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const stats = ref<Stats>({
  totalUsers: 1247,
  activeUsers: 892,
  pendingRequests: 23,
  systemHealth: 98
})

const activities = ref<Activity[]>([
  {
    action: 'User login',
    user: 'john.doe@company.com',
    time: '2 minutes ago',
    type: 'success'
  },
  {
    action: 'Permission updated',
    user: 'jane.smith@company.com',
    time: '15 minutes ago',
    type: 'info'
  },
  {
    action: 'Failed login attempt',
    user: 'unknown@email.com',
    time: '1 hour ago',
    type: 'warning'
  },
  {
    action: 'New user created',
    user: 'mike.wilson@company.com',
    time: '2 hours ago',
    type: 'success'
  }
])

const handleLogout = (): void => {
  authStore.logout()
  router.push('/login')
}

const navigateToSettings = (): void => {
  if (authStore.isAdmin) {
    router.push('/admin/settings')
  }
}
</script>

<style lang="scss" scoped src="../assets/styles/main.scss"></style>