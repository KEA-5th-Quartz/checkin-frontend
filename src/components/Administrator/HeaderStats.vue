<template>
  <div class="max-w-4xl mx-auto flex justify-between items-center bg-white-0 p-4 pt-8">
    <!-- 관리자 -->
    <div class="flex items-center gap-2">
      <SvgIcon
        :icon="{
          width: 24,
          height: 24,
          path: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
          fill: '#3570FF', // primary.3
        }"
      />
      <div>
        <p class="text-lg font-semibold text-gray-0">관리자</p>
        <p class="text-xl font-bold text-black-0">{{ adminCount }}명</p>
      </div>
    </div>

    <!-- 담당자 -->
    <div class="flex items-center gap-2">
      <SvgIcon
        :icon="{
          width: 24,
          height: 24,
          path: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
          fill: '#48C5FF', // primary.4
        }"
      />
      <div>
        <p class="text-lg font-semibold text-gray-0">담당자</p>
        <p class="text-xl font-bold text-black-0">{{ managerCount }}명</p>
      </div>
    </div>

    <!-- 사용자 -->
    <div class="flex items-center gap-2">
      <SvgIcon
        :icon="{
          width: 24,
          height: 24,
          path: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
          fill: '#45D934', // green.1
        }"
      />
      <div>
        <p class="text-lg font-semibold text-gray-0">사용자</p>
        <p class="text-xl font-bold text-black-0">{{ userCount }}명</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '../../components/common/SvgIcon.vue';

const props = defineProps({
  adminCount: {
    type: Number,
    required: true,
  },
  managerCount: {
    type: Number,
    required: true,
  },
  userCount: {
    type: Number,
    required: true,
  },
});
</script>
