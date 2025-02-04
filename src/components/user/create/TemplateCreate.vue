<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import { templateValidationSchema } from '@/utils/formValidation'; // 유효성 검증 스키마 가져오기
import { BaseTicketOption } from '@/types/tickets';
import CustomDropdown from '@/components/common/CustomDropdown.vue';
import { computed, ref, nextTick, watch } from 'vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { ClipIcon, TemplateIcon } from '@/assets/icons/path';
import CommonDialog from '@/components/common/CommonDialog.vue';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { categoryApi } from '@/services/categoryService/categoryService';
import { useRouter } from 'vue-router';
import { useCustomMutation } from '@/composables/useCustomMutation';
import { templateApi } from '@/services/templateService/templateService';

const showDialog = ref(false);
const router = useRouter();

const initialValues = {
  title: '',
  content: '',
  firstCategory: '',
  secondCategory: '',
};

// Vee-validate의 useForm으로 폼 초기화 및 유효성 검증 스키마 적용
const { handleSubmit, errors } = useForm({
  initialValues,
  validationSchema: templateValidationSchema,
  validateOnMount: true,
  validateOnChange: true,
});

// 각 필드에 대한 useField 적용
const { value: title, handleChange: titleChange } = useField('title');
const { value: content, handleChange: contentChange } = useField('content');
const { handleChange: firstCategoryChange } = useField('firstCategory');
const { handleChange: secondCategoryChange } = useField('secondCategory');
const firstCategorySelected = ref();
const secondCategorySelected = ref();

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
        // vee-validate 값도 업데이트
        firstCategoryChange(firstCategory.firstCategoryName);

        // 선택된 1차 카테고리의 첫 번째 2차 카테고리 설정
        const secondCategory = firstCategory.secondCategories[0];
        if (secondCategory) {
          secondCategorySelected.value = {
            id: secondCategory.secondCategoryId,
            value: secondCategory.name,
            label: secondCategory.name,
          };
          // vee-validate 값도 업데이트
          secondCategoryChange(secondCategory.name);
        }
      }
    }
  },
  { immediate: true },
);

const handleFirstCategorySelect = async (option: BaseTicketOption) => {
  try {
    firstCategorySelected.value = option;
    firstCategoryChange(option.label); // vee-validate 값 업데이트

    const selectedFirstCategory = categoryData.value?.data?.data.find(
      (category: { firstCategoryId: number }) => category.firstCategoryId === option.id,
    );

    if (selectedFirstCategory?.secondCategories?.length > 0) {
      const firstSecondCategoryOption = {
        id: selectedFirstCategory.secondCategories[0].secondCategoryId,
        value: selectedFirstCategory.secondCategories[0].name,
        label: selectedFirstCategory.secondCategories[0].name,
      };
      secondCategorySelected.value = firstSecondCategoryOption;
      secondCategoryChange(firstSecondCategoryOption.label); // vee-validate 값 업데이트
    }
  } catch (err) {
    console.error('1차 카테고리 변경 실패:', err);
  }
};

const handleSecondCategorySelect = async (option: BaseTicketOption) => {
  try {
    secondCategorySelected.value = option;
    secondCategoryChange(option.label); // vee-validate 값 업데이트
  } catch (err) {
    console.error('2차 카테고리 변경 실패:', err);
  }
};

// mutation 추가
const createTemplateMutation = useCustomMutation(
  (data: { title: string; firstCategory: string; secondCategory: string; content: string; attachmentIds: number[] }) =>
    templateApi.postTemplates(data),
  {
    onSuccess: () => {
      showDialog.value = true;
    },
  },
);

// onSubmit 함수 수정
const onSubmit = handleSubmit(async (formValues, { setErrors }) => {
  try {
    // 카테고리가 선택되지 않았을 경우 첫 번째 값을 사용
    if (!firstCategorySelected.value && categoryData.value?.data?.data?.length > 0) {
      const firstCategory = categoryData?.value.data.data[0];
      firstCategorySelected.value = {
        id: firstCategory.firstCategoryId,
        value: firstCategory.firstCategoryName,
        label: firstCategory.firstCategoryName,
      };
    }

    if (!secondCategorySelected.value && categoryData.value?.data?.data?.[0]?.secondCategories?.length > 0) {
      const secondCategory = categoryData?.value.data.data[0].secondCategories[0];
      secondCategorySelected.value = {
        id: secondCategory.secondCategoryId,
        value: secondCategory.name,
        label: secondCategory.name,
      };
    }

    // 여전히 카테고리가 없다면 에러 처리
    if (!firstCategorySelected.value || !secondCategorySelected.value) {
      setErrors({
        firstCategory: '카테고리 데이터를 찾을 수 없습니다',
        secondCategory: '카테고리 데이터를 찾을 수 없습니다',
      });
      return;
    }

    const templateData = {
      title: formValues.title,
      firstCategory: firstCategorySelected.value.label,
      secondCategory: secondCategorySelected.value.label,
      content: formValues.content,
      attachmentIds: [],
    };

    await createTemplateMutation.mutateAsync(templateData);
  } catch (error) {
    console.error('템플릿 생성 중 오류 발생:', error);
  }
});

const closeDialog = async () => {
  showDialog.value = false;
  await nextTick();

  router.push('/user/templatelist');
};
</script>

<template>
  <section class="ml-24 max-w-[80%] pb-20">
    <form @submit.prevent="onSubmit">
      <section class="w-full h-12 mt-24">
        <label class="ticket-label">템플릿 제목</label>
        <input
          :value="title"
          @input="titleChange"
          name="title"
          class="title-form bg-[#fafafa]"
          placeholder="제목을 입력하세요"
        />
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
            @select="handleFirstCategorySelect"
            isEdit
          />
          <!-- <div class="text-red-500 text-sm mt-1" v-if="errors.firstCategory">{{ errors.firstCategorySelected }}</div> -->
        </div>

        <div class="max-w-[50%] w-full">
          <label class="ticket-label">2차 카테고리</label>
          <CustomDropdown
            class="h-12 py-1"
            label=""
            :options="secondCategoryOptions"
            :selected-option="secondCategorySelected"
            @select="handleSecondCategorySelect"
            isEdit
          />
          <!-- <div class="text-red-500 text-sm mt-1" v-if="errors.secondCategory">{{ errors.secondCategorySelected }}</div> -->
        </div>
      </section>

      <section class="w-full mt-24">
        <label class="ticket-label">설명</label>
        <textarea
          :value="content"
          @input="contentChange"
          name="content"
          class="ticket-desc-textarea min-h-80 bg-[#fafafa]"
        />
        <div class="text-red-500 text-sm mt-1" v-if="errors.content">{{ errors.content }}</div>
        <div class="flex justify-end pr-2 cursor-pointer">
          <SvgIcon :icon="ClipIcon" />
        </div>
      </section>

      <button class="create-button justify-self-center" type="submit">
        <SvgIcon :icon="TemplateIcon" />템플릿 생성
      </button>
    </form>
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
  </section>
</template>
