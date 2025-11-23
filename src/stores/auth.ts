// import { defineStore } from 'pinia'
// import { ref, computed } from 'vue'
// import { useRouter } from 'vue-router'
// import type { UserData, LoginResponse } from '../types'

// interface MockUsers {
//   [key: string]: UserData
// }

// const MOCK_USERS: MockUsers = {
//   admin: {
//     email: 'admin@company.com',
//     password: 'admin123',
//     role: 'Admin',
//     name: 'Admin User',
//     avatar: '👑',
//     status: 'Active',
//     createdAt: '2023-01-01',
//     id: 1,
//     username: 'admin',
//     token: 'admin-token-xyz'
//   },
//   user: {
//     email: 'user@company.com',
//     password: 'user123',
//     role: 'User',
//     name: 'Regular User',
//     avatar: '👤',
//     status: 'Active',
//     createdAt: '2023-01-02',
//     id: 2,
//     username: 'user',
//     token: 'user-token-abc'
    
//   }
// }

// export const useAuthStore = defineStore('auth', () => {
//   const router = useRouter()
//   const currentUser = ref<UserData | null>(null)

//   // Load user from localStorage on init
//   const storedUser = localStorage.getItem('rbac_user')
//   if (storedUser) {
//     try {
//       currentUser.value = JSON.parse(storedUser) as UserData
//       console.log('✅ User loaded from localStorage:', currentUser.value)
//     } catch (error) {
//       console.error('❌ Error parsing stored user:', error)
//       localStorage.removeItem('rbac_user')
//     }
//   }

//   const isAuthenticated = computed<boolean>(() => !!currentUser.value)
//   const isAdmin = computed<boolean>(() => currentUser.value?.role === 'Admin')

//   function login(email: string, password: string): LoginResponse {
//     const user = Object.values(MOCK_USERS).find(
//       (u) => u.email === email && u.password === password
//     )

//     if (user) {
//       const userData: UserData = { ...user }
//       delete (userData as any).password
//       currentUser.value = userData
//       localStorage.setItem('rbac_user', JSON.stringify(userData))
//       router.push('/dashboard')
//       console.log(user);
//       return { success: true, token: '', error: '', user: userData }
      
//     }
//     return {  token: '', success: false, error: 'Invalid credentials', user: null! }
//   }
//   function fetchUsers(): Omit<UserData, 'password'>[] {
//     return Object.values(MOCK_USERS).map((user) => {
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//       const { password, ...userWithoutPassword } = user
//       return userWithoutPassword
//     })
//   }
//   function logout(): void {
//     currentUser.value = null
//     localStorage.removeItem('rbac_user')
//     router.push('/login')
//   }

//   function hasRole(role: 'Admin' | 'User'): boolean {
//     return currentUser.value?.role === role
//   }

//   return {
//     currentUser,
//     isAuthenticated,
//     isAdmin,
//     login,
//     fetchUsers,
//     logout,
//     hasRole
//   }
// })



import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import MockAPI from '../api/mockApi';
import type { LoginResponse, UserData } from '../types';

// ============ Pinia Auth Store ============

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(null);
  const currentUser = ref<LoginResponse['user'] | null>(null);
  const usersList = ref<UserData[]>([]);

  // Getters
  const isLoggedIn = computed(() => !!token.value);
  const userRole = computed(() => currentUser.value?.role || null);
  const isAdmin = computed(() => userRole.value === 'Admin');

  // Actions
  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await MockAPI.login(username, password);
      
      // Save to state
      token.value = response.token;
      currentUser.value = response.user;
      
      // Persist to localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
    } catch (error) {
      throw error;
    }
  };

  const logout = (): void => {
    // Clear state
    token.value = null;
    currentUser.value = null;
    usersList.value = [];
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  };

  const fetchUsers = async (): Promise<UserData[]> => {
    try {
      if (!token.value) throw new Error('401');
      
      const users = await MockAPI.getUsers(token.value);
      usersList.value = users;
    } catch (error) {
      if ((error as Error).message === '401') {
        logout();
        throw new Error('Session expired. Please login again.');
      }
      throw error;
    }
    return usersList.value;
  };

  const initializeAuth = (): void => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedToken && savedUser) {
      token.value = savedToken;
      currentUser.value = JSON.parse(savedUser);
    }
  };

  return {
    // State
    token,
    currentUser,
    usersList,
    
    // Getters
    isLoggedIn,
    userRole,
    isAdmin,
    
    // Actions
    login,
    logout,
    fetchUsers,
    initializeAuth
  };
});