<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import { templateValidationSchema } from '@/utils/formValidation';
import { BaseTicketOption } from '@/types/tickets';
import CustomDropdown from '@/components/common/CustomDropdown.vue';
import { computed, ref, watch } from 'vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { ClipIcon, TemplateIcon } from '@/assets/icons/path';
import CommonDialog from '@/components/common/CommonDialog.vue';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { categoryApi } from '@/services/categoryService/categoryService';
import { useRouter } from 'vue-router';
import { useCustomMutation } from '@/composables/useCustomMutation';
import { templateApi } from '@/services/templateService/templateService';
import { useQueryClient } from '@tanstack/vue-query';
import { CategoryResponse } from '@/types/template';

const showDialog = ref(false);
const router = useRouter();
const queryClient = useQueryClient();

const initialValues = {
  title: '',
  content: '',
  firstCategory: '',
  secondCategory: '',
};

const { handleSubmit, errors } = useForm({
  initialValues,
  validationSchema: templateValidationSchema,
  validateOnMount: true,
});

const { value: content, handleChange: contentChange } = useField<string>('content');
const { value: title, handleChange: titleChange } = useField<string>('title');

const { handleChange: firstCategoryChange } = useField('firstCategory');
const { handleChange: secondCategoryChange } = useField('secondCategory');
const firstCategorySelected = ref<BaseTicketOption>();
const secondCategorySelected = ref<BaseTicketOption>();

const { data: categoryData } = useCustomQuery<CategoryResponse>(['category-list'], async () => {
  try {
    const response = await categoryApi.getCategories();
    return response;
  } catch (err) {
    console.error('카테고리 목록 조회 실패:', err);
    throw err;
  }
});

const firstCategoryOptions = computed(() => {
  const data = categoryData.value?.data?.data;
  if (!data) return [];

  return data.map((category: { firstCategoryId: number; firstCategoryName: string }) => ({
    id: category.firstCategoryId,
    value: category.firstCategoryName,
    label: category.firstCategoryName,
  }));
});

const secondCategoryOptions = computed(() => {
  const data = categoryData.value?.data?.data;
  if (!data || !firstCategorySelected.value) return [];

  const selectedFirstCategory = data.find(
    (category: { firstCategoryId: number }) => category.firstCategoryId === firstCategorySelected.value?.id,
  );

  if (!selectedFirstCategory) return [];

  return selectedFirstCategory.secondCategories.map((category: { secondCategoryId: number; name: string }) => ({
    id: category.secondCategoryId,
    value: category.name,
    label: category.name,
  }));
});

watch(
  [categoryData],
  ([newCategoryData]) => {
    const data = newCategoryData?.data?.data;
    if (!data?.length) return;

    const firstCategory = data[0];
    if (firstCategory) {
      firstCategorySelected.value = {
        id: firstCategory.firstCategoryId,
        value: firstCategory.firstCategoryName,
        label: firstCategory.firstCategoryName,
      };
      firstCategoryChange(firstCategory.firstCategoryName);

      const secondCategory = firstCategory.secondCategories[0];
      if (secondCategory) {
        secondCategorySelected.value = {
          id: secondCategory.secondCategoryId,
          value: secondCategory.name,
          label: secondCategory.name,
        };
        secondCategoryChange(secondCategory.name);
      }
    }
  },
  { immediate: true },
);

const handleFirstCategorySelect = async (option: BaseTicketOption) => {
  try {
    firstCategorySelected.value = option;
    firstCategoryChange(option.label);

    const data = categoryData.value?.data?.data;
    if (!data) return;

    const selectedFirstCategory = data.find(
      (category: { firstCategoryId: number }) => category.firstCategoryId === option.id,
    );

    if (selectedFirstCategory && selectedFirstCategory.secondCategories.length > 0) {
      const firstSecondCategory = selectedFirstCategory.secondCategories[0];
      secondCategorySelected.value = {
        id: firstSecondCategory.secondCategoryId,
        value: firstSecondCategory.name,
        label: firstSecondCategory.name,
      };
      secondCategoryChange(firstSecondCategory.name);
    }
  } catch (err) {
    console.error('1차 카테고리 변경 실패:', err);
  }
};

const handleSecondCategorySelect = async (option: BaseTicketOption) => {
  try {
    secondCategorySelected.value = option;
    secondCategoryChange(option.label);
  } catch (err) {
    console.error('2차 카테고리 변경 실패:', err);
  }
};

const createTemplateMutation = useCustomMutation(
  (data: { title: string; firstCategory: string; secondCategory: string; content: string; attachmentIds: number[] }) =>
    templateApi.postTemplates(data),
  {
    onSuccess: () => {
      showDialog.value = true;
      queryClient.refetchQueries(['template-list']);
    },
  },
);

const onSubmit = handleSubmit(async (formValues, { setErrors }) => {
  try {
    const data = categoryData.value?.data?.data;
    if (!firstCategorySelected.value && data?.length) {
      const firstCategory = data[0];
      firstCategorySelected.value = {
        id: firstCategory.firstCategoryId,
        value: firstCategory.firstCategoryName,
        label: firstCategory.firstCategoryName,
      };
    }

    if (!secondCategorySelected.value && data?.[0]?.secondCategories?.length) {
      const secondCategory = data[0].secondCategories[0];
      secondCategorySelected.value = {
        id: secondCategory.secondCategoryId,
        value: secondCategory.name,
        label: secondCategory.name,
      };
    }

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
