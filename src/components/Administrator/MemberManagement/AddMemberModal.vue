<template>
  <div v-if="isOpen" class="member-modal-overlay">
    <div ref="modalRef" class="member-modal-container">
      <div class="member-modal-header">
        <h3 class="text-lg font-semibold text-black-0">인원 등록</h3>
        <button @click="closeModal" class="text-gray-0 hover:text-black-0">
          <SvgIcon :icon="XIcon" />
        </button>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-0 mb-2">역할 선택</label>
        <select class="member-modal-input mb-7" v-model="formData.role">
          <option value="" disabled hidden>관리자 / 담당자 / 사용자</option>
          <option value="ADMIN" class="text-black-2">관리자</option>
          <option value="MANAGER" class="text-black-2">담당자</option>
          <option value="USER" class="text-black-2">사용자</option>
        </select>
        <label class="block text-sm font-medium text-gray-0 mb-2">이메일</label>
        <div class="flex items-center gap-2 mb-2">
          <CommonInput
            v-model="formData.email"
            type="email"
            placeholder="이메일을 입력해주세요"
            class="member-modal-input"
            @input="resetEmailValidation"
            @blur="validateEmail"
          />
        </div>
        <p v-if="emailError" class="member-modal-error">{{ emailError }}</p>
        <p v-if="isEmailValid" class="member-modal-success">사용 가능한 이메일입니다.</p>
        <label class="block text-sm font-medium text-gray-0 mb-2">아이디</label>
        <div class="flex items-center gap-2 mb-2">
          <CommonInput
            v-model="formData.username"
            maxlength="16"
            type="text"
            placeholder="아이디를 입력해주세요"
            class="member-modal-input"
            @input="resetUsernameValidation"
            @blur="validateUsername"
          />
        </div>
        <p v-if="usernameError" class="member-modal-error">{{ usernameError }}</p>
        <p v-if="isUsernameValid" class="member-modal-success">사용 가능한 아이디입니다.</p>
      </div>
      <div class="flex justify-center mt-6">
        <button @click="closeModal" class="member-modal-button bg-gray-2 text-black-0 mr-5 hover:opacity-80">
          취소
        </button>
        <button
          @click="handleSubmit"
          class="member-modal-button"
          :class="isFormValid ? 'member-modal-button-active' : 'member-modal-button-disabled'"
          :disabled="!isFormValid"
        >
          등록
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, watch } from 'vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { XIcon } from '@/assets/icons/path';
import { onClickOutside } from '@vueuse/core';
import { memberApi } from '@/services/memberService/memberService';
import { isApiError } from '@/types/common/error';
import CommonInput from '@/components/common/CommonInput.vue';

const modalRef = ref(null);

const props = defineProps({
  isOpen: Boolean,
});
const emit = defineEmits(['close', 'submit']);

const formData = ref({
  username: '',
  email: '',
  role: '',
});

const usernameError = ref('');
const emailError = ref('');
const isUsernameValid = ref(false);
const isEmailValid = ref(false);

async function validateUsername() {
  if (!formData.value.username.trim()) {
    usernameError.value = '아이디를 입력해주세요.';
    isUsernameValid.value = false;
    return;
  }
  try {
    await memberApi.checkUsername(formData.value.username);
    usernameError.value = '';
    isUsernameValid.value = true;
  } catch (error: unknown) {
    if (isApiError(error)) {
      if (error.code === 'COMMON_4000') {
        usernameError.value = '아이디 규칙에 맞지 않습니다.\n[알파벳 소문자 3~10개] + . + [알파벳 소문자 1~5개]';
      } else if (error.code === 'MEMBER_4090') {
        usernameError.value = '이미 사용 중인 아이디입니다.';
      } else {
        usernameError.value = '아이디 중복 검사 중 오류가 발생했습니다.';
      }
    } else {
      usernameError.value = '알 수 없는 오류가 발생했습니다.';
    }
    isUsernameValid.value = false;
  }
}

async function validateEmail() {
  if (!formData.value.email.trim()) {
    emailError.value = '이메일을 입력해주세요.';
    isEmailValid.value = false;
    return;
  }
  try {
    await memberApi.checkEmail(formData.value.email);
    emailError.value = '';
    isEmailValid.value = true;
  } catch (error: unknown) {
    if (isApiError(error)) {
      if (error.code === 'COMMON_4000') {
        emailError.value = '이메일 형식에 맞지 않습니다.';
      } else if (error.code === 'MEMBER_4091') {
        emailError.value = '이미 사용 중인 이메일입니다.';
      } else {
        emailError.value = '이메일 중복 검사 중 오류가 발생했습니다.';
      }
    } else {
      emailError.value = '알 수 없는 오류가 발생했습니다.';
    }
    isEmailValid.value = false;
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter' && isFormValid.value) {
    event.preventDefault();
    handleSubmit();
  }
}

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
  },
);

function resetForm() {
  formData.value = { username: '', email: '', role: '' };
  usernameError.value = '';
  emailError.value = '';
  isUsernameValid.value = false;
  isEmailValid.value = false;
}

function closeModal() {
  resetForm();
  emit('close');
}

onClickOutside(modalRef, () => {
  closeModal();
});

function resetUsernameValidation() {
  isUsernameValid.value = false;
  usernameError.value = '';
}

function resetEmailValidation() {
  isEmailValid.value = false;
  emailError.value = '';
}

const isFormValid = computed(() => isUsernameValid.value && isEmailValid.value && formData.value.role);

function handleSubmit() {
  if (!isFormValid.value) {
    return;
  }

  emit('submit', { ...formData.value });
  closeModal();
}
</script>
