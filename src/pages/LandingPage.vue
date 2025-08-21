<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="text-center py-10 bg-white shadow-sm">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-800">
        Task Management Made Simple
      </h1>
      <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        Organize, assign, and track tasks efficiently with our easy-to-use platform.
      </p>

      <!-- If logged in -->
      <div v-if="isLoggedIn" class="mt-5 text-sm">
        <div class="flex justify-center items-center space-x-1">
            <img
          :src="userAvatar"
          alt="User Avatar"
          class="w-7 h-7 rounded-full border border-gray-300 object-cover"
        />
        <span class="text-gray-700 font-medium">{{ userName }}</span>
        </div>
        <div class="mt-5 flex justify-center space-x-4">
        <button
          @click="dashboard"
          class="border p-2 px-5 rounded-sm text-blue-500 bg-white cursor-pointer"
        >
          Dashboard
        </button>
        <button
          @click="logout"
          class="border p-2 px-5 rounded-sm bg-blue-500 text-white cursor-pointer"
        >
          Logout
        </button>
        </div>
      </div>

      <!-- If NOT logged in -->
      <div v-else class="mt-5 flex justify-center space-x-4 text-sm">
        <RouterLink to="/login">
          <button class="border p-2 px-5 rounded-sm text-blue-500 bg-white cursor-pointer">
            Signin
          </button>
        </RouterLink>
        <RouterLink to="/register">
          <button class="border p-2 px-5 rounded-sm bg-blue-500 text-white cursor-pointer">
            Signup
          </button>
        </RouterLink>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 max-w-6xl mx-auto px-4">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-10">
        Key Features
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <FeatureCard
          title="Create Tasks"
          description="Easily create and organize tasks with deadlines and priorities."
          :icon="PlusIcon"
          iconBg="bg-green-500"
        />
        <FeatureCard
          title="Assign by Roles"
          description="Assign tasks to team members based on their roles."
          :icon="UserGroupIcon"
          iconBg="bg-blue-500"
        />
        <FeatureCard
          title="Track Progress"
          description="Stay updated on progress with real-time task tracking."
          :icon="ChartBarIcon"
          iconBg="bg-purple-500"
        />
        <FeatureCard
          title="Update Tasks"
          description="Modify task details anytime to adapt to changing needs."
          :icon="PencilSquareIcon"
          iconBg="bg-yellow-500"
        />
        <FeatureCard
          title="View All Tasks"
          description="Get a clear overview of tasks assigned to you or your team."
          :icon="ListBulletIcon"
          iconBg="bg-orange-500"
        />
        <FeatureCard
          title="Delete Tasks"
          description="Remove completed or irrelevant tasks instantly."
          :icon="TrashIcon"
          iconBg="bg-red-500"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import FeatureCard from '@/components/FeatureCard.vue'
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/store/authStore'


// Importing icons from Heroicons
import {
  PlusIcon,
  UserGroupIcon,
  ChartBarIcon,
  PencilSquareIcon,
  ListBulletIcon,
  TrashIcon
} from '@heroicons/vue/24/solid'

const authStore = useAuthStore()
const router = useRouter()
const isLoggedIn = ref(false)
const userName = ref('')
const userAvatar = ref('')

onMounted(() => {
  const usertoken = authStore.token
  const user = JSON.stringify(authStore.user)

  if (usertoken && user) {
    const userDetails = JSON.parse(user)
    isLoggedIn.value = true
    userName.value = userDetails.name || 'User'
    userAvatar.value = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userName.value)
  }
})

function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push({ name: 'Home' })
}
function dashboard() {
  router.push({ name: 'Dashboard' })
}
</script>
