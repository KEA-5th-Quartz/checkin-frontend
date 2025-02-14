<script setup lang="ts">
import { userApi } from '@/services/userService/userService';
import { useMemberStore } from '@/stores/memberStore';
import { schema } from '@/utils/passwordSchema';
import { useField, useForm } from 'vee-validate';
import { ref } from 'vue';
import PasswordInput from './common/PasswordInput.vue';
import CommonDialog from './common/CommonDialog.vue';
import { DialogProps, initialDialog } from '@/types/common/dialog';
import { ApiError } from '@/types/common/error';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { AxiosError } from 'axios';

const memberStore = useMemberStore();
const previewImage = ref(memberStore.profilePic);
const dialogState = ref<DialogProps>({ ...initialDialog });

const { data: memberData } = useCustomQuery(['member-data'], async () => {
  const response = await userApi.getMemberId(memberStore.memberId as number);
  return response;
});

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
});

const { value: originalPwd } = useField<string>('originalPwd');
const { value: newPwd } = useField<string>('newPwd');
const { value: checkPwd } = useField<string>('checkPwd');

const resetForm = () => {
  originalPwd.value = '';
  newPwd.value = '';
  checkPwd.value = '';
};

const onSubmit = handleSubmit(async (values) => {
  try {
    await userApi.changePassword(memberStore.memberId, {
      originalPassword: values.originalPwd,
      newPassword: values.newPwd,
    });

    dialogState.value = {
      open: true,
      isOneBtn: true,
      title: '비밀번호가 변경되었습니다.',
      mainText: '확인',
      onMainClick: () => {
        dialogState.value = { ...initialDialog };
        window.location.reload();
      },
    };

    resetForm();
  } catch (error) {
    const err = error as AxiosError;
    const apiError = err.response?.data as ApiError;

    switch (apiError?.code) {
      case 'MEMBER_4004':
      case 'MEMBER_4003':
      case 'MEMBER_4000':
        dialogState.value = {
          open: true,
          isOneBtn: true,
          title: apiError.message,
          mainText: '확인',
          onMainClick: () => {
            dialogState.value = { ...initialDialog };
          },
        };
        break;
      case 'COMMON_4000':
        dialogState.value = {
          open: true,
          isOneBtn: true,
          title: '현재 비밀번호가 일치하지 않습니다.',
          mainText: '확인',
          onMainClick: () => {
            dialogState.value = { ...initialDialog };
          },
        };
        break;
      case 'MEMBER_4010':
        dialogState.value = {
          open: true,
          isOneBtn: true,
          title: '토큰이 만료되었습니다. 다시 로그인 해주십시오.',
          mainText: '확인',
          onMainClick: () => {
            dialogState.value = { ...initialDialog };
          },
        };
        break;
      default:
        dialogState.value = {
          open: true,
          isOneBtn: true,
          title: '오류가 발생했습니다.',
          mainText: '확인',
          onMainClick: () => {
            dialogState.value = { ...initialDialog };
          },
        };
    }
  }
});

const handleImageChange = async (event: Event) => {
  const target = event.target as HTMLInputElement; // 이벤트 객체에서 input 가져옴
  const file = target.files?.[0];

  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      dialogState.value = {
        open: true,
        isOneBtn: true,
        title: '파일 크기는 5MB 이하여야 합니다.',
        mainText: '확인',
        onMainClick: () => {
          dialogState.value = { ...initialDialog };
        },
      };
      return;
    }

    const sanitizedFileName = file.name.replace(/[^\w\s.-]/g, '');

    // 허용된 이미지 타입 정의
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    // 이미지 타입 체크
    if (!allowedTypes.includes(file.type)) {
      dialogState.value = {
        open: true,
        isOneBtn: true,
        title: 'JPG, PNG, WEBP 형식의 이미지만 업로드 가능합니다.',
        mainText: '확인',
        onMainClick: () => {
          dialogState.value = { ...initialDialog };
        },
      };
      return;
    }

    const buffer = await file.arrayBuffer();
    const header = new Uint8Array(buffer.slice(0, 4));
    const validImageHeaders = {
      jpeg: [0xff, 0xd8, 0xff],
      png: [0x89, 0x50, 0x4e, 0x47],
      webp: [0x52, 0x49, 0x46, 0x46],
    };

    const isValidSignature = Object.values(validImageHeaders).some((signature) =>
      signature.every((byte, i) => header[i] === byte),
    );

    if (!isValidSignature) {
      dialogState.value = {
        open: true,
        isOneBtn: true,
        title: '올바르지 않은 이미지 파일입니다.',
        mainText: '확인',
        onMainClick: () => {
          dialogState.value = { ...initialDialog };
        },
      };
      return;
    }

    const reader = new FileReader(); // FileReader 객체 생성
    reader.onload = (e) => {
      previewImage.value = e.target?.result as string; // 읽은 결과를 미리보기 이미지 소스로 설정
    }; // 파일을 Base64 인코딩된 문자열로 읽기
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('file', file, sanitizedFileName);
      await userApi.changeProfileImg(memberStore.memberId, formData);
      window.location.replace(window.location.href);
    } catch (error) {
      dialogState.value = {
        open: true,
        isOneBtn: true,
        title: '프로필 이미지 변경에 실패했습니다.',
        mainText: '확인',
        onMainClick: () => {
          dialogState.value = { ...initialDialog };
        },
      };
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
        <p class="font-semibold text-2xl">{{ memberStore.username }}</p>
        <p class="text-xl text-gray-1">{{ memberData?.data?.data?.email ?? '' }}</p>
      </div>
    </section>

    <form class="flex-stack gap-10 mt-14" @submit="onSubmit">
      <PasswordInput
        v-model="originalPwd"
        label="현재 비밀번호"
        placeholder="현재 비밀번호를 입력해주세요"
        :error="errors.originalPwd"
      />

      <PasswordInput
        v-model="newPwd"
        label="새 비밀번호"
        name="newPwd"
        maxlength="20"
        placeholder="비밀번호는 영문, 숫자, 특수문자 포함 8~20자입니다."
        :error="errors.newPwd ? errors.newPwd : ''"
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

      <button type="submit" class="btn-main max-w-fit self-end">저장</button>
    </form>
  </div>

  <CommonDialog
    v-if="dialogState.open"
    :isOneBtn="dialogState.isOneBtn"
    :title="dialogState.title"
    :mainText="dialogState.mainText"
    :onCancelClick="dialogState.onMainClick"
    :onMainClick="dialogState.onMainClick"
  />
</template>
