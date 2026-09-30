const API_BASE_URL = 'http://localhost:5000/api/auth';

export interface SendOTPPayload {
  email: string;
  name: string;
}

export interface RegisterPayload {
  name: string;
  age: number;
  email: string;
  password: string;
  targetDomain: string;
  otp: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const apiService = {
  // 1. Request Gmail 6-digit OTP
  sendOTP: async (payload: SendOTPPayload) => {
    try {
      const response = await fetch(`${API_BASE_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification OTP');
      }
      return data;
    } catch (err: any) {
      throw err;
    }
  },

  // 2. Register with OTP verification
  register: async (payload: RegisterPayload) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      return data;
    } catch (err: any) {
      throw err;
    }
  },

  // 3. Login
  login: async (payload: LoginPayload) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      return data;
    } catch (err: any) {
      throw err;
    }
  },

  // 4. Save Score & Roadmap to MongoDB
  saveRoadmap: async (payload: { email: string; score: number; level: string; roadmap: any }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/save-roadmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      return data;
    } catch (err: any) {
      console.warn('Backend save roadmap failed fallback to local:', err);
    }
  }
};
