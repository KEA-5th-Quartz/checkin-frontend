<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');

const handleLogin = async () => {
  try {
    console.log('로그인 정보:', {
      username: username.value,
      password: password.value,
    });

    // router.push('/');
  } catch (error) {
    console.error('로그인 실패:', error);
  }
};
</script>

<template>
  <div class="min-h-screen flex-center">
    <div class="max-w-[39%] w-full">
      <img class="h-44 w-auto mb-24 mx-auto" src="../assets/logo.png" alt="logo" />

      <form class="mt-8 flex-stack gap-6" @submit.prevent="handleLogin">
        <input
          v-model="username"
          type="text"
          required
          class="bg-transparent w-full px-3 py-3 border-b-2 border-primary-0 focus:outline-none placeholder:text-black-2"
          placeholder="Username"
        />

        <input
          v-model="password"
          type="password"
          required
          class="bg-transparent w-full px-3 py-3 border-b-2 border-primary-0 focus:outline-none placeholder:text-black-2"
          placeholder="Password"
        />

        <button
          type="submit"
          class="w-full flex justify-center mt-4 py-2.5 font-semibold rounded text-white-0 bg-[#2b3272] hover:bg-opacity-80 focus:outline-none"
        >
          로그인
        </button>

        <a href="#" class="block text-center text-sm text-gray-1 hover:text-gray-0">비밀번호 찾기</a>
      </form>
    </div>
  </div>
</template>
