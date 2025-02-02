<script setup lang="ts">
import PasswordReset from '@/components/login/PasswordReset.vue';
</script>

<template>
  <article class="min-h-screen flex-center flex-col">
    <div class="max-w-[39%] w-full">
      <div class="flex-stack items-center">
        <h1 class="px-16 text-center max-w-fit text-2xl font-semibold border-b-4 border-primary-0 pb-5">
          비밀번호 재설정
        </h1>
      </div>
      <PasswordReset />
    </div>
  </article>
</template>
