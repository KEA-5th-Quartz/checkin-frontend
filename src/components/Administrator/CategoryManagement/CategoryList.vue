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
      :isOpen="isEditModalOpen"
      :category="selectedCategory"
      :errorMessage="errorMessage"
      @close="closeEditModal"
      @submit="submitEditCategory"
    />
    <AddCategoryModal
      :isOpen="isAddModalOpen"
      :parentCategory="modalParentCategory"
      :modalTitle="modalTitle"
      :errorMessage="errorMessage"
      @close="closeAddModal"
      @submit="submitAddCategory"
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
      :content="`'${selectedCategoryName}' 카테고리를 삭제하겠습니까?`"
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

// 에러 메시지 상태
const errorMessage = ref('');

// 1차 카테고리 리스트
const primaryCategories = computed(() => categoryData.value?.data ?? []);

// 선택된 카테고리 상태
const selectedPrimaryCategory = ref<FirstCategory | null>(null);
const isEditModalOpen = ref(false);
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

// AddCategoryModal 관련 상태
const isAddModalOpen = ref(false);
const modalParentCategory = ref<FirstCategory | null>(null);
const modalTitle = ref('');

// 수정 모달 열기
function handleEditPrimaryCategory(category: FirstCategory) {
  selectedCategory.value = category;
  isEditModalOpen.value = true;
}

function handleEditSecondaryCategory(category: SecondCategory) {
  selectedCategory.value = category;
  isEditModalOpen.value = true;
}

// 수정 모달 닫기
function closeEditModal() {
  isEditModalOpen.value = false;
  errorMessage.value = '';
}

// 다이얼 로그 상태
const isDialogOpen = ref(false);
const dialogContent = ref({ title: '', content: '', mainText: '확인' });

// 다이얼 닫기
function closeDialog() {
  isDialogOpen.value = false;
}

// 카테고리 수정 Mutation
const { mutate: editCategory } = useCustomMutation(
  async (updatedCategory: { id: number; name: string; alias?: string; contentGuide?: string }) => {
    if (!selectedCategory.value) {
      throw new Error('수정할 카테고리가 선택되지 않았습니다.');
    }
    // 1차 카테고리 수정
    if ('firstCategoryId' in selectedCategory.value) {
      return await categoryApi.putFirstCategory(updatedCategory.id, {
        name: updatedCategory.name,
        alias: updatedCategory.alias || '',
        contentGuide: updatedCategory.contentGuide || '',
      });
    }
    // 2차 카테고리 수정
    if ('secondCategoryId' in selectedCategory.value && selectedPrimaryCategory.value) {
      return await categoryApi.putSecondCategory(selectedPrimaryCategory.value.firstCategoryId, updatedCategory.id, {
        secondCategory: updatedCategory.name,
      });
    }
  },
  {
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['category-list'] });
      selectedCategory.value = null;
      closeEditModal();

      dialogContent.value = {
        title: '카테고리 수정 완료',
        content: '카테고리가 수정 되었습니다.',
        mainText: '확인',
      };
      isDialogOpen.value = true;
    },
    onError: (error: unknown) => {
      console.error('카테고리 수정 실패:', error);
      if (isApiError(error)) {
        if (error.code === 'CATEGORY_4090') {
          errorMessage.value = '동일한 이름의 카테고리가 존재합니다.';
        } else {
          errorMessage.value = '카테고리 수정 중 오류가 발생했습니다.';
        }
      }
    },
  },
);

// 카테고리 수정 제출
function submitEditCategory(updatedCategory: { id: number; name: string; alias: string; contentGuide?: string }) {
  if (!selectedCategory.value) {
    console.error('선택된 카테고리가 없습니다.');
    return;
  }
  const categoryId =
    'firstCategoryId' in selectedCategory.value
      ? selectedCategory.value.firstCategoryId
      : selectedCategory.value.secondCategoryId;

  editCategory({
    id: categoryId,
    name: updatedCategory.name,
    alias: updatedCategory.alias,
    contentGuide: updatedCategory.contentGuide,
  });
}

// 1차 카테고리 생성 모달 열기
function handleAddPrimaryCategory() {
  modalTitle.value = '1차 카테고리 추가';
  modalParentCategory.value = null;
  isAddModalOpen.value = true;
}

// 2차 카테고리 생성 모달 열기
function handleAddSecondaryCategory() {
  if (!selectedPrimaryCategory.value) {
    dialogContent.value = {
      title: '2차 카테고리 생성',
      content: '1차 카테고리를 선택해주세요.',
      mainText: '확인',
    };
    isDialogOpen.value = true;
    return;
  }

  modalTitle.value = '2차 카테고리 추가';
  modalParentCategory.value = selectedPrimaryCategory.value;
  isAddModalOpen.value = true;
}

// 카테고리 생성 모달 닫기
function closeAddModal() {
  isAddModalOpen.value = false;
  errorMessage.value = '';
}

