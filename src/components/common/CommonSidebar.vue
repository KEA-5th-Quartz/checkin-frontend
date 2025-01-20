<script setup lang="ts">
import { ref } from 'vue';
import SvgIcon from './SvgIcon.vue';
import {
  CategoryIcon,
  CreateIcon,
  DashboardIcon,
  HomeIcon,
  LogoutIcon,
  MemberIcon,
  SettingIcon,
  StatisticIcon,
  TimelineIcon,
} from '@/assets/icons/path';

type Role = 'manager' | 'admin' | 'user';
const role = ref<Role>('manager'); // ref를 사용하여 반응형 상태로 선언
</script>

<template>
  <nav class="sidebar-nav-container">
    <p class="sidebar-logo">CheckIn</p>

    <section class="sidebar-profile">
      <div class="w-[77px] h-[77px] rounded-full bg-pink-200" />
      <p class="sidebar-p">Neo.js</p>
      <p class="sidebar-p text-sm">담당자</p>
    </section>

    <!-- 담당자 -->
    <ul v-if="role === 'manager'" class="sidebar-ul">
      <li class="sidebar-li"><SvgIcon :icon="DashboardIcon" />대시보드</li>
      <li class="sidebar-li"><SvgIcon :icon="TimelineIcon" />타임라인</li>
      <li class="sidebar-li"><SvgIcon :icon="StatisticIcon" />통계</li>
      <li class="sidebar-li"><SvgIcon :icon="SettingIcon" />설정</li>
    </ul>

    <!-- 관리자 -->
    <ul v-else-if="role === 'admin'" class="sidebar-ul">
      <li class="sidebar-li"><SvgIcon :icon="HomeIcon" />홈</li>
      <li class="sidebar-li"><SvgIcon :icon="MemberIcon" />회원 관리</li>
      <li class="sidebar-li"><SvgIcon :icon="CategoryIcon" />카테고리 관리</li>
      <li class="sidebar-li"><SvgIcon :icon="StatisticIcon" />통계</li>
      <li class="sidebar-li"><SvgIcon :icon="SettingIcon" />설정</li>
    </ul>

    <!-- 사용자 -->
    <ul v-else-if="role === 'user'" class="sidebar-ul">
      <li class="sidebar-li"><SvgIcon :icon="CategoryIcon" />티켓 목록</li>
      <li class="sidebar-li">요청 티켓</li>
      <li class="sidebar-li">티켓 템플릿</li>
      <li class="sidebar-li"><SvgIcon :icon="CreateIcon" />티켓 생성</li>
      <li class="sidebar-li"><SvgIcon :icon="SettingIcon" />설정</li>
    </ul>

    <button class="fixed left-10 bottom-10" @click="console.log('로그아웃')">
      <SvgIcon :icon="LogoutIcon" />
    </button>
  </nav>
</template>
