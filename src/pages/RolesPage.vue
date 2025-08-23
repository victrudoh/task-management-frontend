<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { useRoleStore } from '@/store/roleStore'
import { useToastStore } from '@/store/toastStore'
import CreateRoleModal from '@/components/CreateRoleModal.vue'

const userRole = useAuthStore().role // simulate logged-in role
const roleStore = useRoleStore()
const toast = useToastStore()
const isModalOpen = ref(false)

onMounted(() => {
  roleStore.fetchRoles()
  console.log('Roles fetched:', roleStore.roles)
})

const props = defineProps<{ searchQuery: string }>()

const filteredRoles = computed(() =>
  roleStore.roles.filter(role =>
    role.name.toLowerCase().includes(props.searchQuery.toLowerCase())
  )
);

const addRole = (role: any) => {
  roleStore.addRole(role).then(()=>roleStore.fetchRoles())
  toast.success('Role added successfully')
}

const deleteRole = (id: any) => {
  roleStore.removeRole(id).then(()=>roleStore.fetchRoles())
  toast.success('Role deleted successfully')
}

</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Roles</h1>

    <div class="mb-4" v-if="userRole== 'Admin' || userRole == 'Manager'">
      <button @click="isModalOpen = true" class="bg-blue-500 text-white px-4 py-2 rounded">Create Role</button>
    </div>

    <ul class="space-y-2">
      <div class="grid grid-cols-1 bg-white p-3 rounded shadow" v-if="filteredRoles.length == 0">
        <span class="text-gray-500">No roles found</span>
      </div>
      <li v-for="role in filteredRoles" :key="role?.id" class="bg-white p-3 rounded shadow flex justify-between items-center">
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
