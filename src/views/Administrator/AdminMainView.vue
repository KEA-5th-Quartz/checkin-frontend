<template>
  <div class="flex gap-5 p-5 h-screen">
    <AdminMainStatistics class="flex-[4] h-full overflow-y-auto hide-scrollbar" />
    <AdminTotalUserList class="flex-[1] h-full sticky top-0" />
  </div>
</template>

<script setup lang="ts">
import AdminMainStatistics from '@/components/Administrator/AdminMain/AdminMainStatistics.vue';
import AdminTotalUserList from '@/components/Administrator/AdminMain/AdminTotalUserList.vue';
</script>

<style scoped></style>
