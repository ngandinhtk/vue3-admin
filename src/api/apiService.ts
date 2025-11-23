import MockAPI, { HttpError } from './mockApi';
import { useAuthStore } from '../stores/auth';
import router from '../router';

export async function callApi<T>(apiCall: () => Promise<T>): Promise<T> {
  try {
    // Execute the provided API call
    const result = await apiCall();
    return result;
  } catch (error) {
    // Check if the error is an HttpError with status 401
    if (error instanceof HttpError && error.status === 401) {
      console.error('Unauthorized! Token might be expired. Logging out...');
            const authStore = useAuthStore();
      authStore.logout();
      router.push('/login');
    }
    throw error;
  }
}

// Export specific API methods wrapped with the error handler
export const getUsers = () => callApi(() => MockAPI.getUsers(useAuthStore().token || ''));
export const getSlowData = () => callApi(() => MockAPI.getSlowData(useAuthStore().token || ''));