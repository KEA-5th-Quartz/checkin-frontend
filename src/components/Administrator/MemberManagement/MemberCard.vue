<template>
  <div class="max-h-fit flex-stack items-center bg-white-0 p-5 rounded-md shadow-sm border border-gray-2 relative">
    <div class="flex justify-end w-full">
      <button class="text-gray-0 hover:text-black-0" @click="toggleMenu">⋮</button>
      <ul v-if="isMenuOpen" ref="menuRef" class="absolute right-0 card-base mt-2 border border-gray-2 w-28 z-50">
        <li @click="openRoleChangeModal" class="px-4 py-2 cursor-pointer hover:bg-gray-100">권한 변경</li>
        <li @click="openRemoveMemberModal" class="px-4 py-2 cursor-pointer text-red-500 hover:bg-red-100">탈퇴</li>
      </ul>
    </div>

    <div
      class="w-[70px] h-[70px] rounded-full bg-gray-3 flex items-center justify-center overflow-hidden border border-gray-1"
    >
      <div class="w-[77px] h-[77px] rounded-full bg-gray-2" />
    </div>

    <div class="flex-stack items-center mt-4">
      <p class="font-bold text-black-0">{{ member.name }}</p>
      <p class="text-gray-1">{{ member.email }}</p>
    </div>
    <div class="mt-8">
      <p class="text-gray-1">{{ member.role }}</p>
    </div>

    <CommonDialog
      v-if="isRoleChangeModalOpen"
      :title="'권한 변경'"
      :content="'변경할 권한을 선택하세요.'"
      :mainText="'확인'"
      :onMainClick="confirmRoleChange"
      :cancelText="'취소'"
      :onCancelClick="closeRoleChangeModal"
    >
      <div ref="dropdownRef" class="relative mt-4">
        <!-- ✅ 드롭다운 버튼 -->
        <button @click="toggleDropdown" class="manager-filter-btn w-full flex items-center justify-between">
          <span class="font-medium">{{ selectedRole ? selectedRole.label : '권한 선택' }}</span>
          <SvgIcon :icon="ArrowDownIcon" :class="['transition-02s', isDropdownOpen ? 'rotate-180' : '']" />
        </button>

        <!-- ✅ 드롭다운 옵션 리스트 -->
        <div v-if="isDropdownOpen" class="manager-filter-menu w-full">
          <ul>
            <li v-for="option in roleOptions" :key="option.id" @click="selectRole(option)" class="board-size-menu">
              {{ option.label }}
            </li>
          </ul>
        </div>
      </div>
    </CommonDialog>

    <CommonDialog
      v-if="isRemoveMemberModalOpen"
      :title="'멤버 탈퇴'"
      :content="`${member.name}님을 정말로 탈퇴시키겠습니까?`"
      :isWarn="true"
      :mainText="'탈퇴'"
      :onMainClick="removeMember"
      :cancelText="'취소'"
      :onCancelClick="closeRemoveMemberModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { onClickOutside } from '@vueuse/core';
import CommonDialog from '../../common/CommonDialog.vue';
import SvgIcon from '../../common/SvgIcon.vue';
import { ArrowDownIcon } from '@/assets/icons/path';

const isMenuOpen = ref(false);
const isRoleChangeModalOpen = ref(false);
const isRemoveMemberModalOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);
const isDropdownOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const roleOptions = ref([
  { id: 'ADMIN', label: '관리자' },
  { id: 'MANAGER', label: '담당자' },
  { id: 'USER', label: '사용자' },
]);
const selectedRole = ref(null); // 선택된 권한

// 멤버 데이터 (props로 전달받음)
const props = defineProps({
  member: {
    type: Object as () => {
      id: number;
      name: string;
      role: string;
      email: string;
      profileImage: string;
    },
    required: true,
  },
});
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// 드롭다운 외부 클릭 시 닫기
onClickOutside(menuRef, () => {
  isMenuOpen.value = false;
});

// b권한 변경 모달 열기/닫기
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
const selectRole = (selectedOption) => {
  selectedRole.value = selectedOption;
  isDropdownOpen.value = false; // 드롭다운 닫기
  console.log(`[권한 선택됨] ${props.member.name} → ${selectedOption.label}`);
};

// 권한 변경 확정 (콘솔 로그만 출력)
const confirmRoleChange = () => {
  if (selectedRole.value) {
    console.log(`[권한 변경 요청] ${props.member.name} → ${selectedRole.value.label}`);
  } else {
    console.warn('권한이 선택되지 않았습니다.');
  }
  closeRoleChangeModal();
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
  console.log(`멤버 탈퇴 요청: ${props.member.name}`);
  closeRemoveMemberModal();
};
</script>

<style scoped></style>
