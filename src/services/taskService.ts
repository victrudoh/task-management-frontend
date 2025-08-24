// src/services/taskService.ts
import api from './api'

export interface TaskData {
  title: string
  description: string
  assignedTo: number
  priority: string
  deadline: string
  status: string
}

export const getTasks = () => api.get('/tasks')
export const getUserTasks = () => api.get(`/users/tasks/my`)
export const getTaskById = (id: string | number) => api.get(`/tasks/${id}`)
export const createTask = (data: TaskData) => api.post('/tasks', data)
export const updateTask = (id: string | number, data: Partial<TaskData>) => api.put(`/tasks/${id}`, data)
export const deleteTask = (id: string | number) => api.delete(`/tasks/${id}`)
