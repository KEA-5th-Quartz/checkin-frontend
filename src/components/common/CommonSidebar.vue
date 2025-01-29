<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import SvgIcon from './SvgIcon.vue';
import {
  CategoryIcon,
  CreateTicketIcon,
  DashboardIcon,
  HomeIcon,
  LogoutIcon,
  MemberIcon,
  SettingIcon,
  StatisticIcon,
  TemplateIcon,
  TimelineIcon,
} from '@/assets/icons/path';
import { useMemberStore } from '@/stores/memberStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const memberStore = useMemberStore();

onMounted(async () => {
  if (!memberStore.accessToken) {
    const success = await memberStore.restoreAuth();
    if (!success) {
      router.push('/');
    }
  }
});

const isTemplateOpen = ref(false);

const role = computed(() => memberStore.role as 'MANAGER' | 'ADMIN' | 'USER');

const managerNavItems = [
  { name: '대시보드', icon: DashboardIcon, path: '/manager/dashboard' },
  { name: '타임라인', icon: TimelineIcon, path: '/manager/timeline' },
  { name: '통계', icon: StatisticIcon, path: '/manager/statistics' },
  { name: '설정', icon: SettingIcon, path: '/settings' },
];

const adminNavItems = [
  { name: '홈', icon: HomeIcon, path: '/admin' },
  { name: '회원 관리', icon: MemberIcon, path: '/admin/members' },
  { name: '카테고리 관리', icon: CategoryIcon, path: '/admin/categories' },
  { name: '통계', icon: StatisticIcon, path: '/admin/statistics' },
  { name: '설정', icon: SettingIcon, path: '/settings' },
];

const userNavItems = [
  { name: '티켓 목록', icon: CategoryIcon, path: '/user/tickets' },
  { name: '새 요청 티켓', icon: TemplateIcon, path: '/user/addticket' },
];

const userTemplateItems = [
  { name: '티켓 템플릿', path: '/user/templates' },
  { name: '새 티켓 템플릿', path: '/user/addtemplate' },
];
</script>

<template>
  <nav class="sidebar-nav-container">
    <p class="sidebar-logo">CheckIn</p>

    <section class="sidebar-profile">
      <div class="w-[77px] h-[77px] rounded-full bg-pink-200">
        <img
          v-if="memberStore.profilePic"
          :src="memberStore.profilePic"
          alt="프로필"
          class="w-full h-full rounded-full object-cover"
        />
      </div>
      <p class="sidebar-p">{{ memberStore.username }}</p>
      <p class="sidebar-p text-sm">{{ memberStore.role }}</p>
    </section>

    <!-- 담당자 -->
    <ul v-if="role === 'MANAGER'" class="sidebar-ul">
      <router-link
        v-for="item in managerNavItems"
        :key="item.path"
        :to="item.path"
        custom
        v-slot="{ isActive, navigate }"
      >
        <li class="sidebar-li relative" :class="{ active: isActive }" @click="navigate">
          <div
            class="sidebar-active"
            :class="{ 'translate-x-0 opacity-100': isActive, '-translate-x-full opacity-0': !isActive }"
          />
          <SvgIcon :icon="item.icon" />
          {{ item.name }}
        </li>
      </router-link>
    </ul>

    <!-- 관리자 -->
    <ul v-else-if="role === 'ADMIN'" class="sidebar-ul">
      <router-link
        v-for="item in adminNavItems"
        :key="item.path"
        :to="item.path"
        custom
        v-slot="{ isActive, navigate }"
      >
        <li class="sidebar-li relative" :class="{ active: isActive }" @click="navigate">
          <div v-if="isActive" class="sidebar-active" />
          <SvgIcon :icon="item.icon" />
          {{ item.name }}
        </li>
      </router-link>
    </ul>

    <!-- 사용자 -->
    <ul v-else-if="role === 'USER'" class="sidebar-ul">
      <router-link v-for="item in userNavItems" :key="item.path" :to="item.path" custom v-slot="{ isActive, navigate }">
        <li class="sidebar-li relative" :class="{ active: isActive }" @click="navigate">
          <div v-if="isActive" class="sidebar-active" />
          <SvgIcon :icon="item.icon" />
          {{ item.name }}
        </li>
      </router-link>

      <!-- 템플릿 -->
      <li class="relative">
        <div
          class="sidebar-li cursor-pointer"
          :class="{ active: isTemplateOpen }"
          @click="isTemplateOpen = !isTemplateOpen"
        >
          <SvgIcon :icon="CreateTicketIcon" class="" /> 템플릿
        </div>

        <!-- 하위 메뉴 -->
        <transition name="submenu">
          <ul v-show="isTemplateOpen" class="sidebar-sub-menu">
            <router-link
              v-for="item in userTemplateItems"
              :key="item.path"
              :to="item.path"
              custom
              v-slot="{ isActive, navigate }"
            >
              <li class="relative pr-6 lg:pr-12 whitespace-nowrap" :class="{ active: isActive }" @click="navigate">
                <div v-if="isActive" class="sidebar-active -left-8" />
                {{ item.name }}
              </li>
            </router-link>
          </ul>
        </transition>
      </li>

      <!-- 설정 메뉴 -->
      <router-link to="/settings" custom v-slot="{ isActive, navigate }">
        <li class="sidebar-li relative" :class="{ active: isActive }" @click="navigate">
          <div v-if="isActive" class="sidebar-active" />
          <SvgIcon :icon="SettingIcon" />
          설정
        </li>
      </router-link>
    </ul>

    <button class="absolute left-10 bottom-10" @click="router.push('/')">
      <SvgIcon :icon="LogoutIcon" />
    </button>
  </nav>
</template>

<style scoped>
.sidebar-active {
  transition: all 0.6s ease;
}

.sidebar-li {
  transition: all 0.3s ease;
}

.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.2s ease;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
