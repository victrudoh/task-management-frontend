// src/stores/roleStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getRoles, createRole, updateRole, deleteRole } from '@/services/roleService'

export const useRoleStore = defineStore('roleStore', () => {
  const roles = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchRoles() {
    loading.value = true
    try {
      const res = await getRoles()
      roles.value = res.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch roles'
    } finally {
      loading.value = false
    }
  }

  async function addRole(role: any) {
    const res = await createRole(role)
    roles.value.push(res.data)
  }

  async function editRole(id: number, updates: any) {
    const res = await updateRole(id, updates)
    roles.value = roles.value.map(t => (t.id === id ? res.data : t))
  }

  async function removeRole(id: number) {
    await deleteRole(id)
    roles.value = roles.value.filter(t => t.id !== id)
  }

  return { roles, loading, error, fetchRoles, addRole, editRole, removeRole }
})
