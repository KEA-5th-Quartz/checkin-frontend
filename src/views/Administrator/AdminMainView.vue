<template>
  <div class="flex gap-5 p-5 h-screen">
    <AdminMainStatistics class="w-4/5 h-full overflow-y-auto hide-scrollbar" />
    <AdminTotalUserList class="w-1/5 h-full sticky top-0" />
  </div>
</template>

<script setup lang="ts">
import AdminMainStatistics from '@/components/Administrator/AdminMain/AdminMainStatistics.vue';
import AdminTotalUserList from '@/components/Administrator/AdminMain/AdminTotalUserList.vue';
</script>

<style scoped></style>
