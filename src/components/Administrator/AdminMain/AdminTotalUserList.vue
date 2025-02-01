<template>
  <div class="w-full p-5 border-l-2 border-gray-2">
    <div v-for="(group, role) in groupedMembers" :key="role" class="mb-6">
      <h2 class="text-lg font-bold border-b pb-2">{{ role }}</h2>
      <div class="flex flex-col gap-2 mt-3">
        <div v-for="member in group.slice(0, 5)" :key="member.id" class="flex items-center gap-4 ml-5">
          <img :src="member.profileImage" alt="프로필" class="w-8 h-8 rounded-full object-cover" />
          <span class="text-sm font-medium">{{ member.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

// 사용자 리스트 (샘플 데이터)
const members = ref([
  { id: 1, name: 'King.js', role: '관리자', email: 'king@test.com', profileImage: '/path/to/image1.jpg' },
  { id: 2, name: 'Pixel.Master', role: '관리자', email: 'pixel@test.com', profileImage: '/path/to/image1.jpg' },
  { id: 3, name: 'Dev.Hero', role: '관리자', email: 'devhero@test.com', profileImage: '/path/to/image1.jpg' },
  { id: 4, name: 'Admin.Fox', role: '관리자', email: 'admin@test.com', profileImage: '/path/to/image1.jpg' },
  { id: 5, name: 'System.Guard', role: '관리자', email: 'system@test.com', profileImage: '/path/to/image1.jpg' },
  { id: 6, name: 'Script.Ninja', role: '담당자', email: 'script@test.com', profileImage: '/path/to/image2.jpg' },
  { id: 7, name: 'Bug.Hunter', role: '담당자', email: 'bug@test.com', profileImage: '/path/to/image2.jpg' },
  { id: 8, name: 'Cloud.Rider', role: '담당자', email: 'cloud@test.com', profileImage: '/path/to/image2.jpg' },
  { id: 9, name: 'Syntax.Guru', role: '담당자', email: 'syntax@test.com', profileImage: '/path/to/image2.jpg' },
  { id: 10, name: 'Test.Master', role: '담당자', email: 'test@test.com', profileImage: '/path/to/image2.jpg' },
  { id: 11, name: 'Logic.Wizard', role: '사용자', email: 'logic@test.com', profileImage: '/path/to/image3.jpg' },
  { id: 12, name: 'Debug.Lord', role: '사용자', email: 'debug@test.com', profileImage: '/path/to/image3.jpg' },
  { id: 13, name: 'Byte.Knight', role: '사용자', email: 'byte@test.com', profileImage: '/path/to/image3.jpg' },
  { id: 14, name: 'Stack.Overlord', role: '사용자', email: 'stack@test.com', profileImage: '/path/to/image3.jpg' },
  { id: 15, name: 'Node.King', role: '사용자', email: 'node@test.com', profileImage: '/path/to/image3.jpg' },
]);

// 역할별 그룹화 (관리자, 담당자, 사용자)
const groupedMembers = computed(() => {
  return members.value.reduce((acc, member) => {
    if (!acc[member.role]) {
      acc[member.role] = [];
    }
    acc[member.role].push(member);
    return acc;
  }, {} as Record<string, typeof members.value>);
});
</script>
