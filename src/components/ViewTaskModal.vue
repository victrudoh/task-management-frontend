<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="closeModal">
      <!-- Overlay -->
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/30 " />
      </TransitionChild>

      <!-- Centered modal -->
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
            class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
          >
            <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900">
              {{ task.title }}
            </DialogTitle>

            <div class="mt-4 space-y-2">
              <p class="text-sm text-gray-600">
                <span class="font-medium text-gray-800">Description:</span>
                {{ task.description }}
              </p>

              <p class="text-sm text-gray-600">
                <span class="font-medium text-gray-800">Assigned To:</span>
                {{ userStore.users.find(user => user.id == task.assigned_to_id).name}}
              </p>

              <p class="text-sm text-gray-600">
                <span class="font-medium text-gray-800">Priority:</span>
                {{ task.priority }}
              </p>

              <p class="text-sm text-gray-600">
                <span class="font-medium text-gray-800">Deadline:</span>
                {{ task.due_date }}
              </p>

              <p class="text-sm text-gray-600">
                <span class="font-medium text-gray-800">Status:</span>
                {{ task.status }}
              </p>

              <p class="text-sm text-gray-600">
                <span class="font-medium text-gray-800">Role Attached:</span>
                {{ useRoleStore().roles.find(role => role.id == task.role_nature_id).name }}
              </p>
            </div>

            <div class="mt-6 flex justify-end space-x-2">
              <button
                type="button"
                class="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="closeModal"
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useUserStore } from '@/store/userStore'
import { useRoleStore } from '@/store/roleStore'

const userStore = useUserStore()

// Props: we pass the task object and control open/close externally
const props = defineProps({
  isOpen: { type: Boolean, default: false },
  task: {
    type: Object,
    default: () => ({
      title: '',
      description: '',
      assignedTo: '',
      priority: '',
      deadline: '',
      status: '',
      role_nature_id: '',
    }),
  },
})

const emit = defineEmits(['close'])

function closeModal() {
  emit('close')
}
</script>
