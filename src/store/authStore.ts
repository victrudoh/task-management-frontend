import { defineStore } from 'pinia';
import { updatePassword, type LoginData, type RegisterData } from '@/services/authService';
import { login as apiLogin, register as apiRegister, updateMe } from '@/services/authService';

type User = {
  id: number;
  name?: string;
  email: string;
  roleId?: number;
};

interface AuthState {
  user: User | null;
  token: string | null;
  role: string | null; // You can use a more specific type if you have defined roles
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
    loading: false,
    role: localStorage.getItem('role') || null,
    error: null,
  }),
  actions: {
    async login(payload: LoginData) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiLogin(payload);
        this.token = res.data.token;
        this.user = {id:res.data.id, name: res.data.name, email: res.data.email, roleId: res.data.role?.id};
        this.role = res.data.role?.name; // Assuming the API returns role name
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('role', this.role || ''); // Store role name
      } catch (e: any) {
        this.error = e?.response?.data?.message ?? 'Login failed';
      } finally {
        this.loading = false;
      }
    },
    async register(payload: RegisterData) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiRegister(payload);
        this.token = res.data.token;
        this.user = {id:res.data.id, name: res.data.name, email: res.data.email};
        this.role = res.data.role?.name;
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('role', this.role || ''); // Store role name
      } catch (e: any) {
        this.error = e?.response?.data?.message ?? 'Registration failed';
      } finally {
        this.loading = false;
      }
    },
    async updateMe(payload: any) {
      this.loading = true;
      this.error = null;
      try {
        const res = await updateMe(payload);
        console.log('updateMe res', res.data);
        this.user = {id:res.data.user.id, name: res.data.user.name, email: res.data.user.email, roleId: res.data.user.role?.id};
        this.role = res.data.user.role?.name;
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('role', this.role || ''); // Store role name
      } catch (e: any) {
        this.error = e?.response?.data?.message ?? 'Profile change failed';
      } finally {
        this.loading = false;
      }
    },
    async updatePassword(payload: any) {
      this.loading = true;
      this.error = null;
      try {
        const res = await updatePassword(payload);
        console.log('updatePassword res', res.data);
      } catch (e: any) {
        this.error = e?.response?.data?.message ?? 'Password change failed';
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
    },
  },
});
