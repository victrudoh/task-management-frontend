<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore, type Notification } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';

const open = ref(false);
const nStore = useNotificationStore();
const auth = useAuthStore();
const router = useRouter();

onMounted(async () => {
  if (auth.token) {
    await nStore.fetchAll();
    nStore.connectSocket();
  }
});

watch(
  () => auth.token,
  async (t) => {
    if (t) {
      await nStore.fetchAll();
      nStore.connectSocket();
    } else {
      nStore.disconnectSocket();
      nStore.items = [];
    }
  }
);

function toggle() { open.value = !open.value; }

function buildRouteForNotification(n: Notification) {
  if ((n as any).meta?.route) return (n as any).meta.route;
  switch (n.type) {
    case 'task': return { path: '/dashboard/tasks', query: { taskId: n.entity_id, open: 'view' } };
    case 'user': return { path: '/dashboard/users', query: { userId: n.entity_id } };
    case 'role': return { path: '/dashboard/roles'};
    default: return { path: '/dashboard/home' };
  }
}

async function onClickItem(n: Notification) {
  if (!n.seen_at) await nStore.markSeen(n.id);
  open.value = false;
  router.push(buildRouteForNotification(n));
}

async function markAll() {
  if (!nStore.unreadCount) return;
  await nStore.markAllSeen();
}
</script>

<template>
  <div class="relative">
    <button class="relative rounded p-2 hover:bg-black/5" @click="toggle" aria-label="Notifications">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
      <span v-if="nStore.unreadCount"
            class="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] h-4 min-w-4 px-1">
        {{ nStore.unreadCount }}
      </span>
    </button>

    <div v-if="open" class="absolute right-0 mt-2 w-96 rounded-lg border bg-white shadow-lg z-50">
      <div class="flex items-center justify-between p-3 border-b">
        <div class="font-semibold">Notifications</div>
        <button
          class="text-xs rounded px-2 py-1 border hover:bg-black/5 disabled:opacity-40"
          :disabled="!nStore.unreadCount"
          @click.stop="markAll"
          title="Mark all as read"
        >
          Mark all as read
        </button>
      </div>

      <ul class="max-h-80 overflow-y-auto">
        <li v-for="n in nStore.items"
            :key="n.id"
            @click="onClickItem(n)"
            class="p-3 hover:bg-black/5 cursor-pointer"
            :class="!n.seen_at ? 'bg-blue-50' : ''">
          <div class="text-sm font-medium">{{ n.title }}</div>
          <div class="text-xs text-gray-600" v-if="n.body">{{ n.body }}</div>
          <div class="text-[10px] text-gray-400 mt-1">{{ new Date(n.createdAt).toLocaleString() }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>
