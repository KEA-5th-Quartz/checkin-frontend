<script setup lang="ts">
import { ArrowDownIcon, FilterIcon, SearchIcon } from '@/assets/icons/path';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { PageOption } from '@/types/manager';
import { ref } from 'vue';

const perPageOptions = [
  { id: 1, value: 10, label: '10개' },
  { id: 2, value: 20, label: '20개' },
  { id: 3, value: 50, label: '50개' },
];

const selectedPerPage = ref(perPageOptions[0]);
const isOpen = ref(false);

const selectOption = (option: PageOption) => {
  selectedPerPage.value = option;
  isOpen.value = false;
};
</script>

<template>
  <section class="flex justify-between mx-auto w-[95%] mt-[50px]">
    <!-- 검색 -->
    <div class="manager-search-div">
      <input placeholder="티켓 검색..." class="manager-search-input" />
      <SvgIcon :icon="SearchIcon" />
    </div>

    <!-- 필터 -->
    <div class="flex gap-10">
      <div class="relative mt-1">
        <button @click="isOpen = !isOpen" class="manager-filter-btn">
          <span class="font-medium">{{ selectedPerPage.label }}</span>
          <SvgIcon :icon="ArrowDownIcon" />
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

      <button @click="console.log('필터')" class="text-gray-0 flex items-center gap-2">
        <SvgIcon :icon="FilterIcon" />
        필터
      </button>
    </div>
  </section>
</template>
