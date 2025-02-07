<script setup lang="ts">
import ManagerHeader from '@/components/manager/ManagerHeader.vue';
import CategoryStats from '@/components/manager/stats/CategoryStats.vue';
import ManagerCategoryStats from '@/components/manager/stats/ManagerCategoryStats.vue';
// import ManagerDueTodayStats from '@/components/manager/stats/ManagerDueTodayStats.vue';
import ManagersStats from '@/components/manager/stats/ManagersStats.vue';
</script>

<template>
  <article class="mx-auto p-5">
    <ManagerHeader />
    <ManagerCategoryStats />
    <ManagersStats />
    <CategoryStats />
  </article>
</template>
