<template>
  <div class="flex justify-between">
    <!-- 1차 카테고리 -->
    <div class="w-[48%]">
      <h3 class="text-lg font-bold mb-4">1차 카테고리</h3>
      <ul class="space-y-2">
        <li
          v-for="category in primaryCategories"
          :key="category.id"
          @click="selectPrimaryCategory(category)"
          :class="[
            'p-3 border rounded-md cursor-pointer',
            selectedPrimaryCategory?.id === category.id ? 'bg-primary-3 text-white-0' : 'hover:bg-gray-3',
          ]"
        >
          {{ category.name }}
        </li>
      </ul>
    </div>

    <!-- 2차 카테고리 -->
    <div class="w-[48%]">
      <h3 class="text-lg font-bold mb-4">2차 카테고리</h3>
      <ul v-if="filteredSecondaryCategories.length > 0" class="space-y-2">
        <li
          v-for="category in filteredSecondaryCategories"
          :key="category.id"
          class="p-3 border rounded-md cursor-pointer hover:bg-gray-3"
        >
          {{ category.name }}
        </li>
      </ul>
      <p v-else class="text-gray-0">해당 2차 카테고리가 없습니다.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { primaryCategories, SecondaryCategories } from '../CategoryTest';

// 선택된 1차 카테고리 상태
const selectedPrimaryCategory = ref(null);

// 2차 카테고리 필터링 로직
const filteredSecondaryCategories = computed(() => {
  if (!selectedPrimaryCategory.value) return [];
  return SecondaryCategories.filter((category) => category.parentId === selectedPrimaryCategory.value.id);
});

// 1차 카테고리 선택 핸들러
function selectPrimaryCategory(category) {
  selectedPrimaryCategory.value = category;
}
</script>
