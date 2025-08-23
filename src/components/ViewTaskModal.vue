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
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      </TransitionChild>

      <!-- Centered modal -->
      <div class="fixed inset-0 flex items-center justify-center p-6">
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
            class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
          >
            <!-- Header -->
            <div class="flex justify-between items-center border-b px-6 py-4 bg-gray-50">
              <DialogTitle as="h3" class="text-xl font-semibold text-gray-900">
                {{ task.title }}
              </DialogTitle>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>
            </div>

            <!-- Body (scrollable) -->
            <div class="max-h-[70vh] overflow-y-auto px-6 py-4 space-y-4">
              <div>
                <p class="text-sm text-gray-600">
                  <span class="font-medium text-gray-800">Description:</span>
                </p>
                <p class="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {{ task.description }}
                </p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="text-sm text-gray-600">
                  <span class="font-medium text-gray-800">Assigned To:</span>
                  <p class="text-gray-700">
                    {{ userStore.users.find(user => user.id == task.assigned_to_id).name }}
                  </p>
                </div>
                <div class="text-sm text-gray-600">
                  <span class="font-medium text-gray-800">Priority:</span>
                  <p class="text-gray-700">{{ task.priority }}</p>
                </div>
                <div class="text-sm text-gray-600">
                  <span class="font-medium text-gray-800">Deadline:</span>
                  <p class="text-gray-700">{{ task.due_date }}</p>
                </div>
                <div class="text-sm text-gray-600">
                  <span class="font-medium text-gray-800">Status:</span>
                  <p class="text-gray-700">{{ task.status }}</p>
                </div>
                <div class="text-sm text-gray-600 col-span-2">
                  <span class="font-medium text-gray-800">Role Attached:</span>
                  <p class="text-gray-700">
                    {{ useRoleStore().roles.find(role => role.id == task.role_nature_id).name }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex justify-end border-t px-6 py-4 bg-gray-50">
              <button
                type="button"
                class="rounded-md bg-gray-800 px-5 py-2 text-sm text-white hover:bg-gray-700 transition"
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
