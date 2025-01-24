<script setup lang="ts">
import { ArrowDownIcon } from '@/assets/icons/path';
import StatusBadge from '@/components/common/Badges/StatusBadge.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { onClickOutside } from '@vueuse/core';
import { ref } from 'vue';
import { firstCategory, managerOptions, status } from '../manager/ticketOptionTest';

const emit = defineEmits(['closeFilter']);
const modalRef = ref<HTMLElement | null>(null);

// 필터 선택 상태 관리
const selectedManagers = ref<string[]>([]);
const selectedStatuses = ref<string[]>([]);
const selectedCategories = ref<string[]>([]);

// 드롭다운 상태 관리
const isManagerDropdownOpen = ref(false);
const isCategoryDropdownOpen = ref(false);

// 필터 토글 함수들

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

// 저장 버튼 클릭 핸들러
const handleSave = () => {
  console.log('담당자', selectedManagers.value);
  console.log('상태:', selectedStatuses.value);
  console.log('카테고리:', selectedCategories.value);
};

onClickOutside(modalRef, () => {
  emit('closeFilter');
});
</script>

<template>
  <div
    ref="modalRef"
    class="bg-white-0 rounded-lg w-[300px] max-h-[600px] overflow-y-auto shadow-md pb-4 hide-scrollbar z-20"
  >
    <div class="py-3 px-8 bg-primary-0 text-white-1 font-bold">필터</div>
    <!-- 담당자 -->
    <section class="flex flex-col px-7 py-5">
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
            :class="[
              selectedManagers.includes(manager.value) ? 'bg-gray-3 text-gray-0 hover:font-semibold' : 'text-gray-2',
            ]"
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
            :class="[
              selectedCategories.includes(category.value) ? 'bg-gray-3 text-gray-0 hover:font-semibold' : 'text-gray-2',
            ]"
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
          :class="[selectedStatuses.includes(sta.id as unknown as string) ? 'opacity-100':'opacity-30 hover:opacity-50']"
          @click="toggleStatus(sta.id as unknown as string)"
        />
      </div>
    </section>

    <!-- 취소 저장 버튼 -->
    <section class="flex justify-center w-full gap-4 pt-7">
      <button
        @click="emit('closeFilter')"
        class="px-6 py-1 text-sm border border-gray-1 rounded-lg hover:bg-gray-100 whitespace-nowrap"
      >
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
