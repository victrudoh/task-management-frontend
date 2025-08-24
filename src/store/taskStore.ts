// src/stores/taskStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getTasks, createTask, updateTask, deleteTask, getUserTasks } from '@/services/taskService'

export const useTaskStore = defineStore('taskStore', () => {
  const tasks = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTasks() {
    loading.value = true
    try {
      const res = await getTasks()
      tasks.value = res.data
      // tasks.value.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch tasks'
    } finally {
      loading.value = false
    }
  }

  async function fetchmyTasks(userId: number) {
    loading.value = true
    try {
      const res = await getUserTasks(userId)
      tasks.value = res.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch tasks'
    } finally {
      loading.value = false
    }
  }

  async function addTask(task: any) {
    const res = await createTask(task)
    tasks.value.push(res.data)
  }

  async function editTask(id: number, updates: any) {
    const res = await updateTask(id, updates)
    tasks.value = tasks.value.map(t => (t.id === id ? res.data : t))
  }

  async function removeTask(id: number) {
    await deleteTask(id)
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  return { tasks, loading, error, fetchTasks, fetchmyTasks, addTask, editTask, removeTask }
})
