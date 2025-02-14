<template>
  <div class="mx-auto w-[83%]">
    <div class="flex justify-around border-b border-gray-2 mb-4">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="[
          'px-12 py-2 text-sm font-semibold',
          selectedRole === tab ? 'border-b-4 border-primary-3 text-primary-3' : 'text-gray-0 hover:text-primary-3',
        ]"
        @click="switchTab(tab)"
      >
        {{ roleLabels[tab] }}
      </button>
    </div>
    <div class="flex flex-wrap overflow-y-auto hide-scrollbar">
      <div
        v-if="isLoading"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-11 gap-y-6 mx-auto h-[calc(100vh-350px)] w-[80%]"
      >
        <SkeletonCard v-for="n in 8" :key="n" class="w-[80%]" />
      </div>
      <div
        v-else-if="members.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-11 gap-y-6 mx-auto h-[calc(100vh-350px)] w-[80%]"
      >
        <MemberCard v-for="member in members" :key="member.memberId" :member="member" />
      </div>
      <div v-else class="text-center text-gray-0 py-10 w-full">
        <p>조회된 멤버가 없습니다.</p>
      </div>
    </div>

    <CustomPagination
      :itemsPerPage="10"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @pageChange="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useMemberListStore } from '@/stores/useMemberListStore';
import MemberCard from '../../../components/Administrator/MemberManagement/MemberCard.vue';
import CustomPagination from '@/components/common/CustomPagination.vue';
import { memberApi } from '@/services/memberService/memberService';
import { useCustomQuery } from '@/composables/useCustomQuery';
import SkeletonCard from '@/components/UI/SkeletonCard.vue';

const store = useMemberListStore();
const tabs = ['ADMIN', 'MANAGER', 'USER'] as const;
const roleLabels: Record<string, string> = {
  ADMIN: '관리자',
  MANAGER: '담당자',
  USER: '사용자',
};

const selectedRole = computed(() => store.selectedRole);
const currentPage = computed(() => store.currentPage);
const totalPages = computed(() => store.totalPages);

const { data, isLoading } = useCustomQuery(
  ['members', selectedRole, currentPage],
  () => memberApi.getMembers(selectedRole.value, currentPage.value, 10, store.searchQuery),
  { keepPreviousData: true },
);

const members = computed(() => data.value?.members ?? []);

watch(data, (newData) => {
  if (newData) store.setMembers(newData.members, newData.totalPages);
});

const switchTab = async (role: 'ADMIN' | 'MANAGER' | 'USER') => {
  store.setRole(role);
  store.setCurrentPage(1);
};

const handlePageChange = async (page: number) => {
  store.setCurrentPage(page);
};
</script>

<style scoped></style>
