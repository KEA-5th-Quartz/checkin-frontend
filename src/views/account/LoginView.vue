<script setup lang="ts">
import MainLogin from '@/components/login/MainLogin.vue';
</script>

<template>
  <article class="min-h-screen flex-center">
    <div class="max-w-[39%] w-full">
      <img class="h-44 w-auto mb-24 mx-auto" src="../../assets/logo.png" alt="logo" />
      <MainLogin />
      <a href="/password-reset-email" class="login-password-reset">비밀번호 찾기</a>
    </div>
  </article>
</template>
