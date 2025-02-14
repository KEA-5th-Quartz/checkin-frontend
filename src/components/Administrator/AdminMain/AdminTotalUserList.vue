<template>
  <div class="member-list-container">
    <div class="member-list-section">
      <h2 class="member-list-title">관리자</h2>
      <div class="member-list-wrapper">
        <template v-if="adminLoading">
          <SkeletonList />
        </template>
        <template v-else-if="adminData && adminData?.members.length > 0">
          <div v-for="member in adminData.members" :key="member.memberId" class="flex items-center gap-4 ml-5">
            <img
              :src="member.profilePic"
              alt="프로필"
              class="w-8 h-8 rounded-full object-cover border border-gray-2;"
            />
            <span class="member-list-name">{{ member.username }}</span>
          </div>
        </template>
        <template v-else>
          <p class="member-list-empty">등록된 관리자가 없습니다.</p>
        </template>
      </div>
    </div>
    <div class="member-list-section">
      <h2 class="member-list-title">담당자</h2>
      <div class="member-list-wrapper">
        <template v-if="managerLoading">
          <SkeletonList />
        </template>
        <template v-else-if="managerData && managerData?.members.length > 0">
          <div v-for="member in managerData.members" :key="member.memberId" class="flex items-center gap-4 ml-5">
            <img :src="member.profilePic" alt="프로필" class="member-list-image" />
            <span class="member-list-name">{{ member.username }}</span>
          </div>
        </template>
        <template v-else>
          <p class="member-list-empty">등록된 담당자가 없습니다.</p>
        </template>
      </div>
    </div>
    <div class="member-list-section">
      <h2 class="member-list-title">사용자</h2>
      <div class="member-list-wrapper">
        <template v-if="userLoading">
          <SkeletonList />
        </template>
        <template v-else-if="userData && userData?.members.length > 0">
          <div v-for="member in userData.members" :key="member.memberId" class="flex items-center gap-4 ml-5">
            <img :src="member.profilePic" alt="프로필" class="member-list-image" />
            <span class="member-list-name">{{ member.username }}</span>
          </div>
        </template>
        <template v-else>
          <p class="member-list-empty">등록된 사용자가 없습니다.</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomQuery } from '@/composables/useCustomQuery';
import { memberApi } from '@/services/memberService/memberService';
import SkeletonList from '@/components/UI/SkeletonList.vue';

const { data: adminData, isLoading: adminLoading } = useCustomQuery(['members', 'ADMIN'], () =>
  memberApi.getMembers('ADMIN', 1, 5),
);
const { data: managerData, isLoading: managerLoading } = useCustomQuery(['members', 'MANAGER'], () =>
  memberApi.getMembers('MANAGER', 1, 5),
);
const { data: userData, isLoading: userLoading } = useCustomQuery(['members', 'USER'], () =>
  memberApi.getMembers('USER', 1, 5),
);
</script>
