<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="relative z-50" @close="closeModal">
      <!-- Background overlay -->
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/30" />
      </TransitionChild>

      <!-- Modal content -->
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel
            class="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg"
          >
            <!-- Title -->
            <DialogTitle class="text-lg font-semibold text-gray-900 mb-4">
              Create New Task
            </DialogTitle>

            <!-- Form -->
            <form @submit.prevent="createTask">
              <div class="space-y-4">
                <div v-if="successMessage" class="text-green-600 mb-2">
                {{ successMessage }}
              </div>
              <div v-if="errorMessage" class="text-red-600 mb-2">
                {{ errorMessage }}
              </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    v-model="title"
                    type="text"
                    required
                    class="mt-1 block w-full rounded p-1 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    v-model="description"
                    rows="3"
                    class="mt-1 block w-full rounded p-1 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Priority
                  </label>
                    <select
                        v-model="priority"
                        class="mt-1 block w-full rounded p-1 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    >
                        <option value="">--Select--</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Deadline
                  </label>
                  <input
                    v-model="due_date"
                    type="date"
                    required
                    class="mt-1 block w-full rounded p-1 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Attach to Role
                  </label>
                    <select
                        v-model="role_nature_id"
                        class="mt-1 block w-full rounded p-1 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    >
                      <option value="">--Select--</option>
                        <option v-for="role in roleStore.roles" :key="role.id" :value="role.id">
                        {{ role.name }}
                      </option>
                    </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Assignee
                  </label>
                    <select
                        v-model="assigned_to_id"
                        class="mt-1 block w-full rounded p-1 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                        @change="checkAssignee(assigned_to_id)"
                    >
                      <option value="">--Select--</option>
                        <option v-for="user in userStore.users" :key="user.id" :value="user.id">
                        {{ user.name }}
                      </option>
                    </select>
                </div>
              </div>

              <!-- Actions -->
              <div class="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                  :disabled="buttonDisabled"
                >
                  Create Task
                </button>
              </div>
            </form>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useUserStore } from '@/store/userStore'
import { useRoleStore } from '@/store/roleStore'

const userStore = useUserStore()
const roleStore = useRoleStore()

onMounted(()=> {
  userStore.fetchUsers()
  roleStore.fetchRoles()
})
const props = defineProps<{
  isOpen: boolean
}>()

const emits = defineEmits(['close', 'taskCreated'])

const title = ref('')
const description = ref('')
const due_date = ref('')
const priority = ref('')
const assigned_to_id = ref('')
const role_nature_id = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const buttonDisabled = ref(true)

const closeModal = () => {
  emits('close')
}

const createTask = () => {
  const newTask = {
    title: title.value,
    description: description.value,
    due_date: due_date.value,
    priority: priority.value,
    assigned_to_id: assigned_to_id.value, // Default to
    status: 'Todo',
    role_nature_id: role_nature_id.value
  }

  // if (userStore.users.find(user))

  emits('taskCreated', newTask)
  closeModal()

  // Reset fields
  title.value = ''
  description.value = ''
  due_date.value = ''
  priority.value = ''
  assigned_to_id.value = ''
  role_nature_id = ''
  errorMessage = ''
  successMessage = ''
}

const checkAssignee = (id: string) => {
  if (!userStore.users.find(user => user.id === id)) {
    errorMessage.value = 'Selected assignee does not exist'
  } else {
    if (userStore.users.find(user => user.id === id).role_id !== role_nature_id.value) {
      errorMessage.value = 'Assignee does not match the selected role'
    } else {
      errorMessage.value = ''
      successMessage.value = 'Assignee is valid'
      buttonDisabled.value = false
    }
  }
}
</script>
