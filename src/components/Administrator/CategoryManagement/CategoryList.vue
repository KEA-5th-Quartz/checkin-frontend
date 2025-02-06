<template>
  <div class="flex justify-between">
    <!-- 1차 카테고리 -->
    <div class="category-container">
      <h3 class="category-header">1차 카테고리</h3>
      <div class="category-divider"></div>
      <CategoryAddButton buttonText="+ 1차 카테고리 추가하기" @addCategory="handleAddPrimaryCategory" />
      <p v-if="isLoading" class="category-list-empty">로딩 중...</p>
      <p v-else-if="isError" class="category-list-empty">카테고리 데이터를 불러오는 중 오류 발생</p>
      <ul v-else-if="primaryCategories.length > 0" class="category-list">
        <li
          v-for="category in primaryCategories"
          :key="category.firstCategoryId"
          class="category-list-item"
          :class="{ 'bg-blue-4 text-primary-3': selectedPrimaryCategory?.firstCategoryId === category.firstCategoryId }"
          @click="selectPrimaryCategory(category)"
        >
          <span>{{ category.firstCategoryName }}</span>
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
        <li v-for="category in filteredSecondaryCategories" :key="category.secondCategoryId" class="category-list-item">
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
      :isOpen="!!selectedCategory"
      :category="selectedCategory"
      @close="closeEditModal"
      @updateCategories="refreshCategories"
      @showDialog="openDialog"
    />
    <AddCategoryModal
      :isOpen="isAddModalOpen"
      :parentCategory="selectedPrimaryCategory"
      :modalTitle="addModalTitle"
      @close="closeAddModal"
      @updateCategories="refreshCategories"
      @showDialog="openDialog"
    />
    <CommonDialog
      v-if="isDialogOpen"
      :title="dialogContent.title"
      :content="dialogContent.content"
      :mainText="dialogContent.mainText"
      :onMainClick="closeDialog"
      isOneBtn
    />
    <CommonDialog
      v-if="isRemoveCategoryModalOpen"
      :title="'카테고리 삭제'"
      :content="`'${
        selectedCategoryForDelete
          ? 'firstCategoryId' in selectedCategoryForDelete
            ? selectedCategoryForDelete.firstCategoryName
            : selectedCategoryForDelete.name
          : '선택된 카테고리'
      }' 카테고리를 삭제하겠습니까?`"
      :isWarn="true"
      :mainText="'삭제'"
      :onMainClick="RemoveCategory"
      :cancelText="'취소'"
      :onCancelClick="closeRemoveCategoryModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { useCustomMutation } from '@/composables/useCustomMutation';
import { categoryApi } from '@/services/categoryService/categoryService';
import { FirstCategory, SecondCategory } from '@/types/category';
import CategoryDropdown from './CategoryDropdown.vue';
import EditCategoryModal from './EditCategoryModal.vue';
import CategoryAddButton from './CategoryAddButton.vue';
import AddCategoryModal from './AddCategoryModal.vue';
import { useQueryClient } from '@tanstack/vue-query';
import { isApiError } from '@/types/common/error';
import CommonDialog from '@/components/common/CommonDialog.vue';

// 카테고리 데이터 불러오기
const {
  data: categoryData,
  isLoading,
  isError,
} = useCustomQuery(['category-list'], async () => {
  try {
    const response = await categoryApi.getCategories();
    return response.data;
  } catch (err) {
    console.error('카테고리 목록 조회 실패:', err);
    throw err;
  }
});

const queryClient = useQueryClient();

function refreshCategories() {
  queryClient.refetchQueries({ queryKey: ['category-list'] });
}

// 1차 카테고리 리스트
const primaryCategories = computed(() => categoryData.value?.data ?? []);

// 선택된 카테고리 상태
const selectedPrimaryCategory = ref<FirstCategory | null>(null);
const selectedCategory = ref<FirstCategory | SecondCategory | null>(null);

// 1차 카테고리 선택 핸들러
function selectPrimaryCategory(category: FirstCategory) {
  selectedPrimaryCategory.value = category;
}

// 2차 카테고리 필터링
const filteredSecondaryCategories = computed(() => {
  const selected = primaryCategories.value.find(
    (category: FirstCategory) => category.firstCategoryId === selectedPrimaryCategory.value?.firstCategoryId,
  );
  return selected ? selected.secondCategories : [];
});

