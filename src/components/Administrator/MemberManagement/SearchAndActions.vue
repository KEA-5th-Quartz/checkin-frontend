<template>
  <div class="flex-between p-4 mx-auto w-[84%] mt-[40px]">
    <!-- 검색 필드 -->
    <div class="flex items-center px-2 py-3 rounded-md shadow-md w-full max-w-sm border border-gray-2">
      <input
        type="text"
        class="bg-transparent focus:outline-none pl-3 text-gray-0 w-full"
        placeholder="인원 검색..."
        v-model="searchText"
      />
      <SvgIcon :icon="SearchIcon" />
    </div>

    <!-- 인원 등록 버튼 -->
    <button
      class="ml-4 bg-primary-0 text-white-0 px-6 py-2 rounded-md shadow-md hover:opacity-80"
      @click="openAddMemberModal"
    >
      인원 등록
    </button>

    <AddMemberModal :isOpen="isAddMemberModalOpen" @close="closeAddMemberModal" @submit="addMember" />
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/common/SvgIcon.vue';
import { SearchIcon } from '@/assets/icons/path';
import { ref } from 'vue';
import AddMemberModal from '@/components/Administrator/MemberManagement/AddMemberModal.vue';
import { useCustomMutation } from '@/composables/useCustomMutation';
import { memberApi } from '@/services/memberService/memberService';
import { useQueryClient } from '@tanstack/vue-query';

const queryClient = useQueryClient();

const addMemberMutation = useCustomMutation(
  async (newMember) => {
    return await memberApi.addMember(newMember);
  },
  {
    onSuccess: () => {
      console.log('회원 등록 성공');
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (error) => {
      console.error('회원 등록 실패:', error);
    },
  },
);

// 검색어 상태
const searchText = ref('');

// 모달 상태
const isAddMemberModalOpen = ref(false);

// "인원 등록" 버튼 클릭 핸들러
function openAddMemberModal() {
  isAddMemberModalOpen.value = true;
}

// 모달 닫기 핸들러
function closeAddMemberModal() {
  isAddMemberModalOpen.value = false;
}

// 모달에서 등록 버튼 클릭 시 동작
function addMember(newMember) {
  console.log('새로운 멤버:', newMember);
  addMemberMutation.mutate(newMember); // API 요청 실행
  isAddMemberModalOpen.value = false;
}
</script>

<style scoped></style>
