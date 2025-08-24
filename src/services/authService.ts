import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface Role {
  id: number,
  name: string,
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  roleId?: number;
}

export interface AuthResponse {
  id: number;
  name?: string;
  email: string;
  role: Role;
  token: string
}

export const login = (data: LoginData) => api.post<AuthResponse>('/auth/login', data);
export const register = (data: RegisterData) => api.post<AuthResponse>('/auth/register', data);
export const getUser = (id: string) => api.get(`/users/${id}`);
export const getUsers = () => api.get('/users');
export const updateUser = (id: string, data: any) => api.put(`/users/${id}`, data);
export const updateMe = (data: any) => api.put(`/users/me`, data);
export const updatePassword = (data: any) => api.put(`/users/password`, data);
export const deleteUser = (id: string) => api.delete(`/users/${id}`);
