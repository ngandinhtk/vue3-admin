import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import MockAPI from '../api/mockApi';
import type { LoginResponse, UserData } from '../types';
import type { Router } from 'vue-router';
import { HttpError } from '../api/mockApi';

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

  const logout = (router?: Router): void => {
    // Clear state
    token.value = null;
    currentUser.value = null;
    usersList.value = [];

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');

    // Redirect to login page if router is provided
    if (router) {
      router.push({ name: 'Login' });
    }
  };

  const fetchUsers = async (router: Router): Promise<UserData[]> => {
    try {
      if (!token.value) throw new Error('401');

      const users = await MockAPI.getUsers(token.value);
      usersList.value = users;
    } catch (error) {
      // Check for 401 Unauthorized error
      if (error instanceof HttpError && error.status === 401) {
        logout(router); 
        throw new Error('Session expired. Please log in again.');
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