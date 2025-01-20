<script setup lang="ts">
import type { User } from '@/types/user';
import { userApi } from '@/services/userService/userService'; // 유저 관련 서비스 함수 import
import { TermCheckIcon } from '@/assets/icons/path';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { useCustomQuery } from '@/composables/useCustomQuery';

const {
  data: users,
  isLoading,
  error,
} = useCustomQuery<User[]>(['users'], () => userApi.getUsers().then((response) => response.data));

const deleteUser = async (id: number) => {
  if (!confirm('정말 삭제하시겠습니까?')) return; // 삭제 확인받는 창

  try {
    await userApi.deleteUser(id);
    if (users.value) {
      users.value = users.value.filter((user) => user.id !== id);
    }
  } catch (err) {
    alert('삭제에 실패했습니다.');
  }
};
</script>

<template>
  <div class="bg-white dark:bg-dark-bg text-black-0 dark:text-dark-text-primary">
    <p class="text-gray-0 dark:text-dark-text-secondary flex-center">
      유저 목록 테스트 페이지
      <SvgIcon
        :icon="{
          ...TermCheckIcon,
          fill: 'none',
          options: {
            stroke: '#22c55e',
            strokeWidth: 10,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          },
        }"
        class="w-8 h-8"
      />
    </p>
  </div>

  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">사용자 목록</h1>
    <div v-if="isLoading">로딩 중...</div>
    <div v-else-if="error" class="text-red-500">
      {{ error }}
    </div>

    <div v-else class="flex flex-col gap-4">
      <div v-for="user in users" :key="user.id" class="border p-4 rounded flex justify-between items-center">
        <div>
          <h3 class="font-bold">{{ user.username }}</h3>
        </div>

        <div class="flex gap-2">
          <!-- 버튼 클릭 시 deleteUser 함수 호출 -->
          <button @click="deleteUser(user.id)" class="bg-red-500 text-white px-4 py-2 rounded">삭제</button>
        </div>
      </div>
    </div>
  </div>
</template>
