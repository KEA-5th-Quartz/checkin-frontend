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
          <CategoryDropdown
            :category="category"
            @edit="handleEditPrimaryCategory"
            @delete="handleDeletePrimaryCategory"
          />
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
          <CategoryDropdown
            :category="category"
            @edit="handleEditSecondaryCategory"
            @delete="handleDeleteSecondaryCategory"
          />
        </li>
      </ul>
      <p v-else class="text-gray-0">해당 2차 카테고리가 없습니다.</p>
    </div>
    <EditCategoryModal
      :isOpen="isEditModalOpen"
      :category="selectedCategory"
      @close="closeEditModal"
      @submit="submitEditCategory"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { primaryCategories, SecondaryCategories } from '../CategoryTest';
import CategoryDropdown from './CategoryDropdown.vue';
import EditCategoryModal from './EditCategoryModal.vue';

// 선택된 1차 카테고리 상태
const selectedPrimaryCategory = ref(null);
const isEditModalOpen = ref(false);
const selectedCategory = ref(null);

// 2차 카테고리 필터링 로직
const filteredSecondaryCategories = computed(() => {
  if (!selectedPrimaryCategory.value) return [];
  return SecondaryCategories.filter((category) => category.parentId === selectedPrimaryCategory.value.id);
});

// 1차 카테고리 선택 핸들러
function selectPrimaryCategory(category) {
  selectedPrimaryCategory.value = category;
}

// 수정 모달 열기
function handleEditPrimaryCategory(category) {
  selectedCategory.value = category;
  isEditModalOpen.value = true;
}

function handleEditSecondaryCategory(category) {
  selectedCategory.value = category;
  isEditModalOpen.value = true;
}

// 수정 모달 닫기
function closeEditModal() {
  isEditModalOpen.value = false;
  selectedCategory.value = null;
}

// 수정 제출
function submitEditCategory(updatedCategory) {
  console.log('수정된 카테고리:', updatedCategory);
  closeEditModal();
}

function handleDeletePrimaryCategory(category) {
  console.log('1차 카테고리 삭제:', category);
}

function handleDeleteSecondaryCategory(category) {
  console.log('2차 카테고리 삭제:', category);
}
</script>
