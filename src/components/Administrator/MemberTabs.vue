<template>
  <div class="mx-auto w-[83%]">
    <div class="flex justify-around border-b border-gray-2 mb-4">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="[
          'px-12 py-2 text-sm font-semibold',
          currentTab === tab ? 'border-b-4 border-primary-3 text-primary-3' : 'text-gray-0 hover:text-primary-3',
        ]"
        @click="switchTab(tab)"
      >
        {{ tab }}
      </button>
    </div>

    <div class="flex flex-wrap justify-between gap-7 mx-20">
      <MemberCard v-for="member in filteredMembers" :key="member.id" :member="member" class="w-[20%]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import MemberCard from '../../components/Administrator/MemberCard.vue';

// 샘플 멤버 데이터
const members = ref([
  { id: 1, name: 'King.js', role: '관리자', email: 'test@test.com', profileImage: '/path/to/image1.jpg' },
  { id: 2, name: 'Pixel.Master', role: '관리자', email: 'test@test.com', profileImage: '/path/to/image1.jpg' },
  { id: 3, name: 'Dev.Hero', role: '관리자', email: 'test@test.com', profileImage: '/path/to/image1.jpg' },
  { id: 4, name: 'Script.Ninja', role: '관리자', email: 'test@test.com', profileImage: '/path/to/image1.jpg' },
  { id: 5, name: 'Bug.Hunter', role: '관리자', email: 'test@test.com', profileImage: '/path/to/image1.jpg' },
  { id: 6, name: 'Cloud.Rider', role: '관리자', email: 'test@test.com', profileImage: '/path/to/image2.jpg' },
  { id: 7, name: 'Syntax.Guru', role: '관리자', email: 'test@test.com', profileImage: '/path/to/image3.jpg' },
  { id: 8, name: 'Logic.Wizard', role: '관리자', email: 'test@test.com', profileImage: '/path/to/image3.jpg' },
  { id: 9, name: 'Logic.Wizard', role: '담당자', email: 'test@test.com', profileImage: '/path/to/image3.jpg' },
  { id: 10, name: 'Logic.Wizard', role: '사용자', email: 'test@test.com', profileImage: '/path/to/image3.jpg' },
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

<style scoped></style>
