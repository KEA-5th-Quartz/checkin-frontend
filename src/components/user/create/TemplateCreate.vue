<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import { validationSchema } from '@/utils/formValidation'; // 유효성 검증 스키마 가져오기
import { BaseTicketOption } from '@/types/tickets';
import CustomDropdown from '@/components/common/CustomDropdown.vue';
import { computed, ref, nextTick, watch } from 'vue';
import { useTicketStore } from '@/stores/userTicketStore';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { ClipIcon } from '@/assets/icons/path';
import TemplateCreateButton from '@/components/user/create/TemplateCreateButton.vue';
import CommonDialog from '@/components/common/CommonDialog.vue';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { categoryApi } from '@/services/categoryService/categoryService';

const showDialog = ref(false);

// Vee-validate의 useForm으로 폼 초기화 및 유효성 검증 스키마 적용
const { handleSubmit, errors } = useForm({
  validationSchema,
});

// 각 필드에 대한 useField 적용
const { value: title } = useField<string>('title');
const { value: content } = useField<string>('content');
const firstCategorySelected = ref();
const secondCategorySelected = ref();

// Vue Store 사용
const ticketStore = useTicketStore();

// 카테고리 목록 페치
const { data: categoryData } = useCustomQuery(['category-list'], async () => {
  try {
    const response = await categoryApi.getCategories();
    return response;
  } catch (err) {
    console.error('카테고리 목록 조회 실패:', err);
    throw err;
  }
});

// 1차 카테고리 옵션 동적 생성
const firstCategoryOptions = computed(() => {
  if (!categoryData.value?.data?.data) return [];
  // categoryData에서 1차 카테고리 목록을 변환하여 반환
  return categoryData.value.data.data.map((category: { firstCategoryId: number; firstCategoryName: string }) => ({
    id: category.firstCategoryId, // 드롭다운에서 사용할 고유 ID, 값, 이름
    value: category.firstCategoryName,
    label: category.firstCategoryName,
  }));
});
// 2차 카테고리 옵션 동적 생성
const secondCategoryOptions = computed(() => {
  if (!categoryData.value?.data?.data || !firstCategorySelected.value) return [];
  // 선택된 1차 카테고리에 해당하는 카테고리 객체를 찾음
  const selectedFirstCategory = categoryData.value.data.data.find(
    // 현재 선택된 1차 카테고리의 ID와 일치하는 카테고리를 찾음
    (category: { firstCategoryId: number }) => category.firstCategoryId === firstCategorySelected.value.id,
  );

  // 선택된 1차 카테고리의 2차 카테고리 목록을 변환하여 반환
  return (
    selectedFirstCategory?.secondCategories.map((category: { secondCategoryId: number; name: string }) => ({
      id: category.secondCategoryId,
      value: category.name,
      label: category.name,
    })) || []
  );
});

// API 데이터로 초기값 설정
watch(
  [categoryData],
  ([newCategoryData]) => {
    if (newCategoryData?.data?.data) {
      // 첫 번째 카테고리와 그에 해당하는 두 번째 카테고리를 기본값으로 설정
      const firstCategory = newCategoryData.data.data[0];

      if (firstCategory) {
        // 1차 카테고리 설정
        firstCategorySelected.value = {
          id: firstCategory.firstCategoryId,
          value: firstCategory.firstCategoryName,
          label: firstCategory.firstCategoryName,
        };

        // 선택된 1차 카테고리의 첫 번째 2차 카테고리 설정
        const secondCategory = firstCategory.secondCategories[0];
        if (secondCategory) {
          secondCategorySelected.value = {
            id: secondCategory.secondCategoryId,
            value: secondCategory.name,
            label: secondCategory.name,
          };
        }
      }
    }
  },
  { immediate: true },
);
// 카테고리 선택 로직
const createComputedProperty = (options: BaseTicketOption[], field: keyof typeof ticketStore.ticket) => {
  return computed({
    get: () => options.find((option) => option.label === ticketStore.ticket?.[field]) || options[0],
    set: (newValue: BaseTicketOption) => {
      if (ticketStore.ticket) {
        ticketStore.updateTicket({
          ...ticketStore.ticket,
          [field]: newValue.label,
        });
      }
    },
  });
};

