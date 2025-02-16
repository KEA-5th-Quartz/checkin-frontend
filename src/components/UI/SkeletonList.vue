<template>
  <div class="flex flex-col gap-2 ml-5">
    <div v-for="n in 5" :key="n" class="flex items-center gap-4 animate-pulse">
      <div class="w-8 h-8 rounded-full bg-gray-300" />
      <div class="w-24 h-4 bg-gray-300 rounded" />
    </div>
  </div>
</template>
