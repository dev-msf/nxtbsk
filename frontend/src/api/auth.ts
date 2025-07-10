import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface LoginResponse {
  token: string;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const res = await axios.post<LoginResponse>(`${API_URL}/auth/login`, { username, password });
  localStorage.setItem('token', res.data.token);
  return res.data;
}

export function logout(): void {
  localStorage.removeItem('token');
}

export function clearToken(): void {
  localStorage.removeItem('token');
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function isAuthenticated(): boolean {
  return !!getToken();
} 