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

    <div v-if="isLoading" class="flex flex-wrap justify-between gap-7 mx-20 h-[540px]">
      <SkeletonCard v-for="n in 5" :key="n" class="w-[20%]" />
    </div>

    <div v-else-if="members.length > 0" class="flex flex-wrap justify-between gap-7 mx-20 h-[540px]">
      <MemberCard v-for="member in members" :key="member.memberId" :member="member" class="w-[20%]" />
    </div>

    <div v-else class="text-center text-gray-0 py-10">
      <p>조회된 멤버가 없습니다.</p>
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
import { ref, computed, onMounted, watch } from 'vue';
import { useMemberListStore } from '@/stores/useMemberListStore';
import MemberCard from '../../../components/Administrator/MemberManagement/MemberCard.vue';
import CustomPagination from '@/components/common/CustomPagination.vue';
import { memberApi } from '@/services/memberService/memberService';
import { useCustomQuery } from '@/composables/useCustomQuery';
import SkeletonCard from '@/components/UI/SkeletonCard.vue';

const store = useMemberListStore();

// 탭 목록
const tabs = ['ADMIN', 'MANAGER', 'USER'];
const roleLabels: Record<string, string> = {
  ADMIN: '관리자',
  MANAGER: '담당자',
  USER: '사용자',
};

// 현재 선택된 역할
const selectedRole = computed(() => store.selectedRole);

// 현재 페이지
const currentPage = computed(() => store.currentPage);
const totalPages = computed(() => store.totalPages);

// 멤버 목록 API 요청
const { data, isLoading } = useCustomQuery(
  ['members', selectedRole, currentPage],
  () => memberApi.getMembers(selectedRole.value, currentPage.value, 10, store.searchQuery),
  { keepPreviousData: true },
);

const members = computed(() => data.value?.members ?? []);

watch(data, (newData) => {
  if (newData) store.setMembers(newData.members, newData.totalPages);
});

// 탭 전환 함수
const switchTab = async (role: string) => {
  store.setRole(role);
  store.setCurrentPage(1); // 역할 변경 시 페이지 초기화
};

// 페이지 변경 핸들러
const handlePageChange = async (page: number) => {
  store.setCurrentPage(page);
};
</script>

<style scoped></style>
