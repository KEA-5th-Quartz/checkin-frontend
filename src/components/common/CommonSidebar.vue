<script setup lang="ts">
import SvgIcon from './SvgIcon.vue';
import { DashboardIcon, LogoutIcon, SettingIcon, StatisticIcon, TimelineIcon } from '@/assets/icons/path';
</script>

<template>
  <nav class="sidebar-nav-container">
    <p class="sidebar-logo">CheckIn</p>

    <section class="sidebar-profile">
      <div class="w-14 h-14 rounded-full bg-pink-200" />
      <p class="sidebar-p">Neo.js</p>
      <p class="sidebar-p text-sm">담당자</p>
    </section>

    <ul class="sidebar-ul">
      <li class="sidebar-li"><SvgIcon :icon="DashboardIcon" /> 대시보드</li>
      <li class="sidebar-li"><SvgIcon :icon="TimelineIcon" />타임라인</li>
      <li class="sidebar-li"><SvgIcon :icon="StatisticIcon" />통계</li>
      <li class="sidebar-li"><SvgIcon :icon="SettingIcon" />설정</li>
    </ul>

    <button class="fixed left-[1%] bottom-[5%]" @click="console.log('로그아웃')">
      <SvgIcon :icon="LogoutIcon" />
    </button>
  </nav>
</template>
