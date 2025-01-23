<template>
  <div class="flex justify-between">
    <!-- 1차 카테고리 -->
    <div class="w-[48%]">
      <h3 class="text-lg font-bold mb-4">1차 카테고리</h3>
      <ul class="space-y-2">
        <li
          v-for="category in primaryCategories"
          :key="category.id"
          class="flex justify-between items-center p-3 border rounded-md cursor-pointer hover:bg-gray-3"
          @click="selectPrimaryCategory(category)"
        >
          <span>{{ category.name }}</span>
          <CategoryDropdown />
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
          class="flex justify-between items-center p-3 border rounded-md cursor-pointer hover:bg-gray-3"
        >
          <span>{{ category.name }}</span>
          <CategoryDropdown />
        </li>
      </ul>
      <p v-else class="text-gray-0">해당 2차 카테고리가 없습니다.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { primaryCategories, SecondaryCategories } from '../CategoryTest';
import CategoryDropdown from './CategoryDropdown.vue';

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

// 수정 이벤트 핸들러
function handleEdit(category) {
  console.log('수정할 카테고리:', category);
}

// 삭제 이벤트 핸들러
function handleDelete(category) {
  console.log('삭제할 카테고리:', category);
}
</script>
