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
              {{ user.name }}
            </DialogTitle>

            <div class="mt-4 space-y-2">
              <p class="text-sm text-gray-600">
                <span class="font-medium text-gray-800">Email:</span>
                {{ user.email }}
              </p>
            </div>

            <div class="mt-4 space-y-2">
              <p class="text-sm text-gray-600">
                <span class="font-medium text-gray-800">Role:</span>
                {{ user.role.name }}
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

// Props: we pass the user object and control open/close externally
const props = defineProps({
  isOpen: { type: Boolean, default: false },
  user: {
    type: Object,
    default: () => ({
      id: '',
      name: '',
      email: ''
    }),
  },
})

const emit = defineEmits(['close'])

function closeModal() {
  emit('close')
}
</script>
