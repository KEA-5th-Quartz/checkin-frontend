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

    <div v-if="members.length > 0" class="flex flex-wrap justify-between gap-7 mx-20 h-[540px]">
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

// 멤버 목록
const members = computed(() => store.members ?? []);

// 현재 페이지
const currentPage = computed(() => store.currentPage);
const totalPages = computed(() => store.totalPages);

// 탭 전환 함수
const switchTab = async (role: string) => {
  store.setRole(role);
  store.setCurrentPage(1); // 역할 변경 시 페이지 초기화
};

// 페이지 변경 핸들러
const handlePageChange = async (page: number) => {
  store.setCurrentPage(page);
};

// 멤버 목록 불러오기
const fetchMembers = async (role = selectedRole.value, page = currentPage.value) => {
  try {
    console.log('MemberTabs.vue 안에서 fetchMembers api 호출 ');
    console.log('역할:', role, '페이지:', page);
    const { members, totalPages } = await memberApi.getMembers(role, page);

    console.log('members: ', members);
    console.log('totalPages: ', totalPages);

    store.setMembers(members, totalPages);
  } catch (error) {
    console.error('멤버 목록 조회 실패:', error);
  }
};

// 초기 데이터 불러오기
onMounted(() => {
  fetchMembers(selectedRole.value, currentPage.value);
});

// 역할 변경 시 자동 업데이트
watch(selectedRole, (newRole) => {
  fetchMembers(newRole, 1);
});
</script>

<style scoped></style>
