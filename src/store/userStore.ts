// src/stores/userStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUsers, updateUser, deleteUser, updateMe } from '@/services/authService'
import { useAuthStore } from './authStore'

export const useUserStore = defineStore('userStore', () => {
  const users = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchUsers() {
    loading.value = true
    try {
      const res = await getUsers()
      users.value = res.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch users'
    } finally {
      loading.value = false
    }
  }


  async function editUser(id: string, updates: any) {
    const res = await updateUser(id, updates)
    users.value = users.value.map(t => (t.id === id ? res.data : t))
  }

  async function editMe(updates: any) {
    const res = await updateMe(updates)
    console.log('editMe res', res.data)
    //update authStore user data if needed
    // users.value = users.value.map(t => (t.id === id ? res.data : t))
    // Optionally, you can also update the authStore user data here
    const authStore = useAuthStore()
    authStore.user = res.data.user
    localStorage.setItem('user', JSON.stringify(res.data.user))
    return res.data
  }

  async function removeUser(id: string) {
    await deleteUser(id)
    users.value = users.value.filter(t => t.id !== id)
  }

  return { users, loading, error, fetchUsers, editUser, removeUser, editMe }
})
