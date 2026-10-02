const AUTH_API_URL = '/api/auth';
const AI_API_URL = '/api/ai';

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
      const response = await fetch(`${AUTH_API_URL}/send-otp`, {
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
      const response = await fetch(`${AUTH_API_URL}/register`, {
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
      const response = await fetch(`${AUTH_API_URL}/login`, {
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
      const response = await fetch(`${AUTH_API_URL}/save-roadmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      return data;
    } catch (err: any) {
      console.warn('Backend save roadmap failed fallback to local:', err);
    }
  },

  // 5. Send AI Chat message to Gemini AI Advisor (A.R.I.A)
  sendAIChatMessage: async (message: string, userContext?: any) => {
    try {
      const response = await fetch(`${AI_API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, userContext }),
      });

      const data = await response.json();
      return data.reply;
    } catch (err: any) {
      console.warn('AI Chat fallback notice:', err);
      return null;
    }
  },

  // 6. Generate AI Roadmap via Gemini AI
  generateAIRoadmap: async (domain: string, score: number, name: string) => {
    try {
      const response = await fetch(`${AI_API_URL}/generate-roadmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, score, name }),
      });

      const data = await response.json();
      return data.roadmap;
    } catch (err: any) {
      console.warn('AI Roadmap fallback notice:', err);
      return null;
    }
  },

  // 7. Evaluate Spoken AI Voice Mock Interview Answer
  evaluateInterviewAnswer: async (domain: string, question: string, candidateAnswer: string) => {
    try {
      const response = await fetch(`${AI_API_URL}/evaluate-interview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, question, candidateAnswer }),
      });

      const data = await response.json();
      return data.evaluation;
    } catch (err: any) {
      console.warn('AI Interview evaluation fallback notice:', err);
      return null;
    }
  }
};
