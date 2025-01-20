<script setup lang="ts">
import ManagerHeader from '@/components/manager/ManagerHeader.vue';
import ManagerSearchFilter from '@/components/manager/ManagerSearchFilter.vue';
import ManagerBoard from '@/components/manager/ManagerBoard.vue';
</script>

<template>
  <article class="max-w-[1600px] mx-auto">
    <ManagerHeader />
    <ManagerSearchFilter />
    <ManagerBoard />
  </article>
</template>
