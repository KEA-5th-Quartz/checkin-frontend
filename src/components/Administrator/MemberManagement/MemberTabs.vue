<template>
  <div class="member-tab-container">
    <div class="member-tab-header">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="['member-tab-button', selectedRole === tab ? 'member-tab-button-active' : 'member-tab-button-inactive']"
        @click="switchTab(tab)"
      >
        {{ roleLabels[tab] }}
      </button>
    </div>
    <div class="flex flex-wrap overflow-y-auto hide-scrollbar">
      <div v-if="isLoading" class="member-tab-grid">
        <SkeletonCard v-for="n in 8" :key="n" class="w-[80%]" />
      </div>

      <div v-else-if="members.length > 0" class="member-tab-grid">
        <MemberCard v-for="member in members" :key="member.memberId" :member="member" />
      </div>

      <div v-else class="member-tab-empty">
        <p>조회된 멤버가 없습니다.</p>
      </div>
    </div>

    <CustomPagination
      v-if="members.length > 0"
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
