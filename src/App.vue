<template>
  <div class="bg-red-100 dark:bg-black-0 text-black-0 dark:text-white-0 transition-colors">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>

    <DarkModeToggle />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import DarkModeToggle from './components/common/DarkModeToggle.vue';
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
