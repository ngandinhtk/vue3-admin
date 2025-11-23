import type { LoginResponse, UserData, SlowData } from '../types/index';

// ============ Mock API Service ============

class MockAPI {
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * POST /api/login
   * Authenticate user and return JWT token
   */
  static async login(username: string, password: string): Promise<LoginResponse> {
    await this.delay(800);
    
    const mockUsers: { [key: string]: UserData } = {
      admin: { 
        id: 1, username: 'admin', name: 'Admin User', role: 'Admin',
        email: 'admin@example.com', status: 'Active', createdAt: '2024-01-15'
      },
      user: { 
        id: 2, username: 'user', name: 'Regular User', role: 'User',
        email: 'user@example.com', status: 'Active', createdAt: '2024-02-20'
      }
    };

    if ((username === 'admin' && password === 'admin123') || 
        (username === 'user' && password === 'user123')) {
      const user = mockUsers[username];
      if (!user) {
        // This case should ideally not be reached if username matches keys
        throw new Error('User not found after successful password match');
      }
      // Ensure the returned user object is a fresh copy to prevent accidental mutations
      // and matches the expected structure for LoginResponse['user']
      const { password: _, ...userWithoutPassword } = user; // Omit password if it were present
      return {
        token: `mock_jwt_token_${user.role}_${Date.now()}`, // Generate a unique token
        user: userWithoutPassword as LoginResponse['user']
      };
    }

    throw new Error('Invalid credentials');
  }

  /**
   * GET /api/users
   * Fetch list of users (requires authentication)
   */
  static async getUsers(token: string): Promise<UserData[]> {
    await this.delay(600);

    // Simulate 401 error for expired/invalid tokens
    if (!token || token.includes('expired')) {
      throw new Error('401');
    }

    return [
      {
        id: 1,
        username: 'admin',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'Admin',
        status: 'Active',
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        username: 'user',
        name: 'Regular User',
        email: 'user@example.com',
        role: 'User',
        status: 'Active',
        createdAt: '2024-02-20'
      },
      {
        id: 3,
        username: 'john_doe',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'User',
        status: 'Active',
        createdAt: '2024-03-10'
      },
      {
        id: 4,
        username: 'jane_smith',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'User',
        status: 'Inactive',
        createdAt: '2024-04-05'
      }
    ];
  }

  /**
   * GET /api/slow-data
   * Fetch data with 2 second delay (simulates slow API)
   */
  static async getSlowData(token: string): Promise<SlowData> {
    await this.delay(2000); // 2 second delay

    if (!token) {
      throw new Error('401');
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