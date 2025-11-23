// ============ TypeScript Interfaces ============

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    name: string;
    avatar: any;
    role: 'Admin' | 'User';
  };
  success: boolean;
  error: string
}

export interface UserData {
  id: number;
  username: string;
  name: string;
  password: string;
  email: string;
  role: 'Admin' | 'User';
  status: 'Active' | 'Inactive';

}

export interface SlowData {
  metrics: {
    revenue: number;
    customers: number;
    growth: number;
  };
  timestamp: string;
}

export interface AppState {
  isLoggedIn: boolean;
  userRole: 'Admin' | 'User' | null;
  currentUser: LoginResponse['user'] | null;
  usersList: UserData[];
  token: string | null;
}

export type UserRole = 'Admin' | 'User';