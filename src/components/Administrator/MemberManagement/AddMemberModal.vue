<template>
  <div v-if="isOpen" class="fixed inset-0 flex-center bg-black-2 bg-opacity-50 backdrop-blur-[2px] cursor-default z-50">
    <div ref="modalRef" class="card-base p-10 shadow-lg w-[90%] max-w-lg">
      <!-- 모달 헤더 -->
      <div class="flex-between mb-12">
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
          <option value="ADMIN" class="text-black-2">관리자</option>
          <option value="MANAGER" class="text-black-2">담당자</option>
          <option value="USER" class="text-black-2">사용자</option>
        </select>
        <label class="block text-sm font-medium text-gray-0 mb-2">이메일</label>
        <div class="flex items-center gap-2 mb-2">
          <input
            type="email"
            v-model="formData.email"
            @input="resetEmailValidation"
            @blur="validateEmail"
            class="w-full border-b border-gray-2 rounded-md px-3 py-2 focus:outline-none focus:border-primary-0 placeholder-gray-1"
            placeholder="이메일을 입력해주세요"
          />
        </div>
        <p v-if="emailError" class="text-red-1 text-sm mb-3">{{ emailError }}</p>
        <p v-if="isEmailValid" class="text-green-1 text-sm mb-3">사용 가능한 이메일입니다.</p>

        <label class="block text-sm font-medium text-gray-0 mb-2">아이디</label>
        <div class="flex items-center gap-2 mb-2">
          <input
            type="text"
            v-model="formData.username"
            @input="resetUsernameValidation"
            @blur="validateUsername"
            class="w-full border-b border-gray-2 rounded-md px-3 py-2 focus:outline-none focus:border-primary-0 placeholder-gray-1"
            placeholder="아이디를 입력해주세요"
          />
        </div>
        <p v-if="usernameError" class="text-red-1 text-sm mb-3">{{ usernameError }}</p>
        <p v-if="isUsernameValid" class="text-green-1 text-sm mb-3">사용 가능한 아이디입니다.</p>
      </div>

      <!-- 모달 푸터 -->
      <div class="flex justify-center mt-6">
        <button @click="closeModal" class="mr-5 px-6 py-2 bg-gray-2 text-black-0 rounded-md hover:opacity-80">
          취소
        </button>
        <button
          @click="handleSubmit"
          class="px-6 py-2 rounded-md hover:opacity-80 transition duration-300"
          :class="{
            'bg-primary-0 text-white-0': isFormValid, // 모든 조건 충족 시 버튼 활성화되면서 색상이 들어옴
            'bg-gray-2 text-gray-1 cursor-not-allowed': !isFormValid, // 조건 미충족 시 회색 배경 및 비활성화 스타일
          }"
          :disabled="!isFormValid"
        >
          등록
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from 'vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { XIcon } from '@/assets/icons/path';
import { onClickOutside } from '@vueuse/core';
import { memberApi } from '@/services/memberService/memberService';

const modalRef = ref(null);

// Props 및 Emits
defineProps({
  isOpen: Boolean,
});
const emit = defineEmits(['close', 'submit']);

// 폼 데이터
const formData = ref({
  username: '', // 서버에서 요구하는 `username` 키로 변경
  email: '',
  role: '',
});

const usernameError = ref('');
const emailError = ref('');
const isUsernameValid = ref(false);
const isEmailValid = ref(false);

// 아이디 중복 검사
async function validateUsername() {
  if (!formData.value.username.trim()) {
    usernameError.value = '아이디를 입력해주세요.';
    isUsernameValid.value = false;
    return;
  }
  try {
    await memberApi.checkUsername(formData.value.username);
    usernameError.value = ''; // 중복되지 않음
    isUsernameValid.value = true;
  } catch (err) {
    console.error('아이디 중복 검사 실패 :', err);
    usernameError.value = '이미 사용 중인 아이디입니다.';
    isUsernameValid.value = false;
  }
}

// 이메일 중복 검사
async function validateEmail() {
  if (!formData.value.email.trim()) {
    emailError.value = '이메일을 입력해주세요.';
    isEmailValid.value = false;
    return;
  }
  try {
    await memberApi.checkEmail(formData.value.email);
    emailError.value = ''; // 중복되지 않음
    isEmailValid.value = true;
  } catch (err) {
    console.error('이메일 중복 검사 실패 :', err);
    emailError.value = '이미 사용 중인 이메일입니다.';
    isEmailValid.value = false;
  }
}

// 모달 닫기
function closeModal() {
  emit('close');
}

onClickOutside(modalRef, () => {
  closeModal();
});

// 입력 변경 시 valid 상태 초기화
function resetUsernameValidation() {
  isUsernameValid.value = false;
  usernameError.value = '';
}

function resetEmailValidation() {
  isEmailValid.value = false;
  emailError.value = '';
}

// 모든 조건 충족 시 "등록" 버튼 활성화
const isFormValid = computed(() => isUsernameValid.value && isEmailValid.value && formData.value.role);

// 폼 제출 핸들러 (회원 등록)
function handleSubmit() {
  if (!isFormValid.value) {
    return;
  }

  emit('submit', { ...formData.value });
  closeModal();
}
</script>
