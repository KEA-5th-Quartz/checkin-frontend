<template>
  <div class="relative">
    <!-- 점 3개 버튼 -->
    <button @click="toggleMenu" class="text-gray-0 hover:text-black-0">⋮</button>

    <!-- 드롭다운 메뉴 -->
    <ul v-if="isOpen" class="absolute right-0 mt-2 bg-white-0 border border-gray-2 rounded-md shadow-lg w-28">
      <li @click="emitEdit" class="px-4 py-2 cursor-pointer hover:bg-gray-3">수정</li>
      <li @click="emitDelete" class="px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-3">삭제</li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

// 드롭다운 메뉴 열림 상태
const isOpen = ref(false);

// 드롭다운 토글
function toggleMenu() {
  isOpen.value = !isOpen.value;
}

// 수정 이벤트
function emitEdit() {
  console.log('Edit');
}

// 삭제 이벤트
function emitDelete() {
  console.log('Delete');
}
</script>
