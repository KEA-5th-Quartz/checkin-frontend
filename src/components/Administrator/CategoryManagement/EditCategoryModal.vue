<template>
  <div v-if="isOpen" class="fixed inset-0 flex-center bg-black-0 bg-opacity-50 z-50" @click="closeModal">
    <div class="bg-white-0 p-6 rounded-lg shadow-lg w-[90%] max-w-lg" @click.stop>
      <!-- 모달 헤더 -->
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-semibold text-black-0">카테고리 수정</h3>
        <button @click="closeModal" class="text-gray-0 hover:text-black-0 text-lg">✕</button>
      </div>
      <!-- 모달 본문 -->
      <div>
        <label class="block text-sm font-medium text-gray-0 mb-2">카테고리 이름</label>
        <input
          type="text"
          v-model="updatedName"
          class="w-full border-b border-gray-2 focus:outline-none focus:border-primary-3 px-2 py-1"
          placeholder="카테고리 이름을 입력하세요"
        />
        <p v-if="errorMessage" class="text-sm text-red-500 mt-1">{{ errorMessage }}</p>
      </div>
      <!-- 모달 푸터 -->
      <div class="flex justify-end mt-6">
        <button @click="closeModal" class="px-4 py-2 mr-3 bg-gray-2 text-black-0 rounded-md hover:opacity-80">
          취소
        </button>
        <button @click="submitEdit" class="px-4 py-2 bg-primary-0 text-white-0 rounded-md hover:opacity-80">
          확인
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';

// Props 정의
const props = defineProps({
  isOpen: Boolean,
  category: {
    type: Object as () => { id: number; name: string },
    required: true,
    default: () => ({ id: 0, name: '' }), // 기본값 추가
  },
});

// Emits 정의
const emit = defineEmits(['close', 'submit']);

const updatedName = ref('');
const errorMessage = ref('');

// 모달이 열릴 때마다 updatedName을 업데이트
watch(
  () => props.category,
  (newCategory) => {
    updatedName.value = newCategory?.name || ''; // 카테고리 이름이 없으면 빈 문자열로 설정
  },
  { immediate: true },
);

function resetState() {
  errorMessage.value = '';
}

// 모달 닫기
function closeModal() {
  emit('close');
  resetState();
}

// 수정된 이름 제출
function submitEdit() {
  if (!updatedName.value.trim()) {
    errorMessage.value = '카테고리 이름을 입력해주세요.';
    return;
  }
  emit('submit', { ...props.category, name: updatedName.value });
  closeModal();
}
</script>
