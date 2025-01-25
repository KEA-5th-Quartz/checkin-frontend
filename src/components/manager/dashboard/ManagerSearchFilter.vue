<script setup lang="ts">
import { ArrowDownIcon, FilterIcon, SearchIcon } from '../../../assets/icons/path';
import SvgIcon from '../../common/SvgIcon.vue';
import FilterModal from '../dashboard/ManagerFilter.vue';
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { perPageOptions } from '../ticketOptionTest';

const selectedPerPage = ref(perPageOptions[0]);
const isOpen = ref(false);
const isFilterOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

onClickOutside(dropdownRef, () => (isOpen.value = false));

const selectOption = (
  option: { id: number; value: number; label: string } | { id: number; value: number; label: string },
) => {
  selectedPerPage.value = option;
  isOpen.value = false;
};
</script>

<template>
  <section class="flex justify-between mx-auto w-[95%] mt-[50px]">
    <!-- 검색 -->
    <div class="manager-search-div">
      <input placeholder="티켓 검색..." class="manager-search-input" />
      <SvgIcon :icon="SearchIcon" class="cursor-pointer" />
    </div>

    <!-- 필터 -->
    <div class="flex gap-10">
      <div ref="dropdownRef" class="relative mt-1">
        <button @click="isOpen = !isOpen" class="manager-filter-btn">
          <span class="font-medium">{{ selectedPerPage.label }}</span>
          <SvgIcon :icon="ArrowDownIcon" :class="['transition-02s', isOpen ? 'rotate-180' : '']" />
        </button>

        <div v-if="isOpen" class="manager-filter-menu">
          <ul>
            <li
              v-for="option in perPageOptions"
              :key="option.id"
              @click="selectOption(option)"
              class="px-3 py-2 hover:bg-gray-3 cursor-pointer"
            >
              {{ option.label }}
            </li>
          </ul>
        </div>
      </div>

      <!-- 필터링 아이콘 -->
      <div class="relative flex items-center">
        <button @click.stop="isFilterOpen = !isFilterOpen" class="text-gray-0 flex items-center gap-2">
          <SvgIcon :icon="FilterIcon" />
          필터
        </button>
        <!-- 필터 모달 -->
        <FilterModal v-if="isFilterOpen" @closeFilter="isFilterOpen = false" class="absolute top-12 right-0" />
      </div>
    </div>
  </section>
</template>
