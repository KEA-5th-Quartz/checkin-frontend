<template>
  <div class="max-h-fit flex-stack items-center bg-white-0 p-5 rounded-md shadow-sm border border-gray-2 relative">
    <div class="flex justify-end w-full">
      <button class="text-gray-0 hover:text-black-0" @click="toggleMenu">⋮</button>
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
    </div>
    <div class="mt-8">
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
      v-if="isRemoveMemberModalOpen"
      :title="'멤버 탈퇴'"
      :content="`${member.username}님을 정말로 탈퇴시키겠습니까?`"
      :isWarn="true"
      :mainText="'탈퇴'"
      :onMainClick="removeMember"
      :cancelText="'취소'"
      :onCancelClick="closeRemoveMemberModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import CommonDialog from '../../common/CommonDialog.vue';
import SvgIcon from '../../common/SvgIcon.vue';
import { ArrowDownIcon } from '@/assets/icons/path';
import { useCustomMutation } from '@/composables/useCustomMutation';
import { memberApi } from '@/services/memberService/memberService';
import { useQueryClient } from '@tanstack/vue-query';

const queryClient = useQueryClient();

const isMenuOpen = ref(false);
const isRoleChangeModalOpen = ref(false);
const isRemoveMemberModalOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);
const isDropdownOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const roleOptions: Array<'ADMIN' | 'MANAGER' | 'USER'> = ['ADMIN', 'MANAGER', 'USER'];
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
      queryClient.invalidateQueries();
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
    closeRoleChangeModal();
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
  console.log(`[권한 선택됨] ${props.member.memberId} → ${roleLabels[role]}`);
};

// 권한 변경 확정 (콘솔 로그만 출력)
const confirmRoleChange = () => {
  if (selectedRole.value) {
    console.log(`[권한 변경 요청] ${props.member.memberId} → ${roleLabels[selectedRole.value]}`);
  } else {
    console.warn('권한이 선택되지 않았습니다.');
  }
};

// 멤버 탈퇴 모달 열기/닫기
const openRemoveMemberModal = () => {
  isRemoveMemberModalOpen.value = true;
  isMenuOpen.value = false;
};
const closeRemoveMemberModal = () => {
  isRemoveMemberModalOpen.value = false;
};

// 멤버 탈퇴 함수
const removeMember = () => {
  console.log(`멤버 탈퇴 요청: ${props.member.username}`);
  closeRemoveMemberModal();
};
</script>

<style scoped></style>
