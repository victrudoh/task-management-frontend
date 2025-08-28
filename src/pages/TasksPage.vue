<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { useTaskStore } from '@/store/taskStore'
import { useUserStore } from '@/store/userStore'
import { useToastStore } from '@/store/toastStore'
import CreateTaskModal from '@/components/CreateTaskModal.vue'
import ViewTaskModal from '@/components/ViewTaskModal.vue'
import EditTaskModal from '@/components/EditTaskModal.vue'

const auth = useAuthStore()
const userRole = auth.role
const isAdminOrManager = computed(() => userRole === 'Admin' || userRole === 'Manager')

const taskStore = useTaskStore()
const userStore = useUserStore()
const toast = useToastStore()
const isModalOpen = ref(false)
const isViewOpen = ref(false)
const isEditOpen = ref(false)
const selectedTask = ref<any>({})

onMounted(() => {
  taskStore.fetchTasks()
  userStore.fetchUsers()
})

const props = defineProps<{ searchQuery: string }>()

const asString = (v: unknown): string =>
  v == null ? "" : typeof v === "string" ? v : String(v);

const lower = (v: unknown): string => asString(v).toLowerCase();

// Build a safe lookup each time we filter (fast for typical sizes)
const userById = computed(() => {
  const map = new Map<string, any>();
  const list = Array.isArray(userStore.users) ? userStore.users : [];
  for (const u of list) map.set(String(u?.id), u);
  return map;
});

const filteredTasks = computed(() => {
  const q = lower(props.searchQuery).trim();
  if (!q) return taskStore.tasks; // no search, return original

  return taskStore.tasks.filter((t: any) => {
    const u = userById.value.get(String(t?.assigned_to_id));

    // normalize everything to strings before calling toLowerCase
    const hay = [
      lower(t?.title),
      lower(t?.description),
      lower(t?.priority),        // handles number/enums
      lower(u?.name),            // assignee name
      lower(u?.email),           // assignee email
      lower(u?.role ?? u?.role_name) // assignee role
    ].join(" ");

    return hay.includes(q);
  });
});


const statuses = ['Todo', 'In Progress', 'Done']

const groupedTasks = computed(() => {
  const groups: Record<string, any[]> = {}
  statuses.forEach(status => {
    groups[status] = filteredTasks.value.filter(t => t.status === status)
  })
  return groups
})

const groupedPersonalTasks = computed(() => {
  const groups: Record<string, any[]> = {}
  statuses.forEach(status => {
    groups[status] = filteredTasks.value.filter(
      t => t.status === status && t.assigned_to_id == auth.user?.id
    )
  })
  return groups
})


const addTask = async (task: any) => {
  await taskStore.addTask(task)
  toast.success('Task created successfully')
  taskStore.fetchTasks()
}

function openCreateTask() { isModalOpen.value = true }
const deleteTask = async (id: any) => {
  await taskStore.removeTask(id)
  taskStore.fetchTasks()
  toast.success('Task deleted successfully')
}

function openViewTask(task: any) { selectedTask.value = task; isViewOpen.value = true }
function openEditTask(task: any) { selectedTask.value = task; isEditOpen.value = true }

const editTask = async (task: any) => {
  await taskStore.editTask(task.id, task)
  toast.success('Task updated successfully')
  taskStore.fetchTasks()
}

const editStatus = async (id: any, status: string) => {
  try {
    await taskStore.editTask(id, { status })
    toast.success(`Task status updated to ${status}`)
    taskStore.fetchTasks()
  } catch (error: any) {
    toast.error(error?.data?.message || 'Failed to update status')
  }
}

const editAssignee = async (id: any, assigned_to_id: string) => {
  const assignee = userStore.users.find(u => u.id == assigned_to_id)
  const targetTask = taskStore.tasks.find(t => t.id == id)
  const compatible = assignee && targetTask && assignee.role_id == targetTask.role_nature_id
  if (!compatible) {
    toast.error('Assignee does not have the same role as the task nature')
    taskStore.fetchTasks()
    return
  }
  await taskStore.editTask(id, { assigned_to_id })
  toast.success('Assignee edited successfully')
  taskStore.fetchTasks()
}

const editPercentage = async (id: any, percentage_completed: string, e: any) => {
  if (percentage_completed == '100') { await editStatus(id, 'Done'); return }
  await taskStore.editTask(id, { percentage_completed })
  toast.success('Percentage completed edited successfully')
  e?.target?.blur?.()
  taskStore.fetchTasks()
}

const statusOptions = ['Todo', 'In Progress', 'Done']

const isNew = (createdAt: string | number | Date) => {
  const twoDays = 2 * 24 * 60 * 60 * 1000
  return Date.now() - twoDays < new Date(createdAt).getTime()
}

const displayStart = (task: any) => task?.start_date ?? '—'
</script>

