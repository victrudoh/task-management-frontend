<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { useRoleStore } from '@/store/roleStore'
import CreateRoleModal from '@/components/CreateRoleModal.vue'

const userRole = useAuthStore().role // simulate logged-in role
const roleStore = useRoleStore()
const isModalOpen = ref(false)

onMounted(() => {
  roleStore.fetchRoles()
  console.log('Roles fetched:', roleStore.roles)
})

const addRole = (role: any) => {
  roleStore.addRole(role).then(()=>roleStore.fetchRoles())
}

const deleteRole = (id: any) => {
  roleStore.removeRole(id).then(()=>roleStore.fetchRoles())
}

</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Roles</h1>

    <div class="mb-4" v-if="userRole== 'Admin' || userRole == 'manager'">
      <button @click="isModalOpen = true" class="bg-blue-500 text-white px-4 py-2 rounded">Create Role</button>
    </div>

    <ul class="space-y-2">
      <li v-for="role in roleStore.roles" :key="role?.id" class="bg-white p-3 rounded shadow flex justify-between items-center">
        {{ role?.name }}
        <div class="flex space-x-2 items-center">
          <button @click="deleteRole(role.id)" v-if="userRole=='Admin'" class="border border-1 border-green rounded text-xs p-2">Delete</button>
        </div>
      </li>
    </ul>
    <CreateRoleModal
      :isOpen="isModalOpen"
      @close="isModalOpen = false"
      @roleCreated="addRole"
    />
  </div>
</template>
