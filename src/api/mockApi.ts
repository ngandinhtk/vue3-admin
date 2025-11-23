import type { LoginResponse, UserData, SlowData } from '../types/index';

/**
 * Custom error class for simulating HTTP errors.
 * This allows for more robust error handling on the client side.
 */
export class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

// ============ Mock API Service ============

class MockAPI {
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Store mock users as a static property for better organization and performance.
  private static mockUsers: { [key: string]: UserData & { password?: string } } = {
    admin: { 
      id: 1, username: 'admin', name: 'Admin User', role: 'Admin', password: 'admin123',
      email: 'admin@example.com', status: 'Active',
    },
    user: { 
      id: 2, username: 'user', name: 'Regular User', role: 'User', password: 'user123',
      email: 'user@example.com', status: 'Active'
    },
    john_doe: {
      id: 3, username: 'john_doe', name: 'John Doe', role: 'User', password: 'password',
      email: 'john@example.com', status: 'Active'
    },
    jane_smith: {
      id: 4, username: 'jane_smith', name: 'Jane Smith', role: 'User', password: 'password',
      email: 'jane@example.com', status: 'Inactive'
    }
  };

  /**
   * POST /api/login
   * Authenticate user and return JWT token
   */
  static async login(username: string, password: string): Promise<LoginResponse> {
    await this.delay(800);

    const user = this.mockUsers[username];

    if (user && user.password === password) {
      return {
        token: `mock_jwt_token_${user.role}_${Date.now()}`, // Generate a unique token
        user: {
          id: user.id, 
          username: user.username,
          name: user.name,
          avatar: null,
          role: user.role
        },
          success: true,
          error: ''
      };
    }

    throw new HttpError('Invalid credentials', 401);
  }

  /**
   * GET /api/users
   * Fetch list of users (requires authentication)
   */
  static async getUsers(token: string): Promise<UserData[]> {
    await this.delay(600);

    // Simulate 401 error for expired/invalid tokens
    if (!token || token.includes('expired')) {
      throw new HttpError('Unauthorized', 401);
    }

    // Return a list of users without their passwords
    return Object.values(this.mockUsers).map(({ password, ...user }) => user as UserData);
  }

  /**
   * GET /api/slow-data
   * Fetch data with 2 second delay (simulates slow API)
   */
  static async getSlowData(token: string): Promise<SlowData> {
    await this.delay(2000); // 2 second delay

    if (!token) {
      throw new HttpError('Unauthorized', 401);
    }

    return {
      metrics: {
        revenue: Math.floor(Math.random() * 100000) + 50000,
        customers: Math.floor(Math.random() * 1000) + 500,
        growth: Math.floor(Math.random() * 50) + 10
      },
      timestamp: new Date().toISOString()
    };
  }
}

export default MockAPI;