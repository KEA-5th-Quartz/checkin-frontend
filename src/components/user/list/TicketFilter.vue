<script setup lang="ts">
import { ArrowDownIcon } from '@/assets/icons/path';
import StatusBadge from '@/components/common/Badges/StatusBadge.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { onClickOutside } from '@vueuse/core';
import { computed, watch, ref } from 'vue';
import { status } from '@/components/manager/ticketOptionTest';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { categoryApi } from '@/services/categoryService/categoryService';

const props = defineProps({
  initialStatuses: Array,
  initialCategories: Array,
});

// 필터 선택 상태 관리
const selectedStatuses = ref<string[]>(props.initialStatuses || []);
const selectedCategories = ref<string[]>(props.initialCategories || []);

// watch를 사용해 props 값이 바뀌면 selectedStatuses와 selectedCategories 업데이트
watch(
  () => props.initialStatuses,
  (newStatuses) => {
    selectedStatuses.value = newStatuses || [];
  },
);

watch(
  () => props.initialCategories,
  (newCategories) => {
    selectedCategories.value = newCategories || [];
  },
);

const emit = defineEmits(['closeFilter', 'applyFilters']);
const modalRef = ref<HTMLElement | null>(null);
const categoryRef = ref<HTMLElement | null>(null);

// 드롭다운 상태 관리
const isCategoryDropdownOpen = ref(false);

// 카테고리 목록 페치
const { data: categoryData } = useCustomQuery(['category-list'], async () => {
  try {
    const response = await categoryApi.getCategories();
    return response;
  } catch (err) {
    console.error('카테고리 목록 조회 실패:', err);
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

// 필터 토글 함수들
const toggleStatus = (statusValue: string) => {
  if (selectedStatuses.value.includes(statusValue)) {
    selectedStatuses.value = selectedStatuses.value.filter((s) => s !== statusValue);
  } else {
    selectedStatuses.value.push(statusValue);
  }
};

// 필터 카테고리 함수들
const toggleCategory = (category: string) => {
  if (selectedCategories.value.includes(category)) {
    selectedCategories.value = selectedCategories.value.filter((c) => c !== category);
  } else {
    selectedCategories.value.push(category);
  }
};

// 초기화 버튼 클릭 핸들러
const handleReset = () => {
  emit('applyFilters', {
    quickFilters: '',
    managers: [],
    statuses: [],
    categories: [],
  });
  emit('closeFilter');
};

// 저장 버튼 클릭 핸들러
const handleSave = () => {
  emit('applyFilters', {
    statuses: selectedStatuses.value,
    categories: selectedCategories.value,
  });
  emit('closeFilter');
};

onClickOutside(categoryRef, () => {
  isCategoryDropdownOpen.value = false;
});

onClickOutside(modalRef, () => {
  emit('closeFilter');
});
</script>

<template>
  <div ref="modalRef" class="filter-container z-20">
    <div class="filter-title">필터</div>

    <!-- 카테고리 -->
    <section class="filter-section pt-5">
      <p class="filter-label">카테고리</p>
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
    <!-- 상태 -->
    <section class="filter-section">
      <p class="filter-label">상태</p>
      <div class="flex gap-2">
        <StatusBadge
          v-for="sta in status"
          :key="sta.id"
          :status="sta.label"
          size="lg"
          class="cursor-pointer"
          :class="selectedStatuses.includes(sta.label) ? 'opacity-100' : 'opacity-30 hover:opacity-50'"
          @click="toggleStatus(sta.label)"
        />
      </div>
    </section>

    <!-- 초기화 저장 버튼 -->
    <section class="flex justify-center w-full gap-4 pt-2">
      <button @click="handleReset" class="btn-cancel">초기화</button>
      <button @click="handleSave" class="btn-main">저장</button>
    </section>
  </div>
</template>
