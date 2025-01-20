<script setup lang="ts">
import { BookmarkIcon, MedalIcon, PencilIcon, ProgressIcon, WarningIcon } from '@/assets/icons/path';
import SvgIcon from '../common/SvgIcon.vue';
</script>

<template>
  <section class="manager-header-section">
    <!-- 오늘 마감 -->
    <div class="manager-header-card">
      <div class="manager-header-card-icon">
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
    <div class="manager-header-card">
      <div class="manager-header-card-icon">
        <SvgIcon :icon="PencilIcon" />
      </div>
      <div>
        <p class="manager-header-title">생성</p>
        <div class="flex items-end">
          <span class="text-black-0 text-2xl pr-2">6</span>
          <span class="text-black-0">개</span>
        </div>
      </div>
    </div>

    <!-- 진행중 -->
    <div class="manager-header-card">
      <div class="manager-header-card-icon">
        <SvgIcon :icon="ProgressIcon" />
      </div>
      <div>
        <p class="manager-header-title">진행중</p>
        <div class="flex items-end">
          <span class="text-black-0 text-2xl pr-2">18</span>
          <span class="text-black-0">개</span>
        </div>
      </div>
    </div>

    <!-- 완료 -->
    <div class="manager-header-card">
      <div class="manager-header-card-icon">
        <SvgIcon :icon="MedalIcon" />
      </div>
      <div>
        <p class="manager-header-title">완료</p>
        <div class="flex items-end">
          <span class="text-black-0 text-2xl pr-2">5</span>
          <span class="text-black-0">개</span>
        </div>
      </div>
    </div>

    <!-- 나의 티켓 수 -->
    <div class="manager-header-card pr-0 border-none">
      <div class="manager-header-card-icon">
        <SvgIcon :icon="BookmarkIcon" />
      </div>
      <div>
        <p class="manager-header-title">오늘 마감</p>
        <div class="flex items-end">
          <span class="text-black-0 text-2xl pr-2">55 / 187</span>
        </div>
      </div>
    </div>
  </section>
</template>
