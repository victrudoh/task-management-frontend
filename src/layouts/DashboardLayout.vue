<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main content -->
    <div class="flex flex-col flex-1">
      <!-- Topbar -->
      <Topbar @search="handleSearch" />

      <!-- Page content -->
      <main class="p-6 overflow-y-auto">
        <router-view :search-query="searchQuery" />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import Topbar from '@/components/Topbar.vue'
import { ref } from 'vue';

const searchQuery = ref('')

const handleSearch = (query: string) => {
  searchQuery.value = query;
};
</script>
