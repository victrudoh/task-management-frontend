<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { useTaskStore } from '@/store/taskStore'
import { useUserStore } from '@/store/userStore'
import CreateTaskModal from '@/components/CreateTaskModal.vue'
import ViewTaskModal from '@/components/ViewTaskModal.vue'

const userRole = useAuthStore().role // simulate logged-in role
const taskStore = useTaskStore()
const userStore = useUserStore()
const isModalOpen = ref(false)
const isViewOpen = ref(false)
const selectedTask = ref({})
const errorMessage = ref('')
const successMessage = ref('')

onMounted(() => {
  taskStore.fetchTasks()
  userStore.fetchUsers()
})

const addTask = (task: any) => {
  taskStore.addTask(task).then(() => {
    taskStore.fetchTasks()
  })
}

function openCreateTask() {
  isModalOpen.value = true
}

const deleteTask = (id: any) => {
  taskStore.removeTask(id).then(() => {
    taskStore.fetchTasks()
  })
}

function openViewTask(task:any) {
  selectedTask.value = task
  isViewOpen.value = true
}

const editStatus = (id: any, status: string) => {
  try {
    taskStore.editTask(id, { 'status':status }).then(() => {
    successMessage.value = 'Status edited successfuly'
    errorMessage.value = ''
    taskStore.fetchTasks()
  })
  } catch (error:any) {
    successMessage.value = ''
    errorMessage.value = error?.data?.message
  }
}

const editAssignee = (id: any, assigned_to_id: string) => {
  errorMessage.value = userStore.users.find(user => user.id === assigned_to_id).role_id
  successMessage.value = taskStore.tasks.find(task=> task.id === id).role_nature_id
  const compatible = userStore.users.find(user => user.id === assigned_to_id).role_id === taskStore.tasks.find(task=> task.id === id).role_nature_id
  // check if assignee has same role as nature of role
  if (!compatible) {
    errorMessage.value = 'Assignee does not have the same role as the task nature'
    successMessage.value = ''
    taskStore.fetchTasks()
    return
  }
  console.log(`Editing task ${id} assignee to ${assigned_to_id} and they are compatible: ${compatible}`)
  taskStore.editTask(id, { 'assigned_to_id':assigned_to_id }).then(() => {
    successMessage.value = 'Assignee edited successfuly'
    errorMessage.value = ''
    taskStore.fetchTasks()
  })
}

const editPercentage = (id: any, percentage_completed: string, e:any) => {
  taskStore.editTask(id, { 'percentage_completed':percentage_completed }).then(() => {
    successMessage.value = 'Percentage completed edited successfuly'
    errorMessage.value = ''
    e.target.blur() // remove focus from input
    taskStore.fetchTasks()
  })
}

const statusOptions = ['Todo', 'In Progress', 'Done']

