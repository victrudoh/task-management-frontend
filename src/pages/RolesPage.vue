<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { useRoleStore } from '@/store/roleStore'
import { useToastStore } from '@/store/toastStore'
import CreateRoleModal from '@/components/CreateRoleModal.vue'
import { useRoute, useRouter } from 'vue-router'

const auth = useAuthStore()
const userRole = auth.role
// const isAdminOrManager = computed(() => userRole === 'Admin' || userRole === 'Manager')
const isAdmin = computed(() => userRole === 'Admin')

const roleStore = useRoleStore()
const toast = useToastStore()
const isModalOpen = ref(false)

onMounted(async () => {
  await roleStore.fetchRoles()
})

const props = defineProps<{ searchQuery?: string }>()

// filter
const asString = (v: unknown) => (v == null ? '' : typeof v === 'string' ? v : String(v))
const lower = (v: unknown) => asString(v).toLowerCase()
const filteredRoles = computed(() => {
  const q = lower(props.searchQuery).trim()
  if (!q) return roleStore.roles
  return roleStore.roles.filter((r: any) =>
    [lower(r?.name), lower(r?.description ?? '')].join(' ').includes(q)
  )
})

// equal-width columns
const totalCols = computed(() => (isAdmin.value ? 2 : 1)) // Role, (Actions?)
const colWidth = computed(() => `${(100 / totalCols.value).toFixed(6)}%`)

// sticky header shadow
const scroller = ref<HTMLElement | null>(null)
const headerHasShadow = ref(false)
const updateHeaderShadow = () => { headerHasShadow.value = !!scroller.value && scroller.value.scrollTop > 0 }
onMounted(() => scroller.value?.addEventListener('scroll', updateHeaderShadow, { passive: true }))
watch(() => filteredRoles.value.length, () => requestAnimationFrame(updateHeaderShadow))

// deep-link: /roles?roleId=123 (highlight row)
const route = useRoute()
const router = useRouter()
const highlightedId = computed(() => String(route.query.roleId || ''))
async function openFromQuery() {
  const qId = route.query.roleId
  if (!qId) return
  if (!Array.isArray(roleStore.roles) || !roleStore.roles.length) {
    await roleStore.fetchRoles()
  }
  // (no modal here; just highlight/scroll)
  const idStr = String(qId)
  requestAnimationFrame(() => {
    document.querySelector(`[data-role-row="${idStr}"]`)?.scrollIntoView?.({ block: 'center', behavior: 'smooth' })
  })
  router.replace({ query: { ...route.query, roleId: undefined } })
}
onMounted(openFromQuery)
watch(() => route.query.roleId, openFromQuery)

// actions
function openCreateRole() { isModalOpen.value = true }
async function deleteRole(id: any) {
  try {
    if ((roleStore as any).deleteRole) await (roleStore as any).deleteRole(id)
    else if ((roleStore as any).removeRole) await (roleStore as any).removeRole(id)
    else throw new Error('deleteRole/removeRole not found on roleStore')
    await roleStore.fetchRoles()
    toast.success('Role deleted successfully')
  } catch (e: any) {
    toast.error(e?.message || 'Failed to delete role')
  }
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 mt-5 flex items-center justify-between">
      <h1 class="text-2xl font-bold">Roles</h1>
      <button
        v-if="isAdmin"
        @click="openCreateRole"
        class="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="mr-1 inline h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1z" clip-rule="evenodd" />
        </svg>
        Create Role
      </button>
    </div>

    <!-- Table -->
    <div class="relative max-h-[70vh] overflow-x-auto overflow-y-auto rounded border border-gray-200 bg-white" ref="scroller">
      <table class="min-w-full table-fixed text-sm">
        <thead
          class="sticky top-0 z-10 border-b bg-white/95 backdrop-blur"
          :class="headerHasShadow ? 'shadow-sm' : ''"
        >
          <tr class="text-left text-gray-600">
            <th class="px-4 py-3 font-semibold" :style="{ width: colWidth }">Role</th>
            <th v-if="isAdmin" class="px-4 py-3 text-right font-semibold" :style="{ width: colWidth }">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="filteredRoles.length === 0">
            <td :colspan="totalCols" class="px-4 py-4 text-gray-500">No roles found</td>
          </tr>

          <tr
            v-for="role in filteredRoles"
            :key="role.id"
            :data-role-row="role.id"
            class="odd:bg-white even:bg-gray-50 hover:bg-black/[0.03]"
            :class="String(role.id) === highlightedId ? 'ring-2 ring-blue-400 ring-offset-1' : ''"
          >
            <td class="px-4 py-3 align-middle truncate whitespace-nowrap overflow-hidden" :style="{ width: colWidth }">
              {{ role?.name ?? '—' }}
            </td>
            <td v-if="isAdmin" class="px-4 py-3 align-middle" :style="{ width: colWidth }">
              <div class="flex items-center justify-end gap-2">
                <button
                  @click="deleteRole(role.id)"
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

    <!-- Modal -->
    <CreateRoleModal :isOpen="isModalOpen" @close="isModalOpen = false" />
  </div>
</template>
