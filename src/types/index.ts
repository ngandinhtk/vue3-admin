export interface User {
  email: string
  password?: string
  role: 'admin' | 'user'
  name: string
  avatar: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResult {
  success: boolean
  error?: string
}

export interface Stats {
  totalUsers: number
  activeUsers: number
  pendingRequests: number
  systemHealth: number
}

export interface Activity {
  action: string
  user: string
  time: string
  type: 'success' | 'info' | 'warning' | 'danger'
}

export interface Settings {
  twoFactorAuth: boolean
  emailNotifications: boolean
  apiAccess: boolean
  auditLogging: boolean
  sessionTimeout: number
}

export type StatType = 'primary' | 'success' | 'warning' | 'info'