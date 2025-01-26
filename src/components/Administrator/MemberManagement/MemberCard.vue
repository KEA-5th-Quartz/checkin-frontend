<template>
  <div class="max-h-fit flex-stack items-center bg-white-0 p-5 rounded-md shadow-sm border border-gray-2 relative">
    <div class="flex justify-end w-full">
      <button class="text-gray-0 hover:text-black-0" @click="toggleMenu">⋮</button>
    </div>
    <div
      class="w-[70px] h-[70px] rounded-full bg-gray-3 flex items-center justify-center overflow-hidden border border-gray-1"
    >
      <!-- <img :src="member.profileImage" :alt="`${member.name}의 프로필 이미지`" class="w-full h-full object-cover" /> -->
      <div class="w-[77px] h-[77px] rounded-full bg-gray-2" />
    </div>
    <div class="flex-stack items-center mt-4">
      <p class="font-bold text-black-0">{{ member.name }}</p>
      <p class="text-gray-1">{{ member.email }}</p>
    </div>
    <div class="mt-8">
      <p class="text-gray-1">{{ member.role }}</p>
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
