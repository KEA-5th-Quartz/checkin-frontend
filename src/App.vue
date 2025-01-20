<template>
  <div>
    <CommonSidebar />

    <router-view />
  </div>
</template>

<script setup lang="ts">
import CommonSidebar from './components/common/CommonSidebar.vue';
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
