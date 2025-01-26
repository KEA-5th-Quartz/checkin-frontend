<script setup lang="ts">
import FirstLogin from '@/components/login/FirstLogin.vue';
</script>

<template>
  <article class="min-h-screen flex-center flex-col">
    <div class="max-w-[39%] w-full">
      <div class="flex-stack items-center">
        <h1 class="px-16 text-center max-w-fit text-2xl font-semibold border-b-4 border-primary-0 pb-5">
          비밀번호 변경
        </h1>
        <h2 class="text-xl text-gray-0 pt-5">최초 로그인 시에 비밀번호를 변경해주세요</h2>
      </div>
      <FirstLogin />
    </div>
  </article>
</template>
