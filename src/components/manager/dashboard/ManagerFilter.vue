<script setup lang="ts">
import { ArrowDownIcon, CalendarIcon } from '@/assets/icons/path';
import StatusBadge from '@/components/common/Badges/StatusBadge.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { onClickOutside } from '@vueuse/core';
import { ref } from 'vue';
import { firstCategory, managerOptions, status } from '../ticketOptionTest';

const emit = defineEmits(['closeFilter']);
const modalRef = ref<HTMLElement | null>(null);

// 필터 선택 상태 관리
const selectedQuickFilters = ref<string[]>([]);
const selectedManagers = ref<string[]>([]);
const selectedStatuses = ref<string[]>([]);
const selectedPriorities = ref<string[]>([]);
const selectedCategories = ref<string[]>([]);

// 드롭다운 상태 관리
const isManagerDropdownOpen = ref(false);
const isCategoryDropdownOpen = ref(false);

// 빠른 필터 옵션
const quickFilters = [{ id: 'dueThisWeek', label: '이번 주에 기한', icon: CalendarIcon }];

// 우선순위 옵션
const priorities = [
  { id: 'urgent', label: '긴급', bgClass: 'bg-red-0', textClass: 'text-red-1' },
  { id: 'high', label: '높음', bgClass: 'bg-orange-0', textClass: 'text-orange-1' },
  { id: 'medium', label: '보통', bgClass: 'bg-green-0', textClass: 'text-green-1' },
  { id: 'low', label: '낮음', bgClass: 'bg-primary-2', textClass: 'text-primary-3' },
];

// 필터 토글 함수들
const toggleQuickFilter = (filterId: string) => {
  if (selectedQuickFilters.value.includes(filterId)) {
    selectedQuickFilters.value = selectedQuickFilters.value.filter((id) => id !== filterId);
  } else {
    selectedQuickFilters.value.push(filterId);
  }
};

const toggleManager = (value: string) => {
  if (selectedManagers.value.includes(value)) {
    selectedManagers.value = selectedManagers.value.filter((item) => item !== value);
  } else {
    selectedManagers.value.push(value);
  }
};

const toggleStatus = (status: string) => {
  if (selectedStatuses.value.includes(status)) {
    selectedStatuses.value = selectedStatuses.value.filter((s) => s !== status);
  } else {
    selectedStatuses.value.push(status);
  }
};

const togglePriority = (priorityId: string) => {
  if (selectedPriorities.value.includes(priorityId)) {
    selectedPriorities.value = selectedPriorities.value.filter((id) => id !== priorityId);
  } else {
    selectedPriorities.value.push(priorityId);
  }
};

const toggleCategory = (category: string) => {
  if (selectedCategories.value.includes(category)) {
    selectedCategories.value = selectedCategories.value.filter((c) => c !== category);
  } else {
    selectedCategories.value.push(category);
  }
};

// 저장 버튼 클릭 핸들러
const handleSave = () => {
  console.log('상위 필터:', selectedQuickFilters.value);
  console.log('담당자', selectedManagers.value);
  console.log('상태:', selectedStatuses.value);
  console.log('우선순위:', selectedPriorities.value);
  console.log('카테고리:', selectedCategories.value);
};

onClickOutside(modalRef, () => {
  emit('closeFilter');
});
</script>

