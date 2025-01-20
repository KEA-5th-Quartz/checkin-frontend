<script setup lang="ts">
import ManagerHeader from '@/components/manager/ManagerHeader.vue';
</script>

<template>
  <article class="max-w-[1600px] mx-auto">
    <ManagerHeader />

    <section class="flex justify-between">
      <div>
        <input placeholder="티켓 검색" />
      </div>

      <div class="flex gap-10">
        <div>10개</div>

        <div>필터</div>
      </div>
    </section>
  </article>
</template>
