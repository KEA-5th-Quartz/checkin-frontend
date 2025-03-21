<template>
  <div class="member-card-container">
    <div class="flex justify-end w-full">
      <button v-if="!isCurrentUser" class="member-card-menu-button" @click="toggleMenu">⋮</button>
      <span v-else class="invisible">⋮</span>
      <ul v-if="isMenuOpen" ref="menuRef" class="member-card-menu">
        <li @click="openRoleChangeModal" class="px-4 py-2 cursor-pointer hover:bg-gray-2">권한 변경</li>
        <li @click="openRemoveMemberModal" class="px-4 py-2 cursor-pointer text-red-1 hover:bg-gray-2">탈퇴</li>
      </ul>
    </div>
    <div class="member-card-profile">
      <img
        v-if="member.profilePic"
        :src="member.profilePic"
        alt="Profile"
        class="w-full h-full object-cover rounded-full"
      />
    </div>
    <div class="member-card-info">
      <p class="member-card-username" :title="member.username">
        {{ member.username }}
      </p>
      <p class="member-card-email" :title="member.email">
        {{ member.email }}
      </p>
      <div v-if="isCurrentUser" class="member-card-self">
        <p>(본인)</p>
      </div>
    </div>
    <div class="member-card-role">
      <p>{{ roleLabels[member.role] }}</p>
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
        <button @click="toggleDropdown" class="member-card-role-change-btn">
          <span class="font-medium">{{ selectedRole ? roleLabels[selectedRole] : '권한 선택' }}</span>
          <SvgIcon :icon="ArrowDownIcon" :class="['member-card-dropdown-icon', isDropdownOpen ? 'rotate-180' : '']" />
        </button>
        <div v-if="isDropdownOpen" class="member-card-role-menu">
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
const isRoleChangeModalOpen = ref(false);
const dialogState = ref<DialogProps>({ ...initialDialog });
const menuRef = ref<HTMLElement | null>(null);
const isDropdownOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const roleOptions = computed(() => {
  const allRoles: Array<'ADMIN' | 'MANAGER' | 'USER'> = ['ADMIN', 'MANAGER', 'USER'];
  return allRoles.filter((role) => role !== props.member.role);
});
const roleLabels: Record<'ADMIN' | 'MANAGER' | 'USER', string> = {
  ADMIN: '관리자',
  MANAGER: '담당자',
  USER: '사용자',
};

const currentUserId = computed(() => memberStore.memberId);
const isCurrentUser = computed(() => props.member.memberId === currentUserId.value);

const selectedRole = ref<'ADMIN' | 'MANAGER' | 'USER' | null>(null);

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
        onCancelClick: () => {
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
    dialogState.value = {
      open: true,
      isOneBtn: true,
      title: '권한 변경 실패',
      content: '권한 변경중 문제가 발생했습니다. 다시 시도해주세요.',
      mainText: '확인',
      onMainClick: () => {
        dialogState.value = { ...initialDialog };
      },
      onCancelClick: () => {
        dialogState.value = { ...initialDialog };
      },
    };
  }
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

onClickOutside(menuRef, () => {
  isMenuOpen.value = false;
});

const openRoleChangeModal = () => {
  isRoleChangeModalOpen.value = true;
  isMenuOpen.value = false;
  selectedRole.value = null;
};
const closeRoleChangeModal = () => {
  isRoleChangeModalOpen.value = false;
  dialogState.value = { ...initialDialog };
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};
onClickOutside(dropdownRef, () => {
  isDropdownOpen.value = false;
});

const selectRole = (role: 'ADMIN' | 'MANAGER' | 'USER') => {
  selectedRole.value = role;
  isDropdownOpen.value = false;
};

const openRemoveMemberModal = () => {
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

const removeMember = async () => {
  try {
    await memberApi.deleteMember(props.member.memberId);
    await queryClient.refetchQueries({ queryKey: ['deleted-members'] });

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
      onCancelClick: () => {
        dialogState.value = { ...initialDialog };
        queryClient.invalidateQueries();
      },
    };
  } catch (err) {
    dialogState.value = {
      open: true,
      isOneBtn: true,
      title: '회원 탈퇴 실패',
      content: '회원 탈퇴 중 문제가 발생했습니다. 다시 시도해주세요.',
      mainText: '확인',
      onMainClick: () => {
        dialogState.value = { ...initialDialog };
      },
      onCancelClick: () => {
        dialogState.value = { ...initialDialog };
      },
    };
  }
};
</script>

<style scoped></style>
