<template>
  <div class="flex w-full min-h-screen">
    <CommonSidebar />
    <main class="flex-1 ml-48 lg:ml-64">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import CommonSidebar from './components/common/CommonSidebar.vue';
</script>
