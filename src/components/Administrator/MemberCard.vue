<template>
  <div class="flex flex-col items-center gap-6 bg-white-0 p-5 rounded-md shadow-sm border border-gray-2 relative">
    <!-- 점 메뉴 -->
    <div class="flex justify-end w-full">
      <button class="text-gray-0 hover:text-black-0" @click="toggleMenu">⋮</button>
    </div>
    <div class="w-14 h-14 rounded-full bg-gray-3 flex items-center justify-center overflow-hidden border border-gray-1">
      <img :src="member.profileImage" :alt="`${member.name}의 프로필 이미지`" class="w-full h-full object-cover" />
    </div>
    <div class="ml-4 flex-1">
      <p class="font-bold text-black-0">{{ member.name }}</p>
      <p class="text-gray-0">{{ member.email }}</p>
    </div>
    <div>
      <p class="text-gray-0">{{ member.role }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 멤버 데이터 (props로 전달받음)
const props = defineProps({
  member: {
    type: Object as () => {
      id: number;
      name: string;
      role: string;
      email: string;
      profileImage: string;
    },
    required: true,
  },
});
</script>

<style scoped></style>