const handleOptionSelect = (field: keyof typeof ticketStore.ticket) => (option: BaseTicketOption) => {
  if (ticketStore.ticket) {
    ticketStore.updateTicket({
      ...ticketStore.ticket,
      [field]: option.label,
    });
  }
};

// 1차 카테고리 변경
const handleFirstCategorySelect = async (option: BaseTicketOption) => {
  try {
    firstCategorySelected.value = option;

    // 선택된 1차 카테고리에 해당하는 2차 카테고리들 찾기
    const selectedFirstCategory = categoryData.value?.data?.data.find(
      (category: { firstCategoryId: number }) => category.firstCategoryId === option.id,
    );

    // 2. 2차 카테고리를 첫 번째 요소로 설정
    if (selectedFirstCategory?.secondCategories?.length > 0) {
      const firstSecondCategoryOption = {
        id: selectedFirstCategory.secondCategories[0].secondCategoryId,
        value: selectedFirstCategory.secondCategories[0].name,
        label: selectedFirstCategory.secondCategories[0].name,
      };
      secondCategorySelected.value = firstSecondCategoryOption;
    }
  } catch (err) {
    console.error('1차 카테고리 변경 실패:', err);
  }
};
// 2차 카테고리 변경
const handleSecondCategorySelect = async (option: BaseTicketOption) => {
  try {
    secondCategorySelected.value = option;
  } catch (err) {
    console.error('2차 카테고리 변경 실패:', err);
  }
};

// 템플릿 생성 버튼 클릭 시 실행될 함수
const onSubmit = handleSubmit(() => {
  showDialog.value = true; // 다이얼로그 표시
});

// Dialog 안닫히는 문제해결용 함수
const closeDialog = async () => {
  showDialog.value = false;
  await nextTick(); // Vue의 상태 업데이트 보장
};
</script>

<template>
  <main class="ml-24 max-w-[80%] pb-20">
    <form @submit.prevent="onSubmit">
      <section class="w-full h-12 mt-24">
        <label class="ticket-label">템플릿 제목</label>
        <input v-model="title" class="title-form bg-[#fafafa]" placeholder="제목을 입력하세요" />
        <div class="text-red-500 text-sm mt-1" v-if="errors.title">{{ errors.title }}</div>
      </section>

      <section class="w-full flex gap-x-32 mt-16">
        <div class="max-w-[50%] w-full">
          <label class="ticket-label">1차 카테고리</label>
          <CustomDropdown
            class="h-12 py-1"
            label=""
            :options="firstCategoryOptions"
            :selected-option="firstCategorySelected"
            :onOptionSelect="handleOptionSelect('firstCategory')"
            @select="handleFirstCategorySelect"
            isEdit
          />
          <div class="text-red-500 text-sm mt-1" v-if="errors.firstCategory">{{ errors.firstCategorySelected }}</div>
        </div>

        <div class="max-w-[50%] w-full">
          <label class="ticket-label">2차 카테고리</label>
          <CustomDropdown
            class="h-12 py-1"
            label=""
            :options="secondCategoryOptions"
            :selected-option="secondCategorySelected"
            :onOptionSelect="handleOptionSelect('secondCategory')"
            @select="handleSecondCategorySelect"
            isEdit
          />
          <div class="text-red-500 text-sm mt-1" v-if="errors.secondCategory">{{ errors.secondCategorySelected }}</div>
        </div>
      </section>

      <section class="w-full mt-24">
        <label class="ticket-label">설명</label>
        <textarea v-model="content" class="ticket-desc-textarea min-h-80 bg-[#fafafa]" />
        <div class="text-red-500 text-sm mt-1" v-if="errors.content">{{ errors.content }}</div>
        <div class="flex justify-end pr-2 cursor-pointer">
          <SvgIcon :icon="ClipIcon" />
        </div>
      </section>
      <section class="flex justify-center">
        <TemplateCreateButton type="onSubmit" />
      </section>
      <CommonDialog
        v-if="showDialog"
        title="템플릿 생성 완료"
        content="템플릿이 생성되었습니다."
        :isOneBtn="true"
        mainText="확인"
        :onMainClick="
          () => {
            closeDialog();
          }
        "
      />
    </form>
  </main>
</template>
