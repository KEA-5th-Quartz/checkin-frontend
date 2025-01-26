<template>
  <div class="flex justify-between">
    <!-- 1차 카테고리 -->
    <div class="category-container">
      <h3 class="category-header">1차 카테고리</h3>
      <div class="category-divider"></div>
      <CategoryAddButton buttonText="+ 1차 카테고리 추가하기" @addCategory="handleAddPrimaryCategory" />
      <ul v-if="primaryCategories.length > 0" class="category-list">
        <li
          v-for="category in primaryCategories"
          :key="category.id"
          class="category-list-item"
          :class="{ 'bg-blue-4 text-primary-3': selectedPrimaryCategory?.id === category.id }"
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
      <div v-else class="category-list-empty">
        <p>해당 1차 카테고리가 없습니다.</p>
      </div>
    </div>

    <!-- 구분 선 -->
    <div class="border-r border-gray-2 mx-4"></div>

    <!-- 2차 카테고리 -->
    <div class="category-container">
      <h3 class="category-header">2차 카테고리</h3>
      <div class="category-divider"></div>
      <CategoryAddButton buttonText="+ 2차 카테고리 추가하기" @addCategory="handleAddSecondaryCategory" />
      <ul v-if="filteredSecondaryCategories.length > 0" class="category-list">
        <li v-for="category in filteredSecondaryCategories" :key="category.id" class="category-list-item">
          <span>{{ category.name }}</span>
          <CategoryDropdown
            :category="category"
            @edit="handleEditSecondaryCategory"
            @delete="handleDeleteSecondaryCategory"
          />
        </li>
      </ul>
      <div v-else class="category-list-empty">
        <p>해당 2차 카테고리가 없습니다.</p>
      </div>
    </div>
    <EditCategoryModal
      :isOpen="isEditModalOpen"
      :category="selectedCategory"
      @close="closeEditModal"
      @submit="submitEditCategory"
    />
    <AddCategoryModal
      :isOpen="isAddModalOpen"
      :parentCategory="modalParentCategory"
      :modalTitle="modalTitle"
      @close="closeAddModal"
      @submit="submitAddCategory"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { primaryCategories, SecondaryCategories } from '../CategoryTest';
import CategoryDropdown from './CategoryDropdown.vue';
import EditCategoryModal from './EditCategoryModal.vue';
import CategoryAddButton from './CategoryAddButton.vue';
import AddCategoryModal from './AddCategoryModal.vue';

// 선택된 1차 카테고리 상태
const selectedPrimaryCategory = ref(null);
const isEditModalOpen = ref(false);
const selectedCategory = ref(null);

// AddCategoryModal 관련 상태
const isAddModalOpen = ref(false);
const modalParentCategory = ref(null);
const modalTitle = ref('');

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

function handleAddPrimaryCategory() {
  modalTitle.value = '1차 카테고리 추가';
  modalParentCategory.value = null;
  isAddModalOpen.value = true;
}

function handleAddSecondaryCategory() {
  if (!selectedPrimaryCategory.value) {
    //공용 다이얼로그 추가
    alert('1차 카테고리를 먼저 선택해주세요.');
    return;
  }
  modalTitle.value = '2차 카테고리 추가';
  modalParentCategory.value = selectedPrimaryCategory.value;
  isAddModalOpen.value = true;
}

function closeAddModal() {
  isAddModalOpen.value = false;
}

function submitAddCategory(newCategory) {
  if (newCategory.parentId) {
    console.log('새로운 2차 카테고리:', newCategory);
  } else {
    console.log('새로운 1차 카테고리:', newCategory);
  }
  closeAddModal();
}

function handleDeleteSecondaryCategory(category) {
  console.log('2차 카테고리 삭제:', category);
}
</script>
