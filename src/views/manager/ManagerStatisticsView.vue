<script setup lang="ts">
import ManagerHeader from '@/components/manager/ManagerHeader.vue';
import CategoryStats from '@/components/manager/stats/CategoryStats.vue';
import ManagerCategoryStats from '@/components/manager/stats/ManagerCategoryStats.vue';
import ManagersStats from '@/components/manager/stats/ManagersStats.vue';
</script>

<template>
  <div class="mx-auto h-screen overflow-auto hide-scrollbar">
    <ManagerHeader />
    <ManagerCategoryStats />
    <ManagersStats />
    <CategoryStats />
  </div>
</template>
