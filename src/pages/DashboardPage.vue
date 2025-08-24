<script setup lang="ts">
import { useAuthStore } from '@/store/authStore'

const authStore = useAuthStore()

const userRole = authStore.role // change to test

</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Welcome to your Dashboard - {{ authStore.role }}</h1>

    <div class="grid grid-cols-2 gap-4">
      <div class="p-4 bg-white rounded shadow">
        <h2 class="font-semibold">Roles Management</h2>
        <p v-if="(userRole == 'Admin')">You can create roles.</p>
        <p v-if="(userRole == 'Admin')">You can update roles.</p>
        <p v-if="(userRole == 'Admin' || userRole == 'Manager')">You can view roles.</p>
        <p v-if="(userRole == 'Admin')">You can delete roles.</p>
        <p v-if="!(userRole == 'Admin' || userRole == 'Manager')">You can not access roles.</p>
      </div>

      <div class="p-4 bg-white rounded shadow">
        <h2 class="font-semibold">User Management</h2>
        <p>You can view your profile</p>
        <p v-if="(userRole == 'Admin' || userRole == 'Manager')">You can view users.</p>
        <p v-if="(userRole == 'Admin' || userRole == 'Manager')">You can delete users.</p>
        <p v-if="!(userRole == 'Admin' || userRole == 'Manager')">You can not access other users.</p>
      </div>

      <div class="p-4 bg-white rounded shadow">
        <h2 class="font-semibold">Task Management</h2>
        <p v-if="(userRole == 'Admin' || userRole == 'Manager')">You can create tasks.</p>
        <p>You can update tasks.</p>
        <p>You can view tasks.</p>
        <p v-if="(userRole == 'Admin' || userRole == 'Manager')">You can delete tasks.</p>
      </div>
    </div>
  </div>
</template>
