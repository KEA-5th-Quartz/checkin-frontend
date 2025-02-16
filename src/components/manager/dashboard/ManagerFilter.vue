<script setup lang="ts">
import { ArrowDownIcon, CalendarIcon } from '@/assets/icons/path';
import StatusBadge from '@/components/common/Badges/StatusBadge.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { onClickOutside } from '@vueuse/core';
import { computed, ref } from 'vue';
import { status } from '../ticketOptionTest';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { userApi } from '@/services/userService/userService';
import { categoryApi } from '@/services/categoryService/categoryService';
import { handleError } from '@/utils/handleError';
import { DialogProps, initialDialog } from '@/types/common/dialog';
import CommonDialog from '@/components/common/CommonDialog.vue';

const props = defineProps<{
  isMyTicket: boolean;
}>();

const emit = defineEmits(['closeFilter', 'applyFilters']);
const modalRef = ref<HTMLElement | null>(null);
const managerRef = ref<HTMLElement | null>(null);
const categoryRef = ref<HTMLElement | null>(null);

const selectedQuickFilter = ref<string>('');
const selectedManagers = ref<string[]>([]);
const selectedStatuses = ref<string[]>([]);
const selectedCategories = ref<string[]>([]);

const isManagerDropdownOpen = ref(false);
const isCategoryDropdownOpen = ref(false);

const dialogState = ref<DialogProps>({ ...initialDialog });

const quickFilters = [
  { id: 'dueToday', label: '오늘 마감', icon: CalendarIcon },
  { id: 'dueThisWeek', label: '이번 주 마감', icon: CalendarIcon },
];

const { data: managersData } = useCustomQuery(['manager-list'], async () => {
  try {
    const response = await userApi.getManagers('MANAGER', 1, 100);
    return response;
  } catch (err) {
    handleError(dialogState, '담당자 목록 조회 실패');
    throw err;
  }
});

const managerOptions = computed(() => {
  if (!managersData.value?.data?.data?.members) return [];

  return managersData.value.data.data.members.map(
    (manager: { memberId: number; username: string; profilePic: string }) => ({
      id: manager.memberId,
      value: manager.username,
      label: manager.username,
      profilePic: manager.profilePic,
    }),
  );
});

const { data: categoryData } = useCustomQuery(['category-list'], async () => {
  try {
    const response = await categoryApi.getCategories();
    return response;
  } catch (err) {
    handleError(dialogState, '카테고리 목록 조회 실패');
    throw err;
  }
});

const categoryOptions = computed(() => {
  if (!categoryData.value?.data?.data) return [];

  return categoryData.value.data.data.map((category: { firstCategoryId: number; firstCategoryName: string }) => ({
    id: category.firstCategoryId,
    value: category.firstCategoryName,
    label: category.firstCategoryName,
  }));
});

const toggleQuickFilter = (filterId: string) => {
  if (selectedQuickFilter.value === filterId) {
    selectedQuickFilter.value = '';
  } else {
    selectedQuickFilter.value = filterId;
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

const toggleCategory = (category: string) => {
  if (selectedCategories.value.includes(category)) {
    selectedCategories.value = selectedCategories.value.filter((c) => c !== category);
  } else {
    selectedCategories.value.push(category);
  }
};

const handleReset = () => {
  emit('applyFilters', {
    quickFilters: '',
    managers: [],
    statuses: [],
    categories: [],
  });
  emit('closeFilter');
};

const handleSave = () => {
  emit('applyFilters', {
    quickFilters: selectedQuickFilter.value,

    managers: props.isMyTicket ? [] : selectedManagers.value,
    statuses: selectedStatuses.value,
    categories: selectedCategories.value,
  });
  emit('closeFilter');
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
  <div ref="modalRef" class="filter-container board-filter-modal">
    <div class="filter-title">필터</div>

    <section class="filter-section pt-5 text-sm">
      <div
        v-for="filter in quickFilters"
        :key="filter.id"
        @click="toggleQuickFilter(filter.id)"
        class="filter-quick-div"
        :class="[selectedQuickFilter === filter.id ? 'opacity-100' : 'opacity-30']"
      >
        <SvgIcon :icon="filter.icon" />
        <p>{{ filter.label }}</p>
      </div>
    </section>

    <section v-if="!isMyTicket" class="filter-section">
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
            class="filter-dropdown-li flex items-center gap-2"
            :class="[
              selectedManagers.includes(manager.value) ? 'bg-gray-3 text-gray-0 hover:font-semibold' : 'text-gray-2',
            ]"
          >
            <img :src="manager.profilePic" :alt="manager.label" class="w-6 h-6 rounded-full object-cover" />
            <span>{{ manager.label }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section class="filter-section">
      <label class="filter-label">카테고리</label>
      <div class="relative" ref="categoryRef">
        <div @click="isCategoryDropdownOpen = !isCategoryDropdownOpen" class="filter-dropdown">
          <p v-if="selectedCategories.length === 0" class="opacity-30">카테고리 선택</p>
          <p v-else>{{ selectedCategories.length }}개 선택</p>

          <SvgIcon :icon="ArrowDownIcon" :class="['transition-02s', isCategoryDropdownOpen ? 'rotate-180' : '']" />
        </div>

        <ul v-if="isCategoryDropdownOpen" class="filter-dropdown-ul max-h-36">
          <li
            v-for="category in categoryOptions"
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

    <section class="filter-section">
      <label class="filter-label">상태</label>
      <div class="flex gap-2">
        <StatusBadge
          v-for="sta in status"
          :key="sta.id"
          :status="sta.label"
          size="lg"
          class="cursor-pointer"
          :class="selectedStatuses.includes(sta.id as unknown as string) ? 'opacity-100' : 'opacity-30 hover:opacity-50'"
          @click="toggleStatus(sta.id as unknown as string)"
        />
      </div>
    </section>

    <section class="filter-btn-section">
      <button @click="handleReset" class="btn-cancel">초기화</button>
      <button @click="handleSave" class="btn-main">저장</button>
    </section>
  </div>

  <CommonDialog
    v-if="dialogState.open"
    :isOneBtn="dialogState.isOneBtn"
    :title="dialogState.title"
    :content="dialogState.content"
    :mainText="dialogState.mainText"
    :onCancelClick="dialogState.onMainClick"
    :onMainClick="dialogState.onMainClick"
  />
</template>
