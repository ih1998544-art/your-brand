import { UserProfile } from '../types';

export interface ServerAuthTestResult {
  testName: string;
  passed: boolean;
  durationMs: number;
  details: string;
}

export interface ServerAuthReport {
  success: boolean;
  allPassed: boolean;
  totalDurationMs: number;
  timestamp: string;
  testsRun: number;
  testsPassed: number;
  tests: ServerAuthTestResult[];
  diagnostics: {
    serverPort: number;
    activeSessions: number;
    registeredUsers: number;
    authMethod: string;
  };
}

class AuthService {
  private tokenKey = 'yb_auth_token';

  public getToken(): string | null {
    try {
      return localStorage.getItem(this.tokenKey);
    } catch {
      return null;
    }
  }

  public setToken(token: string): void {
    try {
      localStorage.setItem(this.tokenKey, token);
    } catch {
      // ignore
    }
  }

  public clearToken(): void {
    try {
      localStorage.removeItem(this.tokenKey);
    } catch {
      // ignore
    }
  }

  // 1. Server Login
  public async login(
    email: string,
    password: string,
    autoRegisterIfNew?: boolean,
    name?: string
  ): Promise<{ success: boolean; user?: UserProfile; token?: string; error?: string; canRegister?: boolean; email?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, autoRegisterIfNew, name }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data?.error || 'Invalid credentials',
          canRegister: !!data?.canRegister,
          email: data?.email,
        };
      }

      if (data.token) {
        this.setToken(data.token);
      }

      return {
        success: true,
        user: { ...data.user, isLoggedIn: true },
        token: data.token,
      };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Server connection error' };
    }
  }

  // 1b. Google Sign-In
  public async googleLogin(profile?: {
    email?: string;
    name?: string;
    picture?: string;
  }): Promise<{ success: boolean; user?: UserProfile; token?: string; error?: string }> {
    try {
      const email = profile?.email || 'sajjad501633@gmail.com';
      const name = profile?.name || 'Sajjad';

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          picture: profile?.picture,
          googleId: `goog_${Date.now()}`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data?.error || 'Google sign-in failed on server' };
      }

      if (data.token) {
        this.setToken(data.token);
      }

      return {
        success: true,
        user: { ...data.user, isLoggedIn: true },
        token: data.token,
      };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Server connection error during Google sign-in' };
    }
  }

  // 2. Server Register
  public async register(
    userData: { email: string; password: string; name: string; phone?: string; address?: string; city?: string }
  ): Promise<{ success: boolean; user?: UserProfile; token?: string; error?: string }> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data?.error || 'Registration failed' };
      }

      if (data.token) {
        this.setToken(data.token);
      }

      return {
        success: true,
        user: { ...data.user, isLoggedIn: true },
        token: data.token,
      };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Server connection error' };
    }
  }

  // 3. Verify Server Session
  public async verifySession(): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    const token = this.getToken();
    if (!token) {
      return { success: false, error: 'No active session token' };
    }

    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        this.clearToken();
        return { success: false, error: 'Session expired or invalid' };
      }

      const data = await res.json();
      if (data.success && data.user) {
        return { success: true, user: { ...data.user, isLoggedIn: true } };
      }

      this.clearToken();
      return { success: false, error: 'User not found' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error verifying session' };
    }
  }

  // 4. Server Logout
  public async logout(): Promise<void> {
    const token = this.getToken();
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch {
        // ignore network error on logout
      }
    }
    this.clearToken();
  }

  // 5. Run Server-Side Auth Diagnostics & Test Suite
  public async runServerAuthTests(): Promise<ServerAuthReport> {
    try {
      const res = await fetch('/api/auth/test');
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      return await res.json();
    } catch (err: any) {
      return {
        success: false,
        allPassed: false,
        totalDurationMs: 0,
        timestamp: new Date().toISOString(),
        testsRun: 0,
        testsPassed: 0,
        tests: [
          {
            testName: 'Server Connection & Health Check',
            passed: false,
            durationMs: 0,
            details: `Failed to connect to /api/auth/test: ${err?.message || 'Connection refused'}`,
          },
        ],
        diagnostics: {
          serverPort: 3000,
          activeSessions: 0,
          registeredUsers: 0,
          authMethod: 'Offline / Unreachable',
        },
      };
    }
  }
}

export const authService = new AuthService();