<template>
  <div>
    <h1 class="mb-4 text-2xl font-bold">Tasks</h1>

    <!-- Create -->
    <div class="mb-4 flex justify-end" v-if="isAdminOrManager">
      <button @click="openCreateTask" class="rounded bg-blue-500 px-4 py-2 text-white">Create Task</button>
    </div>

    <!-- One loop, table per status; rows depend on role -->
    <div class="space-y-8">
      <div v-for="status in statusOptions" :key="status" class="space-y-3">
        <h2 class="text-md mb-2 text-lg font-bold">{{ status }}</h2>

        <template v-if="(isAdminOrManager ? groupedTasks[status] : groupedPersonalTasks[status]).length === 0">
          <div class="rounded bg-gray-50 p-3 text-md text-gray-500">No {{ status }} tasks</div>
        </template>

        <template v-else>
          <!-- Scrollable container (non-sticky header) -->
          <div class="relative max-h-[70vh] overflow-x-auto overflow-y-auto rounded border border-gray-200 bg-white">
            <table class="min-w-full text-sm">
              <!-- NON-STICKY thead -->
              <thead class="bg-gray-50 text-gray-600">
                <tr class="text-left">
                  <th class="px-4 py-3 font-semibold">Title</th>
                  <th v-if="isAdminOrManager" class="px-4 py-3 font-semibold">Assignee</th>
                  <th class="px-4 py-3 font-semibold">Start date</th>
                  <th class="px-4 py-3 font-semibold">Due date</th>
                  <th class="px-4 py-3 font-semibold">Priority</th>
                  <th class="px-4 py-3 font-semibold">Status</th>
                  <th class="px-4 py-3 font-semibold">% Done</th>
                  <th class="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="task in (isAdminOrManager ? groupedTasks[status] : groupedPersonalTasks[status])"
                  :key="task.id"
                  class="odd:bg-white even:bg-gray-50 hover:bg-black/[0.03]"
                >
                  <!-- Title + "new" badge -->
                  <td class="px-4 py-3 align-middle">
                    <div class="flex items-center gap-2">
                      <span
                        @click="openViewTask(task)"
                        class="cursor-pointer text-[15px] font-medium text-gray-900 hover:underline"
                      >
                        {{ task.title }}
                      </span>
                      <span
                        v-if="isNew(task.createdAt)"
                        class="rounded bg-green-500 px-1 py-[2px] text-[10px] text-white"
                      >
                        new
                      </span>
                    </div>
                  </td>

                  <!-- Assignee (Admin/Manager only) -->
                  <td v-if="isAdminOrManager" class="px-4 py-3 align-middle">
                    <div class="flex items-center gap-2">
                      <select
                        v-model="task.assigned_to_id"
                        class="rounded border p-2 text-sm"
                        @change="editAssignee(task.id, task.assigned_to_id)"
                      >
                        <option value="">--Select User--</option>
                        <option v-for="user in userStore.users" :key="user.id" :value="user.id">
                          {{ user.name }}
                        </option>
                      </select>
                    </div>
                  </td>

                  <!-- Start date -->
                  <td class="px-4 py-3 align-middle">
                    <span class="text-sm">{{ displayStart(task) }}</span>
                  </td>

                  <!-- Due date -->
                  <td class="px-4 py-3 align-middle">
                    <span class="text-sm">{{ task.due_date }}</span>
                  </td>

                  <!-- Priority (no 'priority' word) -->
                  <td class="px-4 py-3 align-middle">
                    <span
                      class="rounded-lg px-2 py-1 text-[10px] text-white"
                      :class="{
                        'bg-red-500': task.priority === 'High',
                        'bg-yellow-500': task.priority === 'Medium',
                        'bg-green-500': task.priority === 'Low'
                      }"
                    >
                      {{ task.priority }}
                    </span>
                  </td>

                  <!-- Status -->
                  <td class="px-4 py-3 align-middle">
                    <select
                      v-model="task.status"
                      class="rounded border p-2 text-sm"
                      @change="editStatus(task.id, task.status)"
                    >
                      <option value="">--Select Status--</option>
                      <option v-for="option in statusOptions" :key="option" :value="option">
                        {{ option }}
                      </option>
                    </select>
                  </td>

                  <!-- % Done -->
                  <td class="px-4 py-3 align-middle">
                    <input
                      type="number"
                      v-model="task.percentage_completed"
                      class="w-16 rounded border p-2 text-right text-sm"
                      :disabled="task.status === 'Todo' || task.status === 'Done'"
                      @keyup.enter="editPercentage(task.id, task.percentage_completed, $event)"
                    />
                  </td>

                  <!-- Actions (icons only, no borders) -->
                  <td class="px-4 py-3 align-middle">
                    <div class="flex items-center justify-end gap-2">
                      <!-- View (blue) -->
                      <button
                        @click="openViewTask(task)"
                        class="rounded p-2 hover:bg-black/[0.04]"
                        title="View"
                        aria-label="View"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>

                      <!-- Edit (amber) -->
                      <button
                        v-if="isAdminOrManager"
                        @click="openEditTask(task)"
                        class="rounded p-2 hover:bg-black/[0.04]"
                        title="Edit"
                        aria-label="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M12 20h9"/>
                          <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/>
                        </svg>
                      </button>

                      <!-- Delete (red) -->
                      <button
                        v-if="isAdminOrManager"
                        @click="deleteTask(task.id)"
                        class="rounded p-2 hover:bg-red-50"
                        title="Delete"
                        aria-label="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M3 6h18"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          <path d="M10 11v6"/>
                          <path d="M14 11v6"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </div>
    </div>

    <!-- Modals -->
    <CreateTaskModal :isOpen="isModalOpen" @close="isModalOpen = false" @taskCreated="addTask" />
    <EditTaskModal :isOpen="isEditOpen" :task="selectedTask" @close="isEditOpen = false" @updateTask="editTask" />
    <ViewTaskModal :isOpen="isViewOpen" :task="selectedTask" @close="isViewOpen = false" />
  </div>
</template>
