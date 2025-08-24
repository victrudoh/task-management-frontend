<template>
  <div class="w-64 bg-white shadow-lg p-4">
    <router-link to="/">
        <h2 class="text-lg font-bold mb-6">Task Manager</h2>
    </router-link>
    <nav>
        <div>
            <router-link to="/dashboard" class="block p-2 hover:bg-gray-200 rounded">
              Overview
            </router-link>
            <router-link to="/dashboard/tasks" class="block p-2 hover:bg-gray-200 rounded">
              Tasks
            </router-link>
            <router-link v-if="role=='Admin' || role == 'Manager'" to="/dashboard/roles" class="block p-2 hover:bg-gray-200 rounded">
              Roles
            </router-link>
            <router-link v-if="role=='Admin' || role == 'Manager'" to="/dashboard/users" class="block p-2 hover:bg-gray-200 rounded">
              Users
            </router-link>
            <router-link to="/dashboard/profile" class="block p-2 hover:bg-gray-200 rounded">
              Profile
            </router-link>
        </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/authStore'

const authStore = useAuthStore()
// Menu configuration: each item defines which roles can see it
const role = authStore.role

</script>
