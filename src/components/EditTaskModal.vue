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
            class="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl border border-gray-100"
          >
            
            <!-- Title -->
            <DialogTitle class="text-lg font-semibold text-gray-900 mb-6">
              Edit Task
            </DialogTitle>

            <!-- Form -->
            <form @submit.prevent="saveTask">
              <div class="space-y-5">
                <!-- Title -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    v-model="title"
                    type="text"
                    required
                      class="border p-2 w-full mb-4 mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm"
                  />
                </div>

                <!-- Description -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    v-model="description"
                    rows="3"
                      class="border p-2 w-full mb-4 mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm"
                  />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Priority -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Priority</label>
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

                <!-- Deadline -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Deadline</label>
                  <input
                    v-model="due_date"
                    type="date"
                    required
                      class="border p-2 w-full mb-4 mt-1 block w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm"
                  />
                </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Role -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Attach to Role</label>
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

                <!-- Assignee -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Assignee</label>
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
              </div>

              <!-- Actions -->
              <div class="pt-6 flex justify-end gap-3 sticky bottom-0 bg-white">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200
                  transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
                  :disabled="!allFieldsFilled"
                >
                  Save Changes
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
import { computed, onMounted, ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useUserStore } from '@/store/userStore'
import { useRoleStore } from '@/store/roleStore'
import { useToastStore } from '@/store/toastStore'

const userStore = useUserStore()
const roleStore = useRoleStore()
const toast = useToastStore()

onMounted(() => {
  userStore.fetchUsers()
  roleStore.fetchRoles()
})

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  task: {
    type: Object,
    default: () => ({
      id: null,
      title: '',
      description: '',
      assigned_to_id: '',
      priority: '',
      due_date: '',
      role_nature_id: '',
    }),
  },
})

const emits = defineEmits(['close', 'updateTask'])

const title = ref('')
const description = ref('')
const due_date = ref('')
const priority = ref('')
const assigned_to_id = ref('')
const role_nature_id = ref('')

watch(
  () => props.task,
  (task) => {
    userStore.fetchUsers()
    roleStore.fetchRoles()
    if (task) {
      title.value = task.title
      description.value = task.description
      due_date.value = task.due_date
      priority.value = task.priority
      assigned_to_id.value = task.assigned_to_id
      role_nature_id.value = task.role_nature_id
    }
  },
  { immediate: true },

)

const closeModal = () => {
  emits('close')
}

const saveTask = () => {
  // const user = userStore.users.find(user => user.id === assigned_to_id.value)
  console.log(userStore.users.find(user => user.id == assigned_to_id.value))
  if (userStore.users.find(user => user.id == assigned_to_id.value).role_id != role_nature_id.value) {

    // console.log('Selected task for editing:', typeof(role_nature_id.value), role_nature_id.value) 
    // console.log('Selected user for task:', typeof(user.role_id.toString()), user.role_id.toString()) 
    toast.error('Assignee does not match the selected role')
    return
  } else {
    // toast.success('Assignee is valid')
  }

  const updatedTask = {
    // ...props.task,
    id: props.task.id,
    title: title.value,
    description: description.value,
    due_date: due_date.value,
    priority: priority.value,
    assigned_to_id: assigned_to_id.value,
    role_nature_id: role_nature_id.value,
  }

  emits('updateTask', updatedTask)
  closeModal()
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
</script>
