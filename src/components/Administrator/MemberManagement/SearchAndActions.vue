<template>
  <div class="flex-between p-4 mx-auto w-[84%] mt-[40px]">
    <div class="flex items-center px-2 py-3 rounded-md shadow-md w-full max-w-sm border border-gray-2">
      <CommonInput
        maxlength="16"
        type="text"
        class="bg-transparent focus:outline-none pl-3 text-gray-0 w-full"
        placeholder="인원 검색..."
        v-model="searchQuery"
        @keydown.enter="serchMember"
      />
      <button @click="serchMember">
        <SvgIcon :icon="SearchIcon" />
      </button>
    </div>
    <button
      class="ml-4 bg-primary-0 text-white-0 px-6 py-2 rounded-md shadow-md hover:opacity-80"
      @click="openAddMemberModal"
    >
      인원 등록
    </button>
    <AddMemberModal :isOpen="isAddMemberModalOpen" @close="closeAddMemberModal" @submit="handleAddMember" />
    <CommonDialog
      v-if="isDialogOpen"
      :title="dialogContent.title"
      :content="dialogContent.content"
      :mainText="dialogContent.mainText"
      :onMainClick="closeDialog"
      isOneBtn
    />
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/common/SvgIcon.vue';
import { SearchIcon } from '@/assets/icons/path';
import { ref, computed, watch } from 'vue';
import AddMemberModal from '@/components/Administrator/MemberManagement/AddMemberModal.vue';
import { useCustomMutation } from '@/composables/useCustomMutation';
import { memberApi } from '@/services/memberService/memberService';
import { useQueryClient } from '@tanstack/vue-query';
import CommonDialog from '@/components/common/CommonDialog.vue';
import { useMemberListStore } from '@/stores/useMemberListStore';
import CommonInput from '@/components/common/CommonInput.vue';
import { useDebounceFn } from '@vueuse/core';

const store = useMemberListStore();

const queryClient = useQueryClient();

const handleAddMember = (newMember: { username: string; email: string; role: string }) => {
  addMemberMutation.mutate(newMember);
};

const addMemberMutation = useCustomMutation(
  async (newMember: { username: string; email: string; role: string }) => {
    return await memberApi.addMember(newMember);
  },
  {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      dialogContent.value = {
        title: '회원 등록 완료',
        content: '새로운 회원이 성공적으로 등록되었습니다.',
        mainText: '확인',
      };
      isDialogOpen.value = true;
    },
    onError: (error) => {
      dialogContent.value = {
        title: '회원 등록 실패',
        content: error?.message || '회원 등록 중 오류가 발생했습니다.',
        mainText: '확인',
      };
      isDialogOpen.value = true;
    },
  },
);

const searchQuery = computed({
  get: () => store.searchQuery,
  set: (value) => store.setSearchQuery(value),
});

const debouncedSearch = useDebounceFn(() => {
  queryClient.invalidateQueries({ queryKey: ['members'] });
}, 3000);

watch(searchQuery, () => {
  debouncedSearch();
});

const serchMember = () => {
  queryClient.invalidateQueries({ queryKey: ['members'] });
};

const isAddMemberModalOpen = ref(false);
const isDialogOpen = ref(false);
const dialogContent = ref({ title: '', content: '', mainText: '확인' });

function openAddMemberModal() {
  isAddMemberModalOpen.value = true;
}

function closeAddMemberModal() {
  isAddMemberModalOpen.value = false;
}

function closeDialog() {
  isDialogOpen.value = false;
}
</script>

<style scoped></style>
