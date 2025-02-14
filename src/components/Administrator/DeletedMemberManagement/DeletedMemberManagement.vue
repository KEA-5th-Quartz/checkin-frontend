<template>
  <div class="max-h-fit flex-stack items-center bg-white-0 p-5 rounded-md shadow-sm border border-gray-2 relative">
    <div class="flex justify-end w-full">
      <button class="text-gray-0 hover:text-black-0" @click="toggleMenu">⋮</button>
      <ul v-if="isMenuOpen" ref="menuRef" class="absolute right-0 card-base mt-2 border border-gray-2 w-28 z-50">
        <li @click="openRestoreModal" class="px-4 py-2 cursor-pointer hover:bg-gray-2">복구</li>
        <li @click="openRemoveMemberModal" class="px-4 py-2 cursor-pointer text-red-1 hover:bg-gray-2">영구삭제</li>
      </ul>
    </div>

    <div class="w-[70px] h-[70px] rounded-full bg-gray-3 flex-center overflow-hidden border border-gray-1">
      <img
        v-if="member.profilePic"
        :src="member.profilePic"
        alt="Profile"
        class="w-full h-full object-cover rounded-full"
      />
    </div>

    <div class="flex-stack items-center mt-4">
      <p
        class="font-bold text-black-0 max-w-[180px] overflow-hidden whitespace-nowrap text-ellipsis"
        :title="member.username"
      >
        {{ member.username }}
      </p>
      <p class="text-gray-1 max-w-[180px] overflow-hidden whitespace-nowrap text-ellipsis" :title="member.email">
        {{ member.email }}
      </p>
    </div>
    <div class="mt-8">
      <p class="text-gray-1">{{ roleLabels[member.role] }}</p>
    </div>

    <CommonDialog
      v-if="dialogState.open"
      :isOneBtn="dialogState.isOneBtn"
      :isWarn="dialogState.isWarn"
      :title="dialogState.title"
      :content="dialogState.content"
      :mainText="dialogState.mainText"
      :onCancelClick="dialogState.onCancelClick"
      :cancelText="dialogState.cancelText"
      :onMainClick="dialogState.onMainClick"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import CommonDialog from '../../common/CommonDialog.vue';
import { useCustomMutation } from '@/composables/useCustomMutation';
import { memberApi } from '@/services/memberService/memberService';
import { useQueryClient } from '@tanstack/vue-query';
import { DialogProps, initialDialog } from '@/types/common/dialog';

const queryClient = useQueryClient();

const isMenuOpen = ref(false);
const dialogState = ref<DialogProps>({ ...initialDialog });
const menuRef = ref<HTMLElement | null>(null);

const roleLabels: Record<'ADMIN' | 'MANAGER' | 'USER', string> = {
  ADMIN: '관리자',
  MANAGER: '담당자',
  USER: '사용자',
};

const props = defineProps({
  member: {
    type: Object as () => {
      memberId: number;
      username: string;
      role: 'ADMIN' | 'MANAGER' | 'USER';
      email: string;
      profilePic: string;
    },
    required: true,
  },
});

const restoreMemberMutation = useCustomMutation(
  async (memberId: number) => {
    const response = await memberApi.patchRestoreMember(memberId);
    return response.data;
  },
  {
    onSuccess: () => {
      dialogState.value = {
        open: true,
        isOneBtn: true,
        title: '회원 복구',
        content: `${props.member.username}님이 복구되었습니다.`,
        mainText: '확인',
        onMainClick: async () => {
          dialogState.value = { ...initialDialog };
          await queryClient.refetchQueries({ queryKey: ['members'] });
          queryClient.invalidateQueries();
        },
      };
    },
    onError: (error) => {
      dialogState.value = {
        open: true,
        isOneBtn: true,
        title: '오류',
        content: '회원 복구 중 오류가 발생했습니다.',
        mainText: '확인',
        onMainClick: () => {
          dialogState.value = { ...initialDialog };
        },
      };
      console.error('회원 복구 실패:', error);
    },
  },
);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

onClickOutside(menuRef, () => {
  isMenuOpen.value = false;
});

const openRestoreModal = () => {
  dialogState.value = {
    open: true,
    title: '회원 복구',
    content: `${props.member.username}님을 복구하시겠습니까?`,
    mainText: '복구',
    onMainClick: () => {
      restoreMemberMutation.mutate(props.member.memberId);
    },
    cancelText: '취소',
    onCancelClick: () => {
      dialogState.value = { ...initialDialog };
    },
  };
  isMenuOpen.value = false;
};

const deleteMemberMutation = useCustomMutation(
  async (memberId: number) => {
    await memberApi.deleteMemberDelete(memberId);
  },
  {
    onSuccess: () => {
      dialogState.value = {
        open: true,
        isOneBtn: true,
        title: '회원 삭제 완료',
        content: `${props.member.username}님이 영구 삭제되었습니다.`,
        mainText: '확인',
        onMainClick: async () => {
          dialogState.value = { ...initialDialog };
          await queryClient.refetchQueries({ queryKey: ['deleted-members'] });
        },
      };
    },
    onError: (error) => {
      dialogState.value = {
        open: true,
        isOneBtn: true,
        title: '오류',
        content: '회원 삭제 중 오류가 발생했습니다.',
        mainText: '확인',
        onMainClick: () => {
          dialogState.value = { ...initialDialog };
        },
      };
      console.error('회원 삭제 실패:', error);
    },
  },
);

const openRemoveMemberModal = () => {
  dialogState.value = {
    open: true,
    isWarn: true,
    title: '멤버 영구 삭제',
    content: `${props.member.username}님을 정말 영구 삭제하시겠습니까?`,
    mainText: '삭제',
    onMainClick: () => {
      deleteMemberMutation.mutate(props.member.memberId);
    },
    cancelText: '취소',
    onCancelClick: () => {
      dialogState.value = { ...initialDialog };
    },
  };
  isMenuOpen.value = false;
};
</script>
