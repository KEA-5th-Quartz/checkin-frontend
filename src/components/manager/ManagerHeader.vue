<script setup lang="ts">
import { WarningIcon } from '@/assets/icons/path';
import SvgIcon from '../common/SvgIcon.vue';
</script>

<template>
  <section class="flex justify-center gap-14 mt-[70px] w-full">
    <!-- 오늘 마감 -->
    <div class="flex-center gap-6 pr-[70px] border-r">
      <div class="flex-center min-w-[60px] min-h-[60px] bg-primary-5 rounded-full">
        <SvgIcon :icon="WarningIcon" />
      </div>
      <div>
        <p class="manager-header-title">오늘 마감</p>
        <div class="flex items-end">
          <span class="text-black-0 text-2xl pr-2">5</span>
          <span class="text-black-0">개</span>
        </div>
      </div>
    </div>

    <!-- 생성 -->
    <div class="flex-center gap-6 pr-[70px] border-r">
      <div class="flex-center min-w-[60px] min-h-[60px] bg-primary-5 rounded-full">
        <SvgIcon :icon="WarningIcon" />
      </div>
      <div>
        <p class="manager-header-title">생성</p>
        <div class="flex items-end">
          <span class="text-black-0 text-2xl pr-2">5</span>
          <span class="text-black-0">개</span>
        </div>
      </div>
    </div>

    <!-- 진행중 -->
    <div class="flex-center gap-6 pr-[70px] border-r">
      <div class="flex-center min-w-[60px] min-h-[60px] bg-primary-5 rounded-full">
        <SvgIcon :icon="WarningIcon" />
      </div>
      <div>
        <p class="manager-header-title">진행중</p>
        <div class="flex items-end">
          <span class="text-black-0 text-2xl pr-2">5</span>
          <span class="text-black-0">개</span>
        </div>
      </div>
    </div>

    <!-- 완료 -->
    <div class="flex-center gap-6 pr-[70px] border-r">
      <div class="flex-center min-w-[60px] min-h-[60px] bg-primary-5 rounded-full">
        <SvgIcon :icon="WarningIcon" />
      </div>
      <div>
        <p class="manager-header-title">나의 티켓</p>
        <div class="flex items-end">
          <span class="text-black-0 text-2xl pr-2">5</span>
          <span class="text-black-0">개</span>
        </div>
      </div>
    </div>

    <!-- 나의 티켓 수 -->
    <div class="flex-center gap-6">
      <div class="flex-center min-w-[60px] min-h-[60px] bg-primary-5 rounded-full">
        <SvgIcon :icon="WarningIcon" />
      </div>
      <div>
        <p class="manager-header-title">오늘 마감</p>
        <div class="flex items-end">
          <span class="text-black-0 text-2xl pr-2">5</span>
          <span class="text-black-0">개</span>
        </div>
      </div>
    </div>
  </section>
</template>
