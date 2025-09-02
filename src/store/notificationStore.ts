import { defineStore } from 'pinia';
import { io, Socket } from 'socket.io-client';
import api from '@/services/api';
import { useAuthStore } from '@/store/authStore';

export type Notification = {
  id: number;
  user_id: number;
  title: string;
  body?: string;
  type: 'user' | 'task' | 'role' | 'system';
  action: 'created' | 'updated' | 'deleted' | 'registered' | 'details_updated';
  entity_type?: string | null;
  entity_id?: number | null;
  seen_at?: string | null;
  createdAt: string;
  updatedAt: string;
};

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    items: [] as Notification[],
    socket: null as Socket | null,
    isConnected: false,
  }),
  getters: {
    unreadCount: (s) => s.items.filter((n) => !n.seen_at).length,
  },
  actions: {
    async fetchAll() {
      const res = await api.get<Notification[]>('/notifications');
      this.items = res.data;
    },
    async markSeen(id: number) {
      await api.put(`/notifications/${id}/seen`);
      const idx = this.items.findIndex((n) => n.id === id);
      if (idx >= 0) this.items[idx].seen_at = new Date().toISOString();
    },
    async markAllSeen() {
      await api.put('/notifications/seen/all');
      const ts = new Date().toISOString();
      for (const n of this.items) {
        if (!n.seen_at) n.seen_at = ts;
      }
    },
    connectSocket() {
      if (this.socket) return;
      const auth = useAuthStore();
      const wsBase =
        (import.meta.env.VITE_WS_URL as string) ||
        (import.meta.env.VITE_API_URL as string) ||
        'http://localhost:5000';
      this.socket = io(wsBase, {
        transports: ['websocket'],
        path: '/socket.io',
        auth: { token: auth.token },
        reconnection: true,
      });
      this.socket.on('connect', () => { this.isConnected = true; });
      this.socket.on('disconnect', () => { this.isConnected = false; });
      this.socket.on('notification:new', (n: Notification) => {
        this.items.unshift(n);
      });
    },
    disconnectSocket() {
      this.socket?.disconnect();
      this.socket = null;
      this.isConnected = false;
    },
  },
});