// 카테고리 생성 Mutation
const { mutate: createFirstCategory } = useCustomMutation(
  async (data: { name: string; alias: string; contentGuide: string }) => {
    return await categoryApi.postFirstCategory(data);
  },
  {
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['category-list'] });
      closeAddModal();

      dialogContent.value = {
        title: '1차 카테고리 추가 완료',
        content: '1차 카테고리가 추가되었습니다.',
        mainText: '확인',
      };
      isDialogOpen.value = true;
    },
    onError: (error: unknown) => {
      console.error('[1차 카테고리 API 요청 실패]', error);
      if (isApiError(error)) {
        if (error.code === 'CATEGORY_4090') {
          errorMessage.value = '동일한 이름의 1차 카테고리가 존재합니다.';
        } else {
          errorMessage.value = '1차 카테고리 생성 중 오류가 발생했습니다.';
        }
      }
    },
  },
);

const { mutate: createSecondCategory } = useCustomMutation(
  async (data: { firstCategoryId: number; name: string }) => {
    return await categoryApi.postSecondCategory(data.firstCategoryId, { name: data.name });
  },
  {
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['category-list'] });
      errorMessage.value = '';
      closeAddModal();

      dialogContent.value = {
        title: '2차 카테고리 추가 완료',
        content: '2차 카테고리가 추가되었습니다.',
        mainText: '확인',
      };
      isDialogOpen.value = true;
    },
    onError: (error: unknown) => {
      console.error('[2차 카테고리 API 요청 실패]', error);
      if (isApiError(error)) {
        if (error.code === 'CATEGORY_4091') {
          errorMessage.value = '동일한 이름의 2차 카테고리가 존재합니다.';
        } else {
          errorMessage.value = '2차 카테고리 생성 중 오류가 발생했습니다.';
        }
      }
    },
  },
);

// 카테고리 추가 제출
function submitAddCategory(newCategory: { name: string; alias?: string; contentGuide?: string; parentId?: number }) {
  if (!newCategory.name.trim()) {
    errorMessage.value = '카테고리 이름을 입력해주세요.';
    return;
  }
  // 1차 카테고리 선택 없이 2차 카테고리 생성 안되도록
  if (newCategory.parentId) {
    if (!selectedPrimaryCategory.value) {
      return;
    }

    createSecondCategory({
      firstCategoryId: selectedPrimaryCategory.value.firstCategoryId,
      name: newCategory.name,
    });

    return;
  }
  createFirstCategory({
    name: newCategory.name,
    alias: newCategory.alias || '',
    contentGuide: newCategory.contentGuide || '',
  });
}

// 카테고리 삭제 다이얼 상태
const isRemoveCategoryModalOpen = ref(false);

const closeRemoveCategoryModal = () => {
  isRemoveCategoryModalOpen.value = false;
};

const selectedCategoryName = computed(() => {
  if (!selectedCategory.value) return '선택된 카테고리';

  if ('firstCategoryName' in selectedCategory.value) {
    return selectedCategory.value.firstCategoryName;
  }

  if ('name' in selectedCategory.value) {
    return selectedCategory.value.name;
  }

  return '이름 없음';
});

// 1차 카테고리 삭제 여부
const isPrimaryDelete = ref(false);

// 카테고리 삭제 mutation
const { mutate: removeCategory } = useCustomMutation(
  async () => {
    if (!selectedCategory.value) throw new Error('삭제할 카테고리가 선택되지 않았습니다.');

    // 1차 카테고리 삭제
    if (isPrimaryDelete.value && 'firstCategoryId' in selectedCategory.value) {
      return await categoryApi.deleteFirstCategory(selectedCategory.value.firstCategoryId);
    }

    // 2차 카테고리 삭제
    if ('secondCategoryId' in selectedCategory.value && selectedPrimaryCategory.value) {
      return await categoryApi.deleteSecondCategory(
        selectedPrimaryCategory.value.firstCategoryId,
        selectedCategory.value.secondCategoryId,
      );
    }

    throw new Error('잘못된 카테고리 타입');
  },
  {
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['category-list'] });
      isRemoveCategoryModalOpen.value = false;
      selectedCategory.value = null;
      dialogContent.value = {
        title: '카테고리 삭제',
        content: '카테고리가 삭제 되었습니다.',
        mainText: '확인',
      };
      isDialogOpen.value = true;
    },
    onError: (error: unknown) => {
      console.error('카테고리 삭제 실패: ', error);
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
  selectedCategory.value = category;
  isPrimaryDelete.value = true;
  isRemoveCategoryModalOpen.value = true;
}
// 2차 카테고리 삭제 핸들러
function handleDeleteSecondaryCategory(category: SecondCategory) {
  selectedCategory.value = category;
  isPrimaryDelete.value = false;
  isRemoveCategoryModalOpen.value = true;
}

function RemoveCategory() {
  if (!selectedCategory.value) return;
  removeCategory();
}
</script>
