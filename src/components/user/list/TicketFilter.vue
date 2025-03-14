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

const selectedStatuses = ref(props.initialStatuses || []);
const selectedCategories = ref(props.initialCategories || []);

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

const isCategoryDropdownOpen = ref(false);

const { data: categoryData } = useCustomQuery(['category-list'], async () => {
  const response = await categoryApi.getCategories();
  return response;
});

const categoryOptions = computed(() => {
  if (!categoryData.value?.data?.data) return [];

  return categoryData.value.data.data.map((category: { firstCategoryId: number; firstCategoryName: string }) => ({
    id: category.firstCategoryId,
    value: category.firstCategoryName,
    label: category.firstCategoryName,
  }));
});

const toggleStatus = (statusValue: string) => {
  if (selectedStatuses.value.includes(statusValue)) {
    selectedStatuses.value = selectedStatuses.value.filter((s) => s !== statusValue);
  } else {
    selectedStatuses.value.push(statusValue);
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

    <section class="flex justify-center w-full gap-4 pt-2">
      <button @click="handleReset" class="btn-cancel">초기화</button>
      <button @click="handleSave" class="btn-main">저장</button>
    </section>
  </div>
</template>
