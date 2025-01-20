<template>
  <div class="flex w-full min-h-screen">
    <CommonSidebar />
    <main class="flex-1 ml-72">
      <!-- 사이드바 영역(20%) 만큼 마진 -->
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import CommonSidebar from './components/common/CommonSidebar.vue';
</script>
