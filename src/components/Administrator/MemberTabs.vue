<template>
  <div class="mx-auto w-[75%]">
    <!-- 탭 UI -->
    <div class="flex justify-between border-b border-gray-3 mb-4">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="[
          'px-6 py-2 text-sm font-semibold',
          currentTab === tab ? 'border-b-2 border-primary-3 text-primary-3' : 'text-gray-0 hover:text-primary-3',
        ]"
        @click="switchTab(tab)"
      >
        {{ tab }}
      </button>
    </div>

    <!-- 멤버 리스트 -->
    <div class="flex flex-wrap justify-between gap-4 mx-2">
      <MemberCard v-for="member in filteredMembers" :key="member.id" :member="member" class="w-1/5" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import MemberCard from '../../components/Administrator/MemberCard.vue';

// 샘플 멤버 데이터
const members = ref([
  { id: 1, name: '홍길동', role: '관리자', email: 'test@test.com', profileImage: '/path/to/image1.jpg' },
  { id: 2, name: '홍길동', role: '관리자', email: 'test@test.com', profileImage: '/path/to/image1.jpg' },
  { id: 3, name: '홍길동', role: '관리자', email: 'test@test.com', profileImage: '/path/to/image1.jpg' },
  { id: 4, name: '홍길동', role: '관리자', email: 'test@test.com', profileImage: '/path/to/image1.jpg' },
  { id: 5, name: '홍길동', role: '관리자', email: 'test@test.com', profileImage: '/path/to/image1.jpg' },
  { id: 6, name: '김영희', role: '담당자', email: 'test@test.com', profileImage: '/path/to/image2.jpg' },
  { id: 7, name: '이철수', role: '사용자', email: 'test@test.com', profileImage: '/path/to/image3.jpg' },
]);

// 탭 목록
const tabs = ['관리자', '담당자', '사용자'];

// 현재 선택된 탭
const currentTab = ref('관리자');

// 현재 탭에 따른 필터링된 멤버 리스트
const filteredMembers = computed(() => {
  return members.value.filter((member) => member.role === currentTab.value);
});

// 탭 전환 함수
function switchTab(tab) {
  currentTab.value = tab;
}
</script>

<style scoped>
/* 추가 스타일 필요 시 정의 */
</style>
