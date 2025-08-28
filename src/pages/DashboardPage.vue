<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/store/authStore'

const authStore = useAuthStore()
const userRole = authStore.role

const isAdmin = computed(() => userRole === 'Admin')
const isManager = computed(() => userRole === 'Manager')
const canManage = computed(() => isAdmin.value || isManager.value)

type Item = { label: string; allowed: boolean }
type Section = { title: string; icon: 'roles' | 'users' | 'tasks'; accent: string; items: Item[] }

const sections = computed<Section[]>(() => [
  {
    title: 'Roles Management',
    icon: 'roles',
    accent: 'from-indigo-500/15 to-sky-500/15 text-indigo-600',
    items: [
      { label: 'Create roles', allowed: isAdmin.value },
      { label: 'Update roles', allowed: isAdmin.value },
      { label: 'View roles', allowed: canManage.value },
      { label: 'Delete roles', allowed: isAdmin.value },
    ],
  },
  {
    title: 'User Management',
    icon: 'users',
    accent: 'from-amber-500/15 to-orange-500/15 text-amber-600',
    items: [
      { label: 'View your profile', allowed: true },
      { label: 'View users', allowed: canManage.value },
      { label: 'Delete users', allowed: canManage.value },
      { label: 'Access other users', allowed: canManage.value },
    ],
  },
  {
    title: 'Task Management',
    icon: 'tasks',
    accent: 'from-emerald-500/15 to-teal-500/15 text-emerald-600',
    items: [
      { label: 'Create tasks', allowed: canManage.value },
      { label: 'Update tasks', allowed: true },
      { label: 'View tasks', allowed: true },
      { label: 'Delete tasks', allowed: canManage.value },
    ],
  },
])

const iconFor = (name: Section['icon']) => {
  if (name === 'roles') {
    return `
      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M20 21v-2a4 4 0 0 0-4-4h-2" />
        <path d="M4 21v-2a4 4 0 0 1 4-4h2" />
        <circle cx="9" cy="7" r="3" />
        <circle cx="17" cy="7" r="3" />
      </svg>`
  }
  if (name === 'users') {
    return `
      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>`
  }
  return `
    <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 8h10M7 12h6M7 16h4" />
    </svg>`
}
</script>

<template>
  <section class="relative">
    <!-- Background accents -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-10 opacity-40"
      style="
        background-image:
          radial-gradient(1200px 400px at 10% -10%, rgba(56,189,248,0.12), transparent 60%),
          radial-gradient(1200px 400px at 110% 10%, rgba(99,102,241,0.12), transparent 60%);
      "
    />
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-10"
      style="
        background-image:
          linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
        background-size: 24px 24px;
        mask-image: radial-gradient(ellipse at center, black, transparent 75%);
      "
    />

    <!-- Hero -->
    <div class="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p class="text-xs uppercase tracking-wider text-gray-500">Dashboard</p>
          <h1 class="mt-1 bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-3xl font-extrabold text-transparent">
            Welcome to your Dashboard
          </h1>
          <p class="mt-1 text-sm text-gray-600">Here’s what you can do based on your role.</p>
        </div>

        <span class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700">
          <span class="h-2 w-2 rounded-full"
                :class="{'bg-emerald-500': isAdmin || isManager, 'bg-gray-400': !(isAdmin || isManager)}" />
          <span class="uppercase tracking-wide">Role: {{ userRole }}</span>
        </span>
      </div>
    </div>

    <!-- Feature Cards -->
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="sec in sections"
        :key="sec.title"
        class="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
      >
        <!-- soft accent bg -->
        <div :class="['absolute -right-16 -top-16 h-40 w-40 rounded-full blur-2xl', 'bg-gradient-to-br', sec.accent]" />
        <div class="relative flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-white ring-1 ring-gray-200 shadow-sm text-current"
            :class="sec.accent"
            v-html="iconFor(sec.icon)"
          />
          <h2 class="text-lg font-semibold text-gray-900">{{ sec.title }}</h2>
        </div>

        <ul class="relative mt-4 space-y-2">
          <li
            v-for="item in sec.items"
            :key="item.label"
            class="flex items-start gap-2"
          >
            <span
              class="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full"
              :class="item.allowed ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'"
            >
              <svg v-if="item.allowed" viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <svg v-else viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </span>
            <span
              class="text-sm"
              :class="item.allowed ? 'text-gray-800' : 'text-gray-400 line-through'"
            >
              {{ item.label }}
            </span>
          </li>
        </ul>

        <!-- subtle footer -->
        <div class="mt-5 h-px w-full bg-gradient-to-r from-black/5 via-black/10 to-transparent" />
        <div class="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>Permissions reflect your current role.</span>
          <span class="opacity-0 transition group-hover:opacity-100">✨</span>
        </div>
      </div>
    </div>
  </section>
</template>
