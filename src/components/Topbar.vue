<template>
  <div class="flex items-center justify-between bg-white shadow p-4">
    <input
      v-model="searchQuery"
      @input="emitSearch"
      type="text"
      placeholder="Search..."
      class="border rounded px-3 py-1 w-1/3"
    />

    <div class="flex items-center space-x-10">
      <div class="flex justify-center items-center space-x-2">
        <img
          :src="avatarUrl"
          alt="User Avatar"
          class="w-7 h-7 rounded-full border border-gray-300 object-cover"
        />
        <div class="flex flex-col items-start border-l border-gray-300 pl-2">
          <span class="text-gray-700 font-medium text-[11px]">{{ userName }}</span>
          <span class="text-gray-700 font-bold text-[10px] underline underline-offset-1">{{ authStore.role }}</span>
        </div>
      </div>
      <button @click="logout" class="bg-blue-500 text-white px-3 py-1 rounded">
        Logout
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/authStore';

const authStore = useAuthStore();
const userName = ref('User');
const avatarUrl = ref('https://i.pravatar.cc/40'); // placeholder
const searchQuery = ref('');

// emit to parent
const emit = defineEmits(['search']);
const emitSearch = () => emit('search', searchQuery.value);

// ✅ clear on route change
const route = useRoute();
watch(
  () => route.fullPath,
  () => {
    if (searchQuery.value) {
      searchQuery.value = '';
      emitSearch(); // send "" to parent so results reset
    }
  }
);

onMounted(() => {
  const user = JSON.stringify(authStore.user);
  if (user) {
    const parsed = JSON.parse(user);
    userName.value = parsed?.name || 'User';
    avatarUrl.value = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userName.value);
  }
});

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};
</script>
