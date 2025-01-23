<script setup lang="ts">
import UserBoard from '@/components/user/UserBoard.vue';
import UserSearchFilter from '@/components/user/UserSearchFilter.vue';
</script>

<template>
  <article class="mx-auto">
    <UserSearchFilter />
    <UserBoard />
  </article>
</template>
