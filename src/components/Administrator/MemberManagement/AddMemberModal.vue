<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-black-0 bg-opacity-40 z-50">
    <div ref="modalRef" class="bg-white-0 p-10 rounded-lg shadow-lg w-[90%] max-w-lg">
      <!-- 모달 헤더 -->
      <div class="flex justify-between items-center mb-12">
        <h3 class="text-lg font-semibold text-black-0">인원 등록</h3>
        <button @click="closeModal" class="text-gray-0 hover:text-black-0">
          <SvgIcon :icon="XIcon" />
        </button>
      </div>

      <!-- 모달 본문 -->
      <div>
        <label class="block text-sm font-medium text-gray-0 mb-2">역할 선택</label>
        <select
          class="w-full border-b border-gray-2 rounded-md px-3 py-2 focus:outline-none focus:border-primary-0 mb-7 text-gray-1"
          v-model="formData.role"
        >
          <option value="" disabled hidden>관리자 / 담당자 / 사용자</option>
          <option value="관리자" class="text-black-2">관리자</option>
          <option value="담당자" class="text-black-2">담당자</option>
          <option value="사용자" class="text-black-2">사용자</option>
        </select>
        <label class="block text-sm font-medium text-gray-0 mb-2">이메일</label>
        <input
          type="email"
          class="w-full border-b border-gray-2 rounded-md px-3 py-2 focus:outline-none focus:border-primary-0 mb-7 placeholder-gray-1"
          v-model="formData.email"
          placeholder="이메일을 입력해주세요"
        />

        <label class="block text-sm font-medium text-gray-0 mb-2">아이디</label>
        <input
          type="name"
          class="w-full border-b border-gray-2 rounded-md px-3 py-2 focus:outline-none focus:border-primary-0 mb-7 placeholder-gray-1"
          v-model="formData.name"
          placeholder="아이디를 입력해주세요"
        />
      </div>

      <!-- 모달 푸터 -->
      <div class="flex justify-center mt-6">
        <button @click="closeModal" class="mr-5 px-6 py-2 bg-gray-2 text-black-0 rounded-md hover:opacity-80">
          취소
        </button>
        <button @click="handleSubmit" class="px-6 py-2 bg-primary-0 text-white-0 rounded-md hover:opacity-80">
          등록
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { XIcon } from '@/assets/icons/path';
import { onClickOutside } from '@vueuse/core';

const modalRef = ref(null);

// Props 및 Emits
defineProps({
  isOpen: Boolean,
});
const emit = defineEmits(['close', 'submit']);

// 폼 데이터
const formData = ref({
  name: '',
  email: '',
  role: '',
});

// 모달 닫기
function closeModal() {
  emit('close');
}

onClickOutside(modalRef, () => {
  closeModal();
});

// 폼 제출
function handleSubmit() {
  emit('submit', formData.value);
  closeModal();
}
</script>
