<template>
  <div>
    <HeaderStats :adminCount="3" :managerCount="30" :userCount="120" />
    <SearchAndActions />
    <MemberTabs />
  </div>
</template>

<script setup lang="ts">
import HeaderStats from '../../components/Administrator/HeaderStats.vue';
import SearchAndActions from '../../components/Administrator/SearchAndActions.vue';
import MemberTabs from '../../components/Administrator/MemberTabs.vue';
</script>

<style scoped></style>
