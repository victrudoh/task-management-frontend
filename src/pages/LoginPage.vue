<template>
    <!-- Hero Section -->
    <section class="text-center py-10 bg-white shadow-sm">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-800">
        Task Management Made Simple
      </h1>
      <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        Organize, assign, and track tasks efficiently with our easy-to-use platform.
      </p>
      <div class="mt-5 flex justify-center space-x-4 text-sm">
        <router-link to="/">
            <button class="border p-2 px-5 rounded-sm text-blue-500 bg-white cursor-pointer">Home</button>
        </router-link>
        <router-link to="/register">
            <button class="border p-2 px-5 rounded-sm bg-blue-500 text-white cursor-pointer">Signup</button>
        </router-link>
      </div>
    </section>
    <div class="max-w-sm mx-auto mt-20 p-6 border rounded-lg bg-white">
        <h1 class="text-xl font-bold mb-4">Login</h1>

        <form @submit.prevent="handleLogin">
        <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="w-full border p-2 mb-3 rounded"
            required
        />
        <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full border p-2 mb-3 rounded"
            required
        />
        <button
            type="submit"
            class="w-full bg-blue-600 text-white p-2 rounded"
            :disabled="auth.loading"
        >
            {{ auth.loading ? 'Logging in...' : 'Login' }}
        </button>
        <p v-if="auth.error" class="text-red-500 mt-2">{{ auth.error }}</p>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');

async function handleLogin() {
  await auth.login({ email: email.value, password: password.value });
  if (auth.token) router.push({ name: 'Dashboard' });
}
</script>
