<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { useUserStore } from '@/store/userStore'
import { useRoleStore } from '@/store/roleStore'
import ViewUserModal from '@/components/ViewUserModal.vue'

const userRole = useAuthStore().role // simulate logged-in role
const userStore = useUserStore()
const roleStore = useRoleStore()
const isViewOpen = ref(false)
const selectedUser = ref({})
const errorMessage = ref('')
const successMessage = ref('')

onMounted(() => {
  userStore.fetchUsers()
  roleStore.fetchRoles()})
const deleteUser = (id: any) => {
  userStore.removeUser(id).then(()=>userStore.fetchUsers())
}

function openViewUser(user) {
  selectedUser.value = user
  isViewOpen.value = true
}

const editUserRole = (id: string, roleId: any) => {
  console.log(`Editing user ${id} role to ${roleId}`)
  userStore.editUser(id, {roleId:roleId}).then(() => {
    errorMessage.value = ''
    successMessage.value = 'User role updated successfully'
    userStore.fetchUsers()
  })
}

console.log(new Date (Date.now()-7*24*60*60*1000) > new Date('2025-08-10T09:56:23.237Z'))

</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Users</h1>
    <!-- error/success messages -->
    <div v-if="errorMessage" class="text-red-600 mb-2">
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="text-green-600 mb-2">
      {{ successMessage }}
    </div>

    <!-- use grid form -->
    <div v-for="user in userStore.users" :key="user.id" class="grid grid-cols-3 bg-white p-3 rounded shadow mb-2 items-center">
      <div class="flex items-center space-x-2">
        <span class="font-semibold">{{ user.name }}</span>
        <span v-if="new Date (Date.now()-7*24*60*60*1000) < new Date(user.createdAt)" class="bg-green-500 text-white p-1 text-[8px] rounded">new</span>
      </div>
      <select
      class="border p-2 rounded"
      v-model="user.role_id"
      @change="editUserRole(user.id, user.role_id)">
        <option
          v-for="role in roleStore.roles"
          :key="role.id"
          :value="role.id"
        >
          {{ role.name }}
        </option>
    </select>
      <div class="flex space-x-2 items-center justify-end">
          <div>
            <span class="rounded text-xs p-2">{{ user.email }}</span>
          </div>
          <button @click="deleteUser(user.id)" v-if="userRole=='Admin' || userRole=='Manager'" class="border border-1 border-green rounded text-xs p-2">Delete</button>
        </div>
    </div>
    <ViewUserModal
      :isOpen="isViewOpen"
      :user="selectedUser"
      @close="isViewOpen = false"
    />
  </div>
</template>
