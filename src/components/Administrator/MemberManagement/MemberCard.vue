<template>
  <div class="flex-stack items-center bg-white-0 p-5 rounded-md shadow-sm border border-gray-2 relative h-[250px]">
    <div class="flex justify-end w-full">
      <button v-if="!isCurrentUser" class="text-gray-0 hover:text-black-0" @click="toggleMenu">⋮</button>
      <span v-else class="invisible">⋮</span>
      <ul v-if="isMenuOpen" ref="menuRef" class="absolute right-0 card-base mt-2 border border-gray-2 w-28 z-50">
        <li @click="openRoleChangeModal" class="px-4 py-2 cursor-pointer hover:bg-gray-2">권한 변경</li>
        <li @click="openRemoveMemberModal" class="px-4 py-2 cursor-pointer text-red-1 hover:bg-gray-2">탈퇴</li>
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
      <div v-if="isCurrentUser" class="text-blue-3 text-sm"><p>(본인)</p></div>
    </div>
    <div class="mt-auto">
      <p class="text-gray-1">{{ roleLabels[member.role] }}</p>
    </div>

    <CommonDialog
      v-if="isRoleChangeModalOpen"
      :title="'권한 변경'"
      :content="'변경할 권한을 선택하세요.'"
      :mainText="'확인'"
      :onMainClick="handleUpdateRole"
      :cancelText="'취소'"
      :onCancelClick="closeRoleChangeModal"
    >
      <div ref="dropdownRef" class="relative mt-4">
        <!-- 드롭다운 버튼 -->
        <button @click="toggleDropdown" class="manager-filter-btn w-full flex items-center justify-between">
          <span class="font-medium">{{ selectedRole ? roleLabels[selectedRole] : '권한 선택' }}</span>
          <SvgIcon :icon="ArrowDownIcon" :class="['transition-02s', isDropdownOpen ? 'rotate-180' : '']" />
        </button>

        <!-- 드롭다운 옵션 리스트 -->
        <div v-if="isDropdownOpen" class="manager-filter-menu w-full">
          <ul>
            <li v-for="option in roleOptions" :key="option" @click="selectRole(option)" class="board-size-menu">
              {{ roleLabels[option] }}
            </li>
          </ul>
        </div>
      </div>
    </CommonDialog>

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
import SvgIcon from '../../common/SvgIcon.vue';
import { ArrowDownIcon } from '@/assets/icons/path';
import { useCustomMutation } from '@/composables/useCustomMutation';
import { memberApi } from '@/services/memberService/memberService';
import { useQueryClient } from '@tanstack/vue-query';
import { DialogProps, initialDialog } from '@/types/common/dialog';
import { useMemberStore } from '@/stores/memberStore';
const queryClient = useQueryClient();
const memberStore = useMemberStore();
const isMenuOpen = ref(false);
const isRoleChangeModalOpen = ref(false); // 권한 변경 모달
const dialogState = ref<DialogProps>({ ...initialDialog }); // 공통 모달
const menuRef = ref<HTMLElement | null>(null);
const isDropdownOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const roleOptions = computed(() => {
  const allRoles: Array<'ADMIN' | 'MANAGER' | 'USER'> = ['ADMIN', 'MANAGER', 'USER'];
  return allRoles.filter((role) => role !== props.member.role); // 본인 현재 권한 빼고
});
const roleLabels: Record<'ADMIN' | 'MANAGER' | 'USER', string> = {
  ADMIN: '관리자',
  MANAGER: '담당자',
  USER: '사용자',
};

const currentUserId = computed(() => memberStore.memberId);
const isCurrentUser = computed(() => props.member.memberId === currentUserId.value);

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
        content: `${props.member.username}님의 권한이 변경되었습니다.`,
        mainText: '확인',
        onMainClick: () => {
          closeRoleChangeModal();
          queryClient.invalidateQueries();
        },
      };
    },
  },
);

const handleUpdateRole = async () => {
  try {
    if (!selectedRole.value) return;
    await updateRoleMutation.mutateAsync({
      memberId: props.member.memberId,
      role: selectedRole.value,
    });
  } catch (err) {
    console.error('권한 변경 실패:', err);
  }
};

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
const removeMember = async () => {
  try {
    await memberApi.deleteMember(props.member.memberId);

    //  탈퇴 성공 시 다이얼로그 표시
    dialogState.value = {
      open: true,
      isOneBtn: true,
      title: '회원 탈퇴 완료',
      content: `${props.member.username}님이 탈퇴되었습니다.`,
      mainText: '확인',
      onMainClick: () => {
        dialogState.value = { ...initialDialog };
        queryClient.invalidateQueries();
      },
    };
  } catch (error) {
    console.error('회원 탈퇴 실패:', error);

    //  탈퇴 실패 시 오류 다이얼로그 띄우기
    dialogState.value = {
      open: true,
      isOneBtn: true,
      title: '회원 탈퇴 실패',
      content: '회원 탈퇴 중 문제가 발생했습니다. 다시 시도해주세요.',
      mainText: '확인',
      onMainClick: () => {
        dialogState.value = { ...initialDialog };
      },
    };
  }
};
</script>

<style scoped></style>
