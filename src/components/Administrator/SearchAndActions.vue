<template>
  <div class="flex justify-between items-center p-4 mx-auto w-[80%]">
    <!-- 검색 필드 -->
    <div class="flex items-center px-4 py-2 rounded-md shadow-sm w-full max-w-md">
      <SvgIcon
        :icon="{
          width: 20,
          height: 20,
          path: 'M15.5 14h-.79l-.28-.27a6.471 6.471 0 001.48-5.34C14.69 5.02 12.34 3 9.5 3S4.31 5.02 4.09 8.39c-.17 2.2.81 4.21 2.4 5.34l.27.28v.79l4.51 4.51a.996.996 0 001.41 0l4.51-4.51a.996.996 0 000-1.41L15.5 14zm-6 0C8.01 14 7 13 7 11.5S8.01 9 9.5 9s2.5 1.01 2.5 2.5S10.99 14 9.5 14z',
          fill: '#959393',
        }"
      />
      <input
        type="text"
        class="bg-transparent focus:outline-none pl-3 text-gray-0 w-full"
        placeholder="인원 검색..."
        v-model="searchText"
      />
    </div>

    <!-- 인원 등록 버튼 -->
    <button
      class="ml-4 bg-primary-3 text-white-0 px-6 py-2 rounded-md shadow-md hover:bg-primary-4"
      @click="handleAddMember"
    >
      인원 등록
    </button>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/common/SvgIcon.vue';
import { ref } from 'vue';

// 검색어 상태
const searchText = ref('');

// "인원 등록" 버튼 클릭 핸들러
function handleAddMember() {
  console.log('인원 등록 버튼 클릭');
}
</script>

<style scoped></style>
