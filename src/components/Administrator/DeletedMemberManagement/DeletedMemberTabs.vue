<template>
  <div class="deletedMemberManagement-container">
    <div class="flex flex-wrap overflow-y-auto hide-scrollbar">
      <div v-if="isLoading" class="deletedMemberManagement-loading">
        <SkeletonCard v-for="n in 8" :key="n" class="w-[80%]" />
      </div>
      <div v-else-if="members.length > 0" class="deletedMemberManagement-grid">
        <DeletedMemberManagement v-for="member in members" :key="member.memberId" :member="member" />
      </div>
      <div v-else class="deletedMemberManagement-empty">
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
import { computed, ref, watch } from 'vue';
import CustomPagination from '@/components/common/CustomPagination.vue';
import { memberApi } from '@/services/memberService/memberService';
import { useCustomQuery } from '@/composables/useCustomQuery';
import SkeletonCard from '@/components/UI/SkeletonCard.vue';
import DeletedMemberManagement from './DeletedMemberManagement.vue';
import { useDeletedMemberListStore } from '@/stores/useDeletedMemberListStore';

const store = useDeletedMemberListStore();
const currentPage = ref(parseInt(sessionStorage.getItem('deletedMembersPage') || '1'));
store.setCurrentPage(currentPage.value);
const totalPages = computed(() => store.totalPages);

const { data, isLoading } = useCustomQuery(
  ['deleted-members', currentPage],
  async () => {
    const response = await memberApi.getDeletedMember(currentPage.value, 10);
    return response.data.data;
  },
  { keepPreviousData: true },
);

const members = computed(() => data.value?.members || []);

watch(data, (newData) => {
  if (newData) {
    store.setMembers(newData.members, newData.totalPages);
  }
});

const handlePageChange = async (page: number) => {
  store.setCurrentPage(page);
  currentPage.value = page;
  sessionStorage.setItem('deletedMembersPage', page.toString());
};
</script>
