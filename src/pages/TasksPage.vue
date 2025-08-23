<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { useTaskStore } from '@/store/taskStore'
import { useUserStore } from '@/store/userStore'
import { useToastStore } from '@/store/toastStore'
import CreateTaskModal from '@/components/CreateTaskModal.vue'
import ViewTaskModal from '@/components/ViewTaskModal.vue'
import EditTaskModal from '@/components/EditTaskModal.vue'

const userRole = useAuthStore().role // simulate logged-in role
const taskStore = useTaskStore()
const userStore = useUserStore()
const toast = useToastStore()
const isModalOpen = ref(false)
const isViewOpen = ref(false)
const isEditOpen = ref(false)
const selectedTask = ref({})

onMounted(() => {
  taskStore.fetchTasks()
  userStore.fetchUsers()
})

// defineProps<{ searchQuery: string }>()

const props = defineProps<{ searchQuery: string }>()

const filteredTasks = computed(() =>
  taskStore.tasks.filter(task =>
    task.title.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
    task.priority.toLowerCase().includes(props.searchQuery.toLowerCase())
  )
);

const groupedTasks = computed(() => {
  const statuses = ['Todo', 'In Progress', 'Done']
  const groups: Record<string, any[]> = {}

  statuses.forEach(status => {
    groups[status] = filteredTasks.value.filter(t => t.status === status)
  })

  return groups
})

const groupedPersonalTasks = computed(() => {
  const statuses = ['Todo', 'In Progress', 'Done']
  const groups: Record<string, any[]> = {}

  statuses.forEach(status => {
    groups[status] = filteredTasks.value.filter(t => t.status == status && t.assigned_to_id==useAuthStore().user?.id)
  })

  return groups
})


const addTask = (task: any) => {
  taskStore.addTask(task).then(() => {
    toast.success('Task created successfully')
    taskStore.fetchTasks()
  })
}

function openCreateTask() {
  isModalOpen.value = true
}

const deleteTask = (id: any) => {
  taskStore.removeTask(id).then(() => {
    taskStore.fetchTasks()
    toast.success('Task deleted successfully')
  })
}


function openViewTask(task:any) {
  selectedTask.value = task
  isViewOpen.value = true
}

function openEditTask(task:any) {
  selectedTask.value = task
  isEditOpen.value = true
}

const editTask = (task: any) => {
  taskStore.editTask(task.id, task).then(() => {
    toast.success('Task created successfully')
    taskStore.fetchTasks()
  })
}

const editStatus = (id: any, status: string) => {
  try {
    taskStore.editTask(id, { 'status':status }).then(() => {
    toast.success(`Task status updated to ${status}`)
    taskStore.fetchTasks()
  })
  } catch (error:any) {
    toast.error(error?.data?.message)
  }
}

const editAssignee = (id: any, assigned_to_id: string) => {
  const compatible = userStore.users.find(user => user.id == assigned_to_id).role_id == taskStore.tasks.find(task=> task.id == id).role_nature_id
  // check if assignee has same role as nature of role
  if (!compatible) {
    toast.error('Assignee does not have the same role as the task nature')
    taskStore.fetchTasks()
    return
  }
  console.log(`Editing task ${id} assignee to ${assigned_to_id} and they are compatible: ${compatible}`)
  taskStore.editTask(id, { 'assigned_to_id':assigned_to_id }).then(() => {
    toast.success('Assignee edited successfuly')
    taskStore.fetchTasks()
  })
}

const editPercentage = (id: any, percentage_completed: string, e:any) => {
  taskStore.editTask(id, { 'percentage_completed':percentage_completed }).then(() => {
    toast.success('Percentage completed edited successfuly')
    e.target.blur() // remove focus from input
    taskStore.fetchTasks()
  })
}

const statusOptions = ['Todo', 'In Progress', 'Done']

