<template>
  <div class="relative" ref="dropdownRef">
    <!-- 점 3개 버튼 -->
    <button @click.stop="toggleMenu" class="text-gray-0 hover:text-black-0">⋮</button>

    <!-- 드롭다운 메뉴 -->
    <ul v-if="isOpen" class="absolute right-0 mt-2 bg-white-0 border border-gray-2 rounded-md shadow-lg w-28 z-50">
      <li @click="handleEdit" class="px-4 py-2 cursor-pointer hover:bg-gray-3">수정</li>
      <li @click="handleDelete" class="px-4 py-2 cursor-pointer text-red-1 hover:bg-gray-3">삭제</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// Props 정의
const props = defineProps({
  category: {
    type: Object as () => {
      id: number;
      name: string;
    },
    required: true,
  },
});

// Emits 정의
const emit = defineEmits(['edit', 'delete']);

// 드롭다운 메뉴 열림 상태
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

// 드롭다운 토글
function toggleMenu() {
  isOpen.value = !isOpen.value;
}

// 외부 클릭 감지 핸들러
function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

// 수정 이벤트 핸들러
function handleEdit() {
  emit('edit', props.category);
  isOpen.value = false;
}

// 삭제 이벤트 핸들러
function handleDelete() {
  emit('delete', props.category);
  isOpen.value = false;
}

// 컴포넌트가 마운트될 때 이벤트 등록
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

// 컴포넌트가 언마운트될 때 이벤트 제거
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
