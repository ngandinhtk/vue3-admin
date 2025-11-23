<template>
  <div class="app-layout">
    <!-- Overlay for mobile -->
    <div v-if="sidebarOpen && isMobile" class="sidebar-overlay" @click="toggleSidebar"></div>

    <!-- Sidebar -->
    <aside :class="['sidebar', { 'open': sidebarOpen, 'closed': !sidebarOpen }]">
      <div class="sidebar-header">
        <div class="logo">
          <LayoutDashboard :size="28" />
          <span v-if="sidebarOpen">Admin Panel</span>
        </div>
      </div>
      <nav class="sidebar-nav">
        <button
          :class="['nav-item', { active: isActive('/dashboard') }]"
          @click="navigate('/dashboard')"
        >
          <LayoutDashboard :size="20" />
          <span v-if="sidebarOpen">Dashboard</span>
        </button>

        <button
          v-if="authStore.isAdmin"
          :class="['nav-item', { active: isActive('/admin/settings') }]"
          @click="navigate('/admin/settings')"
        >
          <Settings :size="20" />
          <span v-if="sidebarOpen">Admin Settings</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <button class="nav-item" @click="handleLogout">
          <LogOut :size="20" />
          <span v-if="sidebarOpen">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="main">
      <!-- Header -->
      <header class="header">
        <button class="menu-btn" @click="toggleSidebar">
          <X v-if="sidebarOpen" :size="24" />
          <Menu v-else :size="24" />
        </button>

        <div class="header-right">
          <div class="user-info">
            <div class="user-avatar">
              <User :size="20" />
            </div>
            <div class="user-details">
              <span class="user-name">{{ authStore.currentUser?.name }}</span>
              <span class="user-role">{{ authStore.currentUser?.role }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { 
  LayoutDashboard, Settings, LogOut, Menu, X, User 
} from 'lucide-vue-next';


const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const sidebarOpen = ref(true);

const toggleSidebar = () => {
  // On mobile, always toggle. On desktop, only if not already forced closed.
  if (window.innerWidth <= 768) {
    sidebarOpen.value = !sidebarOpen.value;
  } else {
    sidebarOpen.value = !sidebarOpen.value;
  }
};

const isMobile = computed(() => window.innerWidth <= 768);

const handleResize = () => {
  if (window.innerWidth > 768) {
    // On desktop, keep it open unless manually closed
  } else {
    // On mobile, default to closed
    sidebarOpen.value = false;
  }
};

const navigate = (path: string) => {
  if (window.innerWidth <= 768) {
    sidebarOpen.value = false; // Close sidebar on navigation on mobile
  }
  sidebarOpen.value = !sidebarOpen.value;
  router.push(path);
};

const isActive = (path: string) => {
  return route.path === path;
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize(); // Initial check
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped lang="scss">
.app-layout {
  display: flex;
  height: 100vh;
  background: #f7fafc;
}

// ============ Sidebar ============
.sidebar {
  background: #1a202c;
  width: 260px;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;

  &.closed:not(.open) {
    width: 80px;
  }
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-size: 20px;
  font-weight: 700;
}

.sidebar-nav {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: #a0aec0;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  width: 100%;
  text-align: left;
  font-size: 15px;
  margin-bottom: 4px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

// ============ Main ============
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  background: white;
  padding: 16px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.menu-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #2d3748;
  display: flex;
  align-items: center;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background: #f7fafc;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
  color: #2d3748;
}

.user-role {
  font-size: 12px;
  color: #718096;
  text-transform: capitalize;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;
}

// ============ Responsive ============
@media (max-width: 1024px) {
  .sidebar.closed {
    .logo span,
    .nav-item span {
      display: none;
    }
  }
}

@media (max-width: 768px) {
  .sidebar {
    position: absolute;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 1000;
    transform: translateX(-100%);
    width: 260px; /* Ensure full width on mobile when open */

    &.open {
      transform: translateX(0);
      .logo span,
      .nav-item span {
        display: inline;
      }
    }
  }

  .sidebar-overlay {
    display: block;
  }

  .main-content {
    padding: 20px;
  }

  .user-info {
    display: none;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 12px 16px;
  }
}
</style>