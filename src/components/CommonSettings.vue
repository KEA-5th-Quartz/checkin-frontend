<script setup lang="ts">
import { userApi } from '@/services/userService/userService';
import { useMemberStore } from '@/stores/memberStore';
import { schema } from '@/utils/passwordSchema';
import { useField, useForm } from 'vee-validate';
import { ref } from 'vue';
import PasswordInput from './common/PasswordInput.vue';

const assignmentNotification = ref(false);
const statusNotification = ref(false);
const commentNotification = ref(false);

const memberStore = useMemberStore();
const previewImage = ref(memberStore.profilePic);

const { handleSubmit, errors, meta } = useForm({
  validationSchema: schema,
});

const { value: originalpwd } = useField<string>('originalPwd');
const { value: newPwd } = useField<string>('newPwd');
const { value: checkPwd } = useField<string>('checkPwd');

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

    // 허용된 이미지 타입 정의
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    // 이미지 타입 체크
    if (!allowedTypes.includes(file.type)) {
      alert('JPG, PNG, WEBP 형식의 이미지만 업로드 가능합니다.');
      return;
    }

    const reader = new FileReader(); // FileReader 객체 생성
    reader.onload = (e) => {
      previewImage.value = e.target?.result as string; // 읽은 결과를 미리보기 이미지 소스로 설정
    }; // 파일을 Base64 인코딩된 문자열로 읽기
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('file', file, file.name);
      await userApi.changeProfileImg(memberStore.memberId, formData);
    } catch (error) {
      console.log('프로필 이미지 변경 실패:', error);
    }
  }
};
</script>

<template>
  <div class="flex-stack w-1/2">
    <section class="flex gap-8 items-center">
      <div class="relative">
        <img :src="previewImage" class="border w-36 h-36 rounded-full object-cover" />
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
      <PasswordInput
        v-model="originalpwd"
        label="현재 비밀번호"
        placeholder="현재 비밀번호를 입력해주세요"
        :error="errors.originalpwd"
      />

      <PasswordInput
        v-model="newPwd"
        label="새 비밀번호"
        name="newPwd"
        maxlength="20"
        placeholder="새 비밀번호를 입력해주세요"
        :error="errors.newPwd"
        :success-message="newPwd && !errors.newPwd ? '사용 가능한 비밀번호입니다.' : ''"
      />

      <PasswordInput
        v-model="checkPwd"
        label="새 비밀번호 확인"
        name="checkPwd"
        placeholder="새 비밀번호를 확인해주세요"
        :error="errors.checkPwd"
        :success-message="checkPwd && !errors.checkPwd ? '비밀번호가 일치합니다.' : ''"
      />

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
