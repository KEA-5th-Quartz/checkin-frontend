<script setup lang="ts">
import PasswordResetEmail from '@/components/login/PasswordResetEmail.vue';
</script>

<template>
  <article class="min-h-screen flex-center flex-col">
    <div class="max-w-[39%] w-full">
      <div class="flex-stack items-center">
        <h1 class="px-16 text-center max-w-fit text-2xl font-semibold border-b-4 border-primary-0 pb-5">
          비밀번호 재설정
        </h1>
        <h2 class="text-xl text-gray-0 pt-5">가입 아이디를 입력해주세요.</h2>
      </div>
      <PasswordResetEmail />
    </div>

    <a href="/" class="login-password-reset px-10">뒤로</a>
  </article>
</template>
