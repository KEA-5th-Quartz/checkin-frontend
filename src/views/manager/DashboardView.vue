<script setup lang="ts">
import ManagerBoard from '@/components/manager/dashboard/ManagerBoard.vue';
import ManagerSearchFilter from '@/components/manager/dashboard/ManagerSearchFilter.vue';
import ManagerHeader from '@/components/manager/ManagerHeader.vue';
</script>

<template>
  <article class="mx-auto">
    <ManagerHeader />
    <ManagerSearchFilter />
    <ManagerBoard />
  </article>
</template>
