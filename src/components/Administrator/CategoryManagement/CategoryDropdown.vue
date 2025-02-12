<template>
  <div class="relative" ref="dropdownRef">
    <!-- 점 3개 버튼 -->
    <button ref="buttonRef" @click.stop="toggleMenu" class="text-gray-0 hover:text-black-0">⋮</button>

    <!-- 드롭다운 메뉴 -->
    <ul
      v-if="isOpen"
      class="fixed bg-white-0 border border-gray-2 w-28 z-50 shadow-md rounded-md"
      :style="{ top: dropdownPosition.top, left: dropdownPosition.left, minWidth: '7rem' }"
    >
      <li @click="handleEdit" class="px-4 py-2 cursor-pointer hover:bg-gray-3">수정</li>
      <li @click="handleDelete" class="px-4 py-2 cursor-pointer text-red-1 hover:bg-gray-3">삭제</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

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

// 드롭다운 메뉴 상태
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const buttonRef = ref<HTMLButtonElement | null>(null);
const dropdownPosition = ref({ top: '0px', left: '0px' });

// 드롭다운 토글 및 위치 조정
async function toggleMenu(event: MouseEvent) {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    await nextTick(); // DOM 업데이트 후 실행
    adjustDropdownPosition(event.target as HTMLElement);
  }
}

function adjustDropdownPosition(button: HTMLElement | null) {
  if (!button) return;

  const rect = button.getBoundingClientRect();
  const dropdownWidth = 112; // 예상 드롭다운 너비 (w-28 기준)
  const dropdownHeight = 100; // 예상 드롭다운 높이
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  let top = rect.bottom + 5; // 버튼 아래 표시
  let left = rect.left; // 기본적으로 버튼 왼쪽 정렬

  // 화면 아래로 넘칠 경우 위로 배치
  if (rect.bottom + dropdownHeight > windowHeight) {
    top = rect.top - dropdownHeight - 5;
  }

  // 화면 오른쪽을 벗어나면 왼쪽으로 이동
  if (rect.right + dropdownWidth > windowWidth) {
    left = rect.right - dropdownWidth; // 오른쪽 끝 기준 정렬
  }

  dropdownPosition.value = { top: `${top}px`, left: `${left}px` };
}

// 외부 클릭 감지 핸들러
function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

// 창 크기 변경 시 드롭다운 위치 조정
function handleResize() {
  if (isOpen.value && buttonRef.value) {
    adjustDropdownPosition(buttonRef.value);
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

// 이벤트 리스너 등록 및 해제
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', handleResize);
});
</script>
