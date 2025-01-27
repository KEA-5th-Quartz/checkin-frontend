<script setup lang="ts">
import { userApi } from '@/services/userService/userService';
import { useMemberStore } from '@/stores/memberStore';
import { schema } from '@/utils/passwordSchema';
import { useField, useForm } from 'vee-validate';
import { ref } from 'vue';
import SvgIcon from './common/SvgIcon.vue';
import { EyeIcon, EyeSlashIcon } from '@/assets/icons/path';

const assignmentNotification = ref(false);
const statusNotification = ref(false);
const commentNotification = ref(false);
const previewImage = ref('../assets/logo.png'); // 나중에 프로필 기본 이미지로 변경

const memberStore = useMemberStore();

const { handleSubmit, errors, meta } = useForm({
  validationSchema: schema,
});

const { value: originalpwd } = useField('originalPwd');
const { value: newPwd } = useField('newPwd');
const { value: checkPwd } = useField('checkPwd');

const resetForm = () => {
  originalpwd.value = '';
  newPwd.value = '';
  checkPwd.value = '';
};

const onSubmit = handleSubmit(async (values) => {
  try {
    await userApi.changePassword(memberStore.memberId, {
      originalpassword: values.originalpwd,
      newpassword: values.newPwd,
    });

    resetForm();
  } catch (error) {
    console.log('비밀번호 변경 실패:', error);
  }
});

const handleImageChange = async (event: Event) => {
  const target = event.target as HTMLInputElement; // 이벤트 객체에서 input 가져옴
  const file = target.files?.[0];

  if (file) {
    // 파일 크기 체크, 일단 5mb로 지정
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 이미지 타입 체크
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    const reader = new FileReader(); // FileReader 객체 생성
    reader.onload = (e) => {
      previewImage.value = e.target?.result as string; // 읽은 결과를 미리보기 이미지 소스로 설정
    }; // 파일을 Base64 인코딩된 문자열로 읽기
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('file', file);
      await userApi.changeProfileImg(memberStore.memberId, formData);
    } catch (error) {
      console.log('프로필 이미지 변경 실패:', error);
    }
  }
};

// 비밀번호 표시 여부
const showPwd = ref({
  original: false,
  new: false,
  check: false,
});

// 비밀번호 표시/숨김 토글 함수
const togglePwdVisibility = (field: 'original' | 'new' | 'check') => {
  showPwd.value[field] = !showPwd.value[field];
};
</script>

<template>
  <div class="flex-stack w-1/2">
    <section class="flex gap-8 items-center">
      <div class="relative">
        <img :src="previewImage" class="border w-36 h-36 rounded-full bg-pink-300 object-cover" />
        <label
          class="absolute bottom-1 right-2 w-7 h-7 bg-gray-2 rounded-full flex-center text-xl hover:bg-gray-1 cursor-pointer"
        >
          +
          <input type="file" accept="image/*" class="hidden" @change="handleImageChange" />
        </label>
      </div>
      <div class="flex flex-col gap-5">
        <p class="font-semibold text-2xl">stone.vue</p>
        <p class="text-2xl text-gray-1">stone@gmail.com</p>
      </div>
    </section>

    <form class="flex-stack gap-10 mt-14" @submit="onSubmit">
      <div class="flex-stack gap-0.5 relative">
        <label class="text-gray-0">현재 비밀번호</label>
        <div class="relative">
          <input
            v-model="originalpwd"
            class="w-full bg-gray-2 bg-opacity-80 rounded-lg py-2 px-3.5 focus:outline-none pr-10"
            :type="showPwd.original ? 'text' : 'password'"
            placeholder="현재 비밀번호를 입력해주세요"
          />
          <SvgIcon
            class="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
            @click="togglePwdVisibility('original')"
            :icon="showPwd.original ? EyeIcon : EyeSlashIcon"
          />
        </div>
      </div>

      <div class="flex-stack gap-0.5 relative">
        <label class="text-gray-0">새 비밀번호</label>
        <div class="relative">
          <input
            v-model="newPwd"
            name="newPwd"
            maxlength="20"
            class="w-full bg-gray-2 bg-opacity-80 rounded-lg py-2 px-3.5 focus:outline-none"
            :type="showPwd.new ? 'text' : 'password'"
            placeholder="새 비밀번호를 입력해주세요"
          />
          <SvgIcon
            class="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
            @click="togglePwdVisibility('new')"
            :icon="showPwd.new ? EyeIcon : EyeSlashIcon"
          />
        </div>
        <p
          :class="[
            'absolute top-[70px]',
            {
              'text-gray-1': !newPwd,
              'text-red-1': errors.newPwd,
              'text-green-1': newPwd && !errors.newPwd,
            },
          ]"
        >
          {{
            errors.newPwd
              ? errors.newPwd
              : newPwd
              ? '사용 가능한 비밀번호입니다.'
              : '비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상 20자리 이하'
          }}
        </p>
      </div>

      <div class="flex-stack gap-0.5 relative">
        <label class="text-gray-0">새 비밀번호 확인</label>
        <div class="relative">
          <input
            v-model="checkPwd"
            name="checkPwd"
            class="w-full bg-gray-2 bg-opacity-80 rounded-lg py-2 px-3.5 focus:outline-none"
            :type="showPwd.check ? 'text' : 'password'"
            placeholder="새 비밀번호를 확인해주세요"
          />
          <SvgIcon
            class="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
            @click="togglePwdVisibility('check')"
            :icon="showPwd.check ? EyeIcon : EyeSlashIcon"
          />
        </div>
        <p
          v-if="checkPwd"
          :class="[
            'absolute top-[70px]',
            {
              'text-red-1': errors.checkPwd,
              'text-green-1': !errors.checkPwd && checkPwd,
            },
          ]"
        >
          {{ errors.checkPwd || '비밀번호가 일치합니다.' }}
        </p>
      </div>

      <!-- 알림 조건부 렌더링 -->
      <div class="flex-stack gap-5 mt-5">
        <div class="flex items-center justify-between w-1/2">
          <p class="font-bold">담당자 배정 알림</p>
          <button
            type="button"
            class="relative inline-flex h-6 w-11 items-center rounded-full"
            :class="assignmentNotification ? 'bg-blue-1' : 'bg-gray-1'"
            @click="assignmentNotification = !assignmentNotification"
          >
            <div
              class="inline-block h-4 w-4 transform rounded-full bg-white-0 transition"
              :class="assignmentNotification ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
        </div>

        <div class="flex items-center justify-between w-1/2">
          <p class="font-bold">진행상태 변경 알림</p>
          <button
            type="button"
            class="relative inline-flex h-6 w-11 items-center rounded-full"
            :class="statusNotification ? 'bg-blue-1' : 'bg-gray-1'"
            @click="statusNotification = !statusNotification"
          >
            <div
              class="inline-block h-4 w-4 transform rounded-full bg-white-0 transition"
              :class="statusNotification ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
        </div>

        <div class="flex items-center justify-between w-1/2">
          <p class="font-bold">티켓 댓글 알림</p>
          <button
            type="button"
            class="relative inline-flex h-6 w-11 items-center rounded-full"
            :class="commentNotification ? 'bg-blue-1' : 'bg-gray-1'"
            @click="commentNotification = !commentNotification"
          >
            <div
              class="inline-block h-4 w-4 transform rounded-full bg-white-0 transition"
              :class="commentNotification ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
        </div>
      </div>

      <button type="submit" class="btn-main max-w-fit self-end">저장</button>
    </form>
  </div>
</template>
