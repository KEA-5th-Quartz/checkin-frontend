<template>
  <div class="max-h-fit flex-stack items-center bg-white-0 p-5 rounded-md shadow-sm border border-gray-2 relative">
    <div class="flex justify-end w-full">
      <button class="text-gray-0 hover:text-black-0" @click="toggleMenu">⋮</button>
      <ul v-if="isMenuOpen" ref="menuRef" class="absolute right-0 card-base mt-2 border border-gray-2 w-28 z-50">
        <li @click="openRoleChangeModal" class="px-4 py-2 cursor-pointer hover:bg-gray-2">복구</li>
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
import { computed, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import CommonDialog from '../../common/CommonDialog.vue';
import { useCustomMutation } from '@/composables/useCustomMutation';
import { memberApi } from '@/services/memberService/memberService';
import { useQueryClient } from '@tanstack/vue-query';
import { DialogProps, initialDialog } from '@/types/common/dialog';

const queryClient = useQueryClient();

const isMenuOpen = ref(false);
const isRoleChangeModalOpen = ref(false); // 권한 변경 모달
const dialogState = ref<DialogProps>({ ...initialDialog }); // 공통 모달
const menuRef = ref<HTMLElement | null>(null);
const isDropdownOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const roleLabels: Record<'ADMIN' | 'MANAGER' | 'USER', string> = {
  ADMIN: '관리자',
  MANAGER: '담당자',
  USER: '사용자',
};

const selectedRole = ref<'ADMIN' | 'MANAGER' | 'USER' | null>(null);

// 멤버 데이터 (props로 전달받음)
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

// 권한 변경 뮤테이션
const updateRoleMutation = useCustomMutation(
  async ({ memberId, role }: { memberId: number; role: string }) => {
    const response = await memberApi.putMemberRole(memberId, { role });
    return response.data;
  },
  {
    onSuccess: () => {
      dialogState.value = {
        open: true,
        isOneBtn: true,
        title: '권한 변경',
        content: `${props.member.username}님이 복구되었습니다.`,
        mainText: '확인',
        onMainClick: () => {
          closeRoleChangeModal();
          queryClient.invalidateQueries();
        },
      };
    },
  },
);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// 드롭다운 외부 클릭 시 닫기
onClickOutside(menuRef, () => {
  isMenuOpen.value = false;
});

// 권한 변경 모달 열기/닫기
const openRoleChangeModal = () => {
  isRoleChangeModalOpen.value = true;
  isMenuOpen.value = false;
  selectedRole.value = null; // 초기화
};
const closeRoleChangeModal = () => {
  isRoleChangeModalOpen.value = false;
  dialogState.value = { ...initialDialog };
};

// 드롭다운 열기/닫기
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};
onClickOutside(dropdownRef, () => {
  isDropdownOpen.value = false;
});

// 선택된 권한 변경
const selectRole = (role: 'ADMIN' | 'MANAGER' | 'USER') => {
  selectedRole.value = role;
  isDropdownOpen.value = false;
};

// 멤버 탈퇴 모달 열기/닫기
const openRemoveMemberModal = () => {
  // isRemoveMemberModalOpen.value = true;
  dialogState.value = {
    open: true,
    isWarn: true,
    title: '멤버 탈퇴',
    content: `${props.member.username}님을 정말로 탈퇴시키겠습니까?`,
    mainText: '탈퇴',
    onMainClick: removeMember,
    cancelText: '취소',
    onCancelClick: () => {
      dialogState.value = { ...initialDialog };
    },
  };
  isMenuOpen.value = false;
};

// 멤버 탈퇴 함수
const removeMember = () => {
  console.log(`멤버 탈퇴 요청: ${props.member.username}`);
};
</script>
