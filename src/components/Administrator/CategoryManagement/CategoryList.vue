<template>
  <div class="flex justify-between">
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
          <div class="flex gap-4">
            <span class="text-gray-1 min-w-16">[ {{ category.alias }} ] </span>{{ category.firstCategoryName }}
          </div>
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
    <div class="border-r border-gray-2 mx-4"></div>
    <div class="category-container">
      <h3 class="category-header">2차 카테고리</h3>
      <div class="category-divider"></div>
      <CategoryAddButton buttonText="+ 2차 카테고리 추가하기" @addCategory="handleAddSecondaryCategory" />
      <ul v-if="filteredSecondaryCategories.length > 0" class="category-list">
        <li v-for="category in filteredSecondaryCategories" :key="category.secondCategoryId" class="category-list-item">
          <div class="flex gap-4">
            <span class="text-gray-1">[ {{ category.alias }} ] </span>{{ category.name }}
          </div>
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
      :parentCategory="selectedPrimaryCategory"
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
      :onCancelClick="closeDialog"
      isOneBtn
    />
    <CommonDialog
      v-if="isRemoveCategoryModalOpen"
      :title="'카테고리 삭제'"
      :content="`'${
        selectedCategoryForDelete
          ? isFirstCategory(selectedCategoryForDelete)
            ? selectedCategoryForDelete.firstCategoryName
            : isSecondCategory(selectedCategoryForDelete)
            ? selectedCategoryForDelete.name
            : '선택된 카테고리'
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

const primaryCategories = computed(() => categoryData.value?.data ?? []);

const selectedPrimaryCategory = ref<FirstCategory | null>(null);
const selectedCategory = ref<FirstCategory | SecondCategory | null>(null);
function selectPrimaryCategory(category: FirstCategory) {
  selectedPrimaryCategory.value = category;
}

const filteredSecondaryCategories = computed(() => {
  const selected = primaryCategories.value.find(
    (category: FirstCategory) => category.firstCategoryId === selectedPrimaryCategory.value?.firstCategoryId,
  );

  return selected
    ? selected.secondCategories.map((second: SecondCategory) => ({
        ...second,
        alias: second.alias || '',
      }))
    : [];
});

function handleEditPrimaryCategory(category: FirstCategory) {
  if (isRemoveCategoryModalOpen.value) return;
  selectedCategory.value = category;
}

function handleEditSecondaryCategory(category: SecondCategory) {
  if (isRemoveCategoryModalOpen.value) return;
  selectedCategory.value = category;
}

function closeEditModal() {
  selectedCategory.value = null;
}

const isDialogOpen = ref(false);
const dialogContent = ref({ title: '', content: '', mainText: '확인' });
function openDialog(dialogData: { title: string; content: string; mainText: string }) {
  dialogContent.value = dialogData;
  isDialogOpen.value = true;
}

function closeDialog() {
  isDialogOpen.value = false;
}

const isAddModalOpen = ref(false);
const addModalTitle = ref('');

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

function closeAddModal() {
  isAddModalOpen.value = false;
}

const selectedCategoryForDelete = ref<FirstCategory | SecondCategory | null>(null);

const isRemoveCategoryModalOpen = ref(false);

function closeRemoveCategoryModal() {
  isRemoveCategoryModalOpen.value = false;
  selectedCategoryForDelete.value = null;
}

const isPrimaryDelete = ref(false);

function isFirstCategory(category: FirstCategory | SecondCategory): category is FirstCategory {
  return 'firstCategoryId' in category;
}

function isSecondCategory(category: FirstCategory | SecondCategory): category is SecondCategory {
  return 'secondCategoryId' in category;
}

const { mutate: removeCategory } = useCustomMutation(
  async (category: FirstCategory | SecondCategory) => {
    if (!category) throw new Error('삭제할 카테고리가 선택되지 않았습니다.');
    if (isFirstCategory(category)) {
      return await categoryApi.deleteFirstCategory(category.firstCategoryId);
    }
    if (isSecondCategory(category) && selectedPrimaryCategory.value) {
      return await categoryApi.deleteSecondCategory(
        selectedPrimaryCategory.value.firstCategoryId,
        category.secondCategoryId,
      );
    }

    throw new Error('잘못된 카테고리 타입');
  },
  {
    onSuccess: () => {
      refreshCategories();
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
      if (isApiError(error) && error.code === 'CATEGORY_4092') {
        dialogContent.value = {
          title: '삭제 불가',
          content: '1차 카테고리에 속한 2차 카테고리가 있어 삭제할 수 없습니다.',
          mainText: '확인',
        };
        isDialogOpen.value = true;
        closeRemoveCategoryModal();
      } else if (isApiError(error) && error.code === 'CATEGORY_4004') {
        dialogContent.value = {
          title: '삭제 불가',
          content: '카테고리를 사용중인 티켓이 있어 삭제할 수 없습니다.',
          mainText: '확인',
        };
        isDialogOpen.value = true;
        closeRemoveCategoryModal();
      }
    },
  },
);

function handleDeletePrimaryCategory(category: FirstCategory) {
  if (isRemoveCategoryModalOpen.value) return;
  selectedCategoryForDelete.value = category;
  isPrimaryDelete.value = true;
  isRemoveCategoryModalOpen.value = true;
}

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
