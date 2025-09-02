<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { useUserStore } from '@/store/userStore'
import { useRoleStore } from '@/store/roleStore'
import { useToastStore } from '@/store/toastStore'
import ViewUserModal from '@/components/ViewUserModal.vue'
import { useRoute, useRouter } from 'vue-router'

const userRole = useAuthStore().role // simulate logged-in role
const userStore = useUserStore()
const roleStore = useRoleStore()
const toast = useToastStore()
const isViewOpen = ref(false)
const selectedUser = ref({})

onMounted(() => {
  userStore.fetchUsers()
  roleStore.fetchRoles()}
)

const props = defineProps<{ searchQuery: string }>()

const filteredUsers = computed(() =>
  userStore.users.filter(user =>
    user.name.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(props.searchQuery.toLowerCase())
  )
);

const deleteUser = (id: any) => {
  userStore.removeUser(id).then(()=>userStore.fetchUsers())
  toast.success('User deleted successfully')
}

function openViewUser(user: any) {
  selectedUser.value = user
  isViewOpen.value = true
}

const editUserRole = (id: string, roleId: any) => {
  console.log(`Editing user ${id} role to ${roleId}`)
  userStore.editUser(id, {roleId:roleId}).then(() => {
    toast.success('User role updated successfully')
    userStore.fetchUsers()
  })
}

console.log(new Date (Date.now()-7*24*60*60*1000) > new Date('2025-08-10T09:56:23.237Z'))

const route = useRoute();
const router = useRouter();

// open from deep link
async function openFromQuery() {
  if (useAuthStore().role !== 'Admin' && useAuthStore().role !== 'Manager') {
    router.replace({ query: { ...route.query, userId: undefined, open: undefined } });
    router.replace('/dashboard/home')
    return};
  const qId = route.query.userId;
  if (!qId) return;

  // ensure tasks are loaded
  if (!Array.isArray(userStore.users) || !userStore.users.length) {
    await userStore.fetchUsers();
  }
  const idStr = String(qId);
  const user = userStore.users.find((t: any) => String(t.id) === idStr);
  if (user) {
    openViewUser(user);
  }

  // clean up the query so refreshes don’t reopen
  router.replace({ query: { ...route.query, userId: undefined, open: undefined } });
}

// run on first mount and whenever the query changes
watch(() => route.query.userId, () => { openFromQuery(); });
onMounted(() => { openFromQuery(); });
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-10 mt-5">Users</h1>

    <!-- Table wrapper -->
    <div class="overflow-x-auto rounded border border-gray-200 bg-white">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 text-gray-600">
          <tr class="text-left">
            <th class="px-4 py-3 font-semibold">Name</th>
            <th class="px-4 py-3 font-semibold">Email</th>
            <th class="px-4 py-3 font-semibold">Role</th>
            <th class="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          <!-- Empty state -->
          <tr v-if="filteredUsers.length == 0">
            <td class="px-4 py-4 text-gray-500" colspan="4">No found</td>
          </tr>

          <!-- Rows -->
          <tr
            v-for="user in filteredUsers"
            :key="user.id"
            :data-user-row="user.id"
            class="odd:bg-white even:bg-gray-50 hover:bg-black/[0.03]"
          >
            <!-- Name + "new" badge (unchanged logic) -->
            <td class="px-4 py-3 align-middle">
              <div class="flex items-center space-x-2">
                <span class="font-semibold">{{ user.name }}</span>
                <span
                  v-if="new Date (Date.now()-7*24*60*60*1000) < new Date(user.createdAt)"
                  class="bg-green-500 text-white p-1 text-[8px] rounded"
                >
                  new
                </span>
              </div>
            </td>

            <!-- Email -->
            <td class="px-4 py-3 align-middle">
              <span class="rounded text-xs p-2">{{ user.email }}</span>
            </td>

            <!-- Role (keep your existing select/handlers as-is) -->
            <td class="px-4 py-3 align-middle">
              <select
                class="border p-2 rounded text-xs w-fit"
                v-model="user.role_id"
                @change="editUserRole(user.id, user.role_id)"
              >
                <option
                  v-for="role in roleStore.roles"
                  :key="role.id"
                  :value="role.id"
                >
                  {{ role.name }}
                </option>
              </select>
            </td>

            <!-- Actions (keep your buttons/conditions as-is) -->
            <td class="px-4 py-3 align-middle">
              <div class="flex items-center justify-end gap-2">
                <button
                  @click="openViewUser(user)"
                  class="rounded p-2 hover:bg-black/[0.04] text-blue-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" fill="none" />
                    <path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h6q.425 0 .713.288T12 4t-.288.713T11 5H5v14h14v-6q0-.425.288-.712T20 12t.713.288T21 13v6q0 .825-.587 1.413T19 21zM19 6.4L10.4 15q-.275.275-.7.275T9 15t-.275-.7t.275-.7L17.6 5H15q-.425 0-.712-.288T14 4t.288-.712T15 3h5q.425 0 .713.288T21 4v5q0 .425-.288.713T20 10t-.712-.288T19 9z" />
                  </svg>
                </button>

                <!-- Keep your original v-if condition for delete -->
                <button
                  @click="deleteUser(user.id)"
                  v-if="userRole=='Admin' || userRole=='Manager'"
                  class="rounded p-2 hover:bg-red-500/10"
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

    <!-- Modal (unchanged) -->
    <ViewUserModal
      :isOpen="isViewOpen"
      :user="selectedUser"
      @close="isViewOpen = false"
    />
  </div>
</template>