// 수정 모달 열기
function handleEditPrimaryCategory(category: FirstCategory) {
  if (isRemoveCategoryModalOpen.value) return;
  selectedCategory.value = category;
}

function handleEditSecondaryCategory(category: SecondCategory) {
  if (isRemoveCategoryModalOpen.value) return;
  selectedCategory.value = category;
}

// 수정 모달 닫기
function closeEditModal() {
  selectedCategory.value = null;
}

// 다이얼 로그 상태
const isDialogOpen = ref(false);
const dialogContent = ref({ title: '', content: '', mainText: '확인' });

// 다이얼로그 표시 함수
function openDialog(dialogData: { title: string; content: string; mainText: string }) {
  dialogContent.value = dialogData;
  isDialogOpen.value = true;
}

// 다이얼 닫기
function closeDialog() {
  isDialogOpen.value = false;
}

// AddCategoryModal 관련 상태
const isAddModalOpen = ref(false);
const addModalTitle = ref('');

// 1차 카테고리 생성 모달 열기
function handleAddPrimaryCategory() {
  addModalTitle.value = '1차 카테고리 추가';
  selectedPrimaryCategory.value = null;
  isAddModalOpen.value = true;
}

function handleAddSecondaryCategory() {
  if (!selectedPrimaryCategory.value) {
    openDialog({
      title: '2차 카테고리 생성',
      content: '1차 카테고리를 선택해주세요.',
      mainText: '확인',
    });
    return;
  }
  addModalTitle.value = '2차 카테고리 추가';
  isAddModalOpen.value = true;
}
// 카테고리 생성 모달 닫기
function closeAddModal() {
  isAddModalOpen.value = false;
}

// 삭제 전용 상태
const selectedCategoryForDelete = ref<FirstCategory | SecondCategory | null>(null);

// 카테고리 삭제 다이얼 상태
const isRemoveCategoryModalOpen = ref(false);

function closeRemoveCategoryModal() {
  isRemoveCategoryModalOpen.value = false;
  selectedCategoryForDelete.value = null;
}

// 1차 카테고리 삭제 여부
const isPrimaryDelete = ref(false);

// 카테고리 삭제 mutation
const { mutate: removeCategory } = useCustomMutation(
  async (category: FirstCategory | SecondCategory) => {
    if (!category) throw new Error('삭제할 카테고리가 선택되지 않았습니다.');

    // 1차 카테고리 삭제
    if ('firstCategoryId' in category) {
      return await categoryApi.deleteFirstCategory(category.firstCategoryId);
    }

    // 2차 카테고리 삭제
    if ('secondCategoryId' in category && selectedPrimaryCategory.value) {
      return await categoryApi.deleteSecondCategory(
        selectedPrimaryCategory.value.firstCategoryId,
        category.secondCategoryId,
      );
    }

    throw new Error('잘못된 카테고리 타입');
  },
  {
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['category-list'] });
      isRemoveCategoryModalOpen.value = false;
      selectedCategoryForDelete.value = null;
      dialogContent.value = {
        title: '카테고리 삭제',
        content: '카테고리가 삭제되었습니다.',
        mainText: '확인',
      };
      isDialogOpen.value = true;
    },
    onError: (error: unknown) => {
      console.error('카테고리 삭제 실패:', error);
      if (isApiError(error) && error.code === 'CATEGORY_4092') {
        dialogContent.value = {
          title: '삭제 불가',
          content: '1차 카테고리에 속한 2차 카테고리가 있어 삭제할 수 없습니다.',
          mainText: '확인',
        };
        isDialogOpen.value = true;
        closeRemoveCategoryModal();
      }
    },
  },
);

// 1차 카테고리 삭제 핸들러
function handleDeletePrimaryCategory(category: FirstCategory) {
  if (isRemoveCategoryModalOpen.value) return;
  selectedCategoryForDelete.value = category;
  isPrimaryDelete.value = true;
  isRemoveCategoryModalOpen.value = true;
}
// 2차 카테고리 삭제 핸들러
function handleDeleteSecondaryCategory(category: SecondCategory) {
  if (isRemoveCategoryModalOpen.value) return;
  selectedCategoryForDelete.value = category;
  isPrimaryDelete.value = false;
  isRemoveCategoryModalOpen.value = true;
}

function RemoveCategory() {
  if (!selectedCategoryForDelete.value) return;
  removeCategory(selectedCategoryForDelete.value);
}
</script>