<template>
  <div
    ref="modalRef"
    class="bg-white-0 rounded-lg w-[300px] max-h-[600px] overflow-y-auto shadow-md pb-4 hide-scrollbar"
  >
    <div class="py-3 px-8 bg-primary-0 text-white-1 font-bold">필터</div>

    <section class="flex flex-col py-6 px-5 text-sm">
      <div
        v-for="filter in quickFilters"
        :key="filter.id"
        @click="toggleQuickFilter(filter.id)"
        class="flex items-center gap-1 hover:bg-gray-3 py-1 px-2 rounded-xl cursor-pointer"
        :class="{
          'opacity-100': selectedQuickFilters.includes(filter.id),
          'opacity-30': !selectedQuickFilters.includes(filter.id),
        }"
      >
        <SvgIcon :icon="filter.icon" :class="{ 'p-0.5 bg-gray-2 rounded-full': filter.id === 'assignedToMe' }" />
        <p>{{ filter.label }}</p>
      </div>
    </section>
    <!-- 담당자 -->
    <section class="flex flex-col px-7 pb-5">
      <p class="border-b-2 border-gray-0 max-w-fit pr-4 mb-2">담당자</p>
      <div class="relative">
        <div
          @click="isManagerDropdownOpen = !isManagerDropdownOpen"
          class="flex items-center justify-between border border-gray-2 hover:border-gray-1 rounded-[10px] py-[5px] text-start px-3 cursor-pointer"
        >
          <p v-if="selectedManagers.length === 0" class="opacity-30">담당자 선택</p>
          <p v-else>{{ selectedManagers.length }}명 선택</p>
          <SvgIcon
            :icon="ArrowDownIcon"
            :class="['transition-transform duration-200', isManagerDropdownOpen ? 'rotate-180' : '']"
          />
        </div>

        <div
          v-if="isManagerDropdownOpen"
          class="absolute z-20 top-9 mt-1 w-full bg-white-0 border border-gray-2 rounded-lg shadow-md max-h-60 overflow-y-auto hide-scrollbar"
        >
          <div
            v-for="manager in managerOptions"
            :key="manager.id"
            @click="toggleManager(manager.value)"
            class="px-3 py-2 hover:bg-gray-3 cursor-pointer flex items-center justify-between"
            :class="[selectedManagers.includes(manager.value) ? ['bg-gray-3', 'text-gray-0'] : ['text-gray-2']]"
          >
            <p>{{ manager.label }}</p>
          </div>
        </div>
      </div>
    </section>
    <!-- 카테고리 -->
    <section class="flex flex-col px-7 pb-5">
      <p class="border-b-2 border-gray-0 max-w-fit mb-3.5">카테고리</p>
      <div class="relative">
        <div
          @click="isCategoryDropdownOpen = !isCategoryDropdownOpen"
          class="flex items-center justify-between border border-gray-2 hover:border-gray-1 rounded-[10px] py-[5px] text-start px-3 cursor-pointer"
        >
          <p v-if="selectedCategories.length === 0" class="opacity-30">카테고리 선택</p>
          <p v-else>{{ selectedCategories.length }}개 선택</p>

          <SvgIcon
            :icon="ArrowDownIcon"
            :class="['transition-transform duration-200', isCategoryDropdownOpen ? 'rotate-180' : '']"
          />
        </div>

        <div
          v-if="isCategoryDropdownOpen"
          class="absolute z-10 top-9 mt-1 w-full bg-white-0 border border-gray-2 rounded-lg shadow-md max-h-60 overflow-y-auto hide-scrollbar"
        >
          <div
            v-for="category in firstCategory"
            :key="category.id"
            @click="toggleCategory(category.value)"
            class="px-3 py-2 hover:bg-gray-3 cursor-pointer flex items-center justify-between"
            :class="[selectedCategories.includes(category.value) ? ['bg-gray-3', 'text-gray-0'] : ['text-gray-2']]"
          >
            {{ category.label }}
          </div>
        </div>
      </div>
    </section>
    <!-- 상태 -->
    <section class="flex flex-col px-7">
      <p class="border-b-2 border-gray-0 max-w-fit pr-4">상태</p>
      <div class="flex gap-2 pt-3.5">
        <StatusBadge
          v-for="sta in status"
          :key="sta.id"
          :status="sta.label"
          size="lg"
          class="cursor-pointer"
          :class="{
            'opacity-100': selectedStatuses.includes(sta.id as unknown as string),
            'opacity-30 hover:opacity-50': !selectedStatuses.includes(sta.id as unknown as string),
          }"
          @click="toggleStatus(sta.id as unknown as string)"
        />
      </div>
    </section>
    <!-- 우선순위 -->
    <section class="flex flex-col px-7 pt-5">
      <p class="border-b-2 border-gray-0 max-w-fit pr-4">우선순위</p>
      <div class="flex gap-2 pt-3.5">
        <div
          v-for="priority in priorities"
          :key="priority.id"
          @click="togglePriority(priority.id)"
          class="px-3 py-1.5 text-sm flex-center font-bold rounded-full cursor-pointer"
          :class="[
            priority.bgClass,
            priority.textClass,
            {
              'opacity-100': selectedPriorities.includes(priority.id),
              'opacity-30 hover:opacity-50': !selectedPriorities.includes(priority.id),
            },
          ]"
        >
          {{ priority.label }}
        </div>
      </div>
    </section>
    <!-- 취소 저장 버튼 -->
    <section class="flex justify-center w-full gap-4 pt-7">
      <button class="px-6 py-1 text-sm border border-gray-1 rounded-lg hover:bg-gray-100 whitespace-nowrap">
        취소
      </button>
      <button
        @click="handleSave"
        class="px-6 py-1 text-sm text-white bg-primary-0 rounded-lg hover:bg-opacity-80 text-white-0 whitespace-nowrap"
      >
        저장
      </button>
    </section>
  </div>
</template>