</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Tasks</h1>

    <div class="mb-4" v-if="userRole== 'Admin' || userRole == 'manager'">
      <button @click="openCreateTask" class="bg-blue-500 text-white px-4 py-2 rounded">Create Task</button>
    </div>

    <!-- <div class="grid">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Filter by User</label>
        <select
          v-model="taskStore.filterUserId"
          class="mt-1 block w-full rounded p-1 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
        >
          <option value="">All Users</option>
          <option v-for="user in userStore.users" :key="user.id" :value="user.id">
            {{ user.name }}
          </option>
        </select>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Filter by Status</label>
        <select
          v-model="taskStore.filterStatus"
          class="mt-1 block w-full rounded p-1 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
        >
          <option value="">All Statuses</option>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
    </div> -->

    <div class="space-y-2">
      <div v-if="successMessage" class="text-green-600 mb-2">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="text-red-600 mb-2">
        {{ errorMessage }}
      </div>
      <div class="grid grid-cols-1 bg-white p-3 rounded shadow" v-if="taskStore.tasks.length == 0">
        <span class="text-gray-500">No tasks available</span>
      </div>
      <div class="grid grid-cols-5 bg-white p-3 rounded shadow" v-for="task in taskStore.tasks" :key="task.id" v-if="taskStore.tasks.length > 0">
        <div class="flex items-center space-x-2">
          <span @click="openViewTask(task)" class="cursor-pointer">{{ task.title }}</span>
          <span v-if="new Date (Date.now()-2*24*60*60*1000) < new Date(task.createdAt)" class="bg-green-500 text-white p-1 text-[8px] rounded">new</span>
        </div>
        <div class="flex items-center justify-end">
          <!-- <span @click="openViewTask(task)" class="cursor-pointer rounded text-xs p-2">{{ getUserEmail(task.assigned_to_id) }}</span> -->
          <span v-if="useAuthStore().role == 'Admin' || useAuthStore().role == 'Manager'"  @click="openViewTask(task)" class="cursor-pointer rounded text-xs p-1">Assigned to:</span>
          <select v-if="useAuthStore().role == 'Admin' || useAuthStore().role == 'Manager'" v-model="task.assigned_to_id" class="border p-2 rounded text-xs" @change="editAssignee(task.id, task.assigned_to_id)">
            <option value="">--Select Status--</option>
            <option 
              v-for="user in userStore.users" 
              :key="user.id" 
              :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>
        <div class="flex items-center justify-end">
          <span class="rounded text-xs p-2">Due date : {{task.due_date}}</span>
        </div>
        <div class="flex space-x-2 items-center justify-end col-span-2">
          <span class="border border-1 border-green rounded text-xs p-2">{{task.priority}} priority</span>
          <select v-model="task.status" class="border p-2 rounded text-xs" @change="editStatus(task.id, task.status)">
            <option value="">--Select Status--</option>
            <option 
              v-for="option in statusOptions" 
              :key="option" 
              :value="option">
              {{ option }}
            </option>
          </select>
          <input type="number" v-model="task.percentage_completed" class="border p-2 rounded text-xs w-10" :disabled="task.status=='Todo' || task.status=='Done'" @keyup.enter="editPercentage(task.id, task.percentage_completed, $event)"/>
          <button @click="deleteTask(task.id)" v-if="userRole=='Admin' || userRole=='Manager'" class="border border-1 border-green rounded text-xs p-2">Delete</button>
        </div>
      </div>
    </div>
    <!-- <span v-if="taskStore.tasks.length == 0" class="text-gray-500">No tasks available</span>
    <span v-else-if="taskStore.tasks.length > 0" class="text-gray-500">Total tasks: {{ taskStore.tasks.length }}</span>
    <span v-else class="text-gray-500">Loading tasks...</span>
    <span v-if="taskStore.tasks.length == 0 && userRole=='Admin' || userRole=='Manager'" class="text-gray-500">
      <span @click="openCreateTask" class="cursor-pointer text-blue-500">Create your first task</span>
    </span>
    <span v-else-if="taskStore.tasks.length == 0 && userRole!='Admin' && userRole!='Manager'" class="text-gray-500">
      <span class="cursor-pointer">No tasks assigned</span>
    </span>
    <span v-else-if="taskStore.tasks.length > 0 && userRole!='Admin' && userRole!='Manager'" class="text-gray-500">
      <span @click="openCreateTask" class="cursor-pointer text-blue-500">Create your first task</span>
    </span>
    <span v-if="taskStore.tasks.length == 0 && userRole=='Admin' || userRole=='Manager'" class="text-gray-500">
      <span @click="openCreateTask" class="cursor-pointer text-blue-500">Create your first task</span>
    </span>
    <span v-else-if="taskStore.tasks.length == 0 && userRole!='Admin' && userRole!='Manager'" class="text-gray-500">
      <span class="cursor-pointer">No tasks assigned</span>
    </span>
    <span v-else-if="taskStore.tasks.length > 0 && userRole!='Admin' && userRole!='Manager'" class="text-gray-500">
      <span @click="openCreateTask" class="cursor-pointer text-blue-500">Create your first task</span>
    </span>
    <div v-if="taskStore.tasks.length == 0 && userRole!='Admin' && userRole!='Manager'">
      <span class="text-gray-500">No tasks assigned</span>
    </div>
    <div v-if="taskStore.tasks.length == 0 && userRole=='Admin' || userRole=='Manager'">
      <span class="text-gray-500">Create your first task</span>
    </div>
    <div v-if="taskStore.tasks.length == 0 && userRole=='Admin' || userRole=='Manager'">
      <span @click="openCreateTask" class="cursor-pointer text-blue-500">Create your first task</span>
    </div>
    <div v-if="taskStore.tasks.length == 0 && userRole!='Admin' && userRole!='Manager'">
      <span class="cursor-pointer">No tasks assigned</span>
    </div>
    <div v-if="taskStore.tasks.length > 0 && userRole!='Admin' && userRole!='Manager'>
      <span @click="openCreateTask" class="cursor-pointer text-blue-500">Create your first task</span>
    </div>
    <div v-if="taskStore.tasks.length == 0">
      <span class="text-gray-500">No tasks available</span> 
        <span class="cursor-pointer">No tasks</span>
    </div>
    </div> -->
    
    <!-- Modal -->
    <CreateTaskModal
      :isOpen="isModalOpen"
      @close="isModalOpen = false"
      @taskCreated="addTask"
    />

    <ViewTaskModal
      :isOpen="isViewOpen"
      :task="selectedTask"
      @close="isViewOpen = false"
    />
  </div>
</template>
