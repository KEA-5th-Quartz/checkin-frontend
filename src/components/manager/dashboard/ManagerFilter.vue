<script setup lang="ts">
import { ArrowDownIcon, CalendarIcon } from '@/assets/icons/path';
import StatusBadge from '@/components/common/Badges/StatusBadge.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { onClickOutside } from '@vueuse/core';
import { ref } from 'vue';
import { firstCategory, managerOptions, status } from '../ticketOptionTest';

const emit = defineEmits(['closeFilter']);
const modalRef = ref<HTMLElement | null>(null);
const managerRef = ref<HTMLElement | null>(null);
const categoryRef = ref<HTMLElement | null>(null);

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

onClickOutside(managerRef, () => {
  isManagerDropdownOpen.value = false;
});

onClickOutside(categoryRef, () => {
  isCategoryDropdownOpen.value = false;
});

onClickOutside(modalRef, () => {
  emit('closeFilter');
});
</script>

<template>
  <div ref="modalRef" class="filter-container">
    <div class="filter-title">필터</div>

    <section class="filter-section pt-5 text-sm">
      <div
        v-for="filter in quickFilters"
        :key="filter.id"
        @click="toggleQuickFilter(filter.id)"
        class="filter-quick-div"
        :class="[selectedQuickFilters.includes(filter.id) ? 'opacity-100' : 'opacity-30']"
      >
        <SvgIcon :icon="filter.icon" />
        <p>{{ filter.label }}</p>
      </div>
    </section>
    <!-- 담당자 -->
    <section class="filter-section">
      <label class="filter-label">담당자</label>
      <div class="relative" ref="managerRef">
        <div @click="isManagerDropdownOpen = !isManagerDropdownOpen" class="filter-dropdown">
          <p v-if="selectedManagers.length === 0" class="opacity-30">담당자 선택</p>
          <p v-else>{{ selectedManagers.length }}명 선택</p>
          <SvgIcon :icon="ArrowDownIcon" :class="['transition-02s', isManagerDropdownOpen ? 'rotate-180' : '']" />
        </div>

        <ul v-if="isManagerDropdownOpen" class="filter-dropdown-ul">
          <li
            v-for="manager in managerOptions"
            :key="manager.id"
            @click="toggleManager(manager.value)"
            class="filter-dropdown-li"
            :class="[
              selectedManagers.includes(manager.value) ? 'bg-gray-3 text-gray-0 hover:font-semibold' : 'text-gray-2',
            ]"
          >
            {{ manager.label }}
          </li>
        </ul>
      </div>
    </section>
    <!-- 카테고리 -->
    <section class="filter-section">
      <label class="filter-label">카테고리</label>
      <div class="relative" ref="categoryRef">
        <div @click="isCategoryDropdownOpen = !isCategoryDropdownOpen" class="filter-dropdown">
          <p v-if="selectedCategories.length === 0" class="opacity-30">카테고리 선택</p>
          <p v-else>{{ selectedCategories.length }}개 선택</p>

          <SvgIcon :icon="ArrowDownIcon" :class="['transition-02s', isCategoryDropdownOpen ? 'rotate-180' : '']" />
        </div>

        <ul v-if="isCategoryDropdownOpen" class="filter-dropdown-ul">
          <li
            v-for="category in firstCategory"
            :key="category.id"
            @click="toggleCategory(category.value)"
            class="filter-dropdown-li"
            :class="[
              selectedCategories.includes(category.value) ? 'bg-gray-3 text-gray-0 hover:font-semibold' : 'text-gray-2',
            ]"
          >
            {{ category.label }}
          </li>
        </ul>
      </div>
    </section>
    <!-- 상태 -->
    <section class="filter-section">
      <label class="filter-label">상태</label>
      <div class="flex gap-2">
        <StatusBadge
          v-for="sta in status"
          :key="sta.id"
          :status="sta.label"
          size="lg"
          class="cursor-pointer"
          :class="[selectedStatuses.includes(sta.id as unknown as string) ? 'opacity-100':'opacity-30 hover:opacity-50']"
          @click="toggleStatus(sta.id as unknown as string)"
        />
      </div>
    </section>
    <!-- 우선순위 -->
    <section class="filter-section">
      <label class="filter-label">우선순위</label>
      <ul class="flex gap-2">
        <li
          v-for="priority in priorities"
          :key="priority.id"
          @click="togglePriority(priority.id)"
          class="filter-priority-li"
          :class="[
            priority.bgClass,
            priority.textClass,
            selectedPriorities.includes(priority.id) ? ['opacity-100'] : ['opacity-30', 'hover:opacity-50'],
          ]"
        >
          {{ priority.label }}
        </li>
      </ul>
    </section>
    <!-- 취소 저장 버튼 -->
    <section class="filter-btn-section">
      <button @click="emit('closeFilter')" class="btn-cancel">취소</button>
      <button @click="handleSave" class="btn-main">저장</button>
    </section>
  </div>
</template>
