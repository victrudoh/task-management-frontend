<template>
  <div class="flex items-center justify-between bg-white shadow p-4">
    <input
      type="text"
      placeholder="Search..."
      class="border rounded px-3 py-1 w-1/3"
    />

    <div class="flex items-center space-x-10">
        <div class="flex justify-center items-center space-x-1">
            <img
            :src="avatarUrl"
            alt="User Avatar"
            class="w-7 h-7 rounded-full border border-gray-300 object-cover"
            />
            <span class="text-gray-700 font-medium">{{ userName }}</span>
        </div>
        <button @click="logout" class="bg-blue-500 text-white px-3 py-1 rounded">
            Logout
        </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/store/authStore';

const authStore = useAuthStore();
const userName = ref('User');
const avatarUrl = ref('https://i.pravatar.cc/40'); // placeholder

onMounted(() => {
  const user = JSON.stringify(authStore.user);
  console.log('user', user);
  if (user) {
    const parsed = JSON.parse(user);
    userName.value = parsed?.name || 'User';
    avatarUrl.value = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userName.value)
  }
});

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};
</script>
