import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginResult } from '../types'

interface MockUsers {
  [key: string]: User
}

const MOCK_USERS: MockUsers = {
  admin: {
    email: 'admin@company.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
    avatar: '👑'
  },
  user: {
    email: 'user@company.com',
    password: 'user123',
    role: 'user',
    name: 'Regular User',
    avatar: '👤'
  }
}

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)

  // Load user from localStorage on init
  const storedUser = localStorage.getItem('rbac_user')
  if (storedUser) {
    try {
      currentUser.value = JSON.parse(storedUser) as User
      console.log('✅ User loaded from localStorage:', currentUser.value)
    } catch (error) {
      console.error('❌ Error parsing stored user:', error)
      localStorage.removeItem('rbac_user')
    }
  }

  const isAuthenticated = computed<boolean>(() => !!currentUser.value)
  const isAdmin = computed<boolean>(() => currentUser.value?.role === 'admin')

  function login(email: string, password: string): LoginResult {
    const user = Object.values(MOCK_USERS).find(
      (u) => u.email === email && u.password === password
    )

    if (user) {
      const userData: User = { ...user }
      delete userData.password
      currentUser.value = userData
      localStorage.setItem('rbac_user', JSON.stringify(userData))
      return { success: true }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  function logout(): void {
    currentUser.value = null
    localStorage.removeItem('rbac_user')
  }

  function hasRole(role: 'admin' | 'user'): boolean {
    return currentUser.value?.role === role
  }

  return {
    currentUser,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    hasRole
  }
})