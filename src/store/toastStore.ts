// stores/toastStore.js
import { defineStore } from "pinia"

export const useToastStore = defineStore("toast", {
  state: () => ({
    toasts: [] // { id, type, message }
  }),
  actions: {
    addToast(type:any, message:any, duration = 5000) {
      const id:any = Date.now()
      this.toasts.push({ id, type, message })

      setTimeout(() => {
        this.removeToast(id)
      }, duration)
    },
    removeToast(id:any) {
      this.toasts = this.toasts.filter(t => t.id !== id)
    },
    success(message:any) {
      this.addToast("success", message)
    },
    error(message:any) {
      this.addToast("error", message)
    },
    warning(message:any) {
      this.addToast("warning", message)
    },
    info(message:any) {
      this.addToast("info", message)
    }
  }
})
