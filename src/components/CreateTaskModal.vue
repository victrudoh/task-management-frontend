<template>
  <TransitionRoot as="template" :show="props.isOpen">
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
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      </TransitionChild>

      <!-- Modal content -->
      <div class="fixed inset-0 flex items-center justify-center p-4 sm:p-8">
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
            class="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl border border-gray-100"
          >
            <!-- Title -->
            <DialogTitle class="text-xl font-semibold text-gray-900 mb-6">
              Create New Task
            </DialogTitle>

            <!-- Form -->
            <form @submit.prevent="createTask" class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  v-model="title"
                  type="text"
                  required
                    class="border p-2 w-full mb-4 mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  v-model="description"
                  rows="4"
                    class="border p-2 w-full mb-4 mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <select
                    v-model="priority"
                      class="border p-2 w-full mb-4 mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm"
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
                      class="border p-2 w-full mb-4 mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm"
                    @change="validateDate"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Attach to Role
                  </label>
                  <select
                    v-model="role_nature_id"
                      class="border p-2 w-full mb-4 mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm"
                    @change="checkAssignee()"
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
                      class="border p-2 w-full mb-4 mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm"
                  >
                    <option value="">--Select--</option>
                    <option v-for="user in userStore.users" :key="user.id" :value="user.id">
                      {{ user.name }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Actions -->
              <div class="pt-6 flex justify-end gap-3 sticky bottom-0 bg-white">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
                  :disabled="!allFieldsFilled"
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
import { computed, onMounted, ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useUserStore } from '@/store/userStore'
import { useRoleStore } from '@/store/roleStore'
import { useToastStore } from '@/store/toastStore'

const userStore = useUserStore()
const roleStore = useRoleStore()
const toast = useToastStore()

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

const closeModal = () => {
  emits('close')
}

const createTask = () => {

  if (userStore.users.find(user => user.id === assigned_to_id.value).role_id !== role_nature_id.value) {
    toast.error('Assignee does not match the selected role')
    return
  } else {
    // toast.success('Assignee is valid')
  }

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
  role_nature_id.value = ''
}

const allFieldsFilled = computed(() => {
  return (
    title.value.trim() !== "" &&
    description.value.trim() !== "" &&
    due_date.value !== "" &&
    priority.value !== "" &&
    assigned_to_id.value !== ""
  );
});

const checkAssignee = () => {
  if (assigned_to_id.value === '') {
    return
  } else {
    if (assigned_to_id.value !== role_nature_id.value) {
      toast.error('Assignee does not match the selected role')
      assigned_to_id.value = ''
    } 
  }
}

const validateDate = () =>{
  if (new Date (Date.now()) > new Date(due_date.value)){
    due_date.value = ""
  }
}
</script>