</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Tasks</h1>

    <div class="mb-4" v-if="userRole== 'Admin' || userRole == 'Manager'">
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

    <div v-if="useAuthStore().role == 'Admin' || useAuthStore().role == 'Manager'" class="space-y-6">
      <div v-for="status in statusOptions" :key="status">
        <h2 class="text-lg font-bold mb-2 text-sm">{{ status }}</h2>

        <div v-if="groupedTasks[status].length === 0" class="bg-gray-50 p-3 rounded text-sm text-gray-500">
          No {{ status }} tasks
        </div>

        <div
          v-for="task in groupedTasks[status]"
          :key="task.id"
          class="grid grid-cols-5 bg-white p-3 rounded shadow mb-2"
        >
          <!-- title -->
          <div class="flex items-center space-x-2">
            <span @click="openViewTask(task)" class="cursor-pointer text-sm">{{ task.title }}</span>
            <span
              v-if="new Date(Date.now() - 2*24*60*60*1000) < new Date(task.createdAt)"
              class="bg-green-500 text-white px-1 py-[.5px] text-[8px] rounded-lg block flex items-center"
            >
              new
            </span>
          </div>

          <!-- assignee -->
          <div class="flex items-center justify-end">
            <span
              v-if="useAuthStore().role == 'Admin' || useAuthStore().role == 'Manager'"
              @click="openViewTask(task)"
              class="cursor-pointer rounded text-xs p-1"
            >
              Assigned to:
            </span>
            <select
              v-if="useAuthStore().role == 'Admin' || useAuthStore().role == 'Manager'"
              v-model="task.assigned_to_id"
              class="border p-2 rounded text-xs"
              @change="editAssignee(task.id, task.assigned_to_id)"
            >
              <option value="">--Select User--</option>
              <option
                v-for="user in userStore.users"
                :key="user.id"
                :value="user.id"
              >
                {{ user.name }}
              </option>
            </select>
          </div>

          <!-- due date -->
          <div class="flex items-center justify-end">
            <span class="rounded text-xs p-2">Due date : {{ task.due_date }}</span>
          </div>

          <!-- actions -->
          <div class="flex space-x-2 items-center justify-end col-span-2">
            <span
              class="rounded-lg text-white text-[8px] px-2 py-1"
              :class="{
                'bg-red-500': task.priority === 'High',
                'bg-yellow-500': task.priority === 'Medium',
                'bg-green-500': task.priority === 'Low'
              }"
            >
              {{ task.priority }} priority
            </span>

            <select
              v-model="task.status"
              class="border p-2 rounded text-xs"
              @change="editStatus(task.id, task.status)"
            >
              <option value="">--Select Status--</option>
              <option v-for="option in statusOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>

            <input
              type="number"
              v-model="task.percentage_completed"
              class="border p-2 rounded text-xs w-10"
              :disabled="task.status == 'Todo' || task.status == 'Done'"
              @keyup.enter="editPercentage(task.id, task.percentage_completed, $event)"
            />

            <button @click="openViewTask(task)" class="border border-1 border-green rounded text-xs p-2">View</button>
            <button @click="openEditTask(task)" class="border border-1 border-green rounded text-xs p-2">Edit</button>
            <button
              @click="deleteTask(task.id)"
              v-if="userRole == 'Admin' || userRole == 'Manager'"
              class="border border-1 border-green rounded text-xs p-2"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!(userRole == 'Admin' || userRole == 'Manager')" class="space-y-6">
      <div v-for="status in statusOptions" :key="status">
        <h2 class="text-lg font-bold mb-2 text-sm">{{ status }}</h2>

        <div v-if="groupedPersonalTasks[status].length === 0" class="bg-gray-50 p-3 rounded text-sm text-gray-500">
          No {{ status }} tasks
        </div>

        <div
          v-for="task in groupedPersonalTasks[status]"
          :key="task.id"
          class="grid grid-cols-5 bg-white p-3 rounded shadow mb-2"
        >
          <!-- title -->
          <div class="flex items-center space-x-2">
            <span @click="openViewTask(task)" class="cursor-pointer text-sm">{{ task.title }}</span>
            <span
              v-if="new Date(Date.now() - 2*24*60*60*1000) < new Date(task.createdAt)"
              class="bg-green-500 text-white px-1 py-[.5px] text-[8px] rounded-lg block flex items-center"
            >
              new
            </span>
          </div>

          <!-- assignee -->
          <div class="flex items-center justify-end">
            <span
              v-if="useAuthStore().role == 'Admin' || useAuthStore().role == 'Manager'"
              @click="openViewTask(task)"
              class="cursor-pointer rounded text-xs p-1"
            >
              Assigned to:
            </span>
            <select
              v-if="useAuthStore().role == 'Admin' || useAuthStore().role == 'Manager'"
              v-model="task.assigned_to_id"
              class="border p-2 rounded text-xs"
              @change="editAssignee(task.id, task.assigned_to_id)"
            >
              <option value="">--Select User--</option>
              <option
                v-for="user in userStore.users"
                :key="user.id"
                :value="user.id"
              >
                {{ user.name }}
              </option>
            </select>
          </div>

          <!-- due date -->
          <div class="flex items-center justify-end">
            <span class="rounded text-xs p-2">Due date : {{ task.due_date }}</span>
          </div>

          <!-- actions -->
          <div class="flex space-x-2 items-center justify-end col-span-2">
            <span
              class="rounded-lg text-white text-[8px] px-2 py-1"
              :class="{
                'bg-red-500': task.priority === 'High',
                'bg-yellow-500': task.priority === 'Medium',
                'bg-green-500': task.priority === 'Low'
              }"
            >
              {{ task.priority }} priority
            </span>

            <select
              v-model="task.status"
              class="border p-2 rounded text-xs"
              @change="editStatus(task.id, task.status)"
            >
              <option value="">--Select Status--</option>
              <option v-for="option in statusOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>

            <input
              type="number"
              v-model="task.percentage_completed"
              class="border p-2 rounded text-xs w-10"
              :disabled="task.status == 'Todo' || task.status == 'Done'"
              @keyup.enter="editPercentage(task.id, task.percentage_completed, $event)"
            />

            <button @click="openViewTask(task)" class="border border-1 border-green rounded text-xs p-2">View</button>
          </div>
        </div>
      </div>
    </div>


    <!-- Modal -->
    <CreateTaskModal
      :isOpen="isModalOpen"
      @close="isModalOpen = false"
      @taskCreated="addTask"
    />

    <EditTaskModal
      :isOpen="isEditOpen"
      :task="selectedTask"
      @close="isEditOpen = false"
      @updateTask="editTask"
    />

    <ViewTaskModal
      :isOpen="isViewOpen"
      :task="selectedTask"
      @close="isViewOpen = false"
    />
  </div>
</template>
