// src/services/roleService.ts
import api from './api'

export interface RoleData {
  title: string
  description: string
  assignedTo: number
  priority: string
  deadline: string
  status: string
}

export const getRoles = () => api.get('/roles')
export const getRoleById = (id: string | number) => api.get(`/roles/${id}`)
export const createRole = (data: RoleData) => api.post('/roles', data)
export const updateRole = (id: string | number, data: Partial<RoleData>) => api.put(`/roles/${id}`, data)
export const deleteRole = (id: string | number) => api.delete(`/roles/${id}`)
