<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import { validationSchema } from '@/utils/formValidation'; // 유효성 검증 스키마 가져오기
import { firstCategory, secondCategory } from '@/components/manager/ticketOptionTest';
import { BaseTicketOption } from '@/types/tickets';
import CustomDropdown from '@/components/common/CustomDropdown.vue';
import { computed } from 'vue';
import { useTicketStore } from '@/stores/userTicketStore';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { ClipIcon } from '@/assets/icons/path';
import TemplateCreateButton from '@/components/user/create/TemplateCreateButton.vue';

// Vee-validate의 useForm으로 폼 초기화 및 유효성 검증 스키마 적용
const { handleSubmit, errors } = useForm({
  validationSchema,
});

// 각 필드에 대한 useField 적용
const { value: title } = useField<string>('title');
const { value: content } = useField<string>('content');
const { value: firstCategorySelected } = useField<BaseTicketOption>('firstCategory');
const { value: secondCategorySelected } = useField<BaseTicketOption>('secondCategory');

// Vue Store 사용
const ticketStore = useTicketStore();

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

const computedFirstCategory = createComputedProperty(firstCategory, 'firstCategory');
const computedSecondCategory = createComputedProperty(secondCategory, 'secondCategory');

const handleOptionSelect = (field: keyof typeof ticketStore.ticket) => (option: BaseTicketOption) => {
  if (ticketStore.ticket) {
    ticketStore.updateTicket({
      ...ticketStore.ticket,
      [field]: option.label,
    });
  }
};

// 템플릿 생성 버튼 클릭 시 실행될 함수
const onSubmit = handleSubmit(() => {
  alert('템플릿이 정상적으로 생성되었습니다.');
});
</script>

<template>
  <main class="ml-24">
    <form @submit="onSubmit">
      <section class="h-12 mt-24">
        <div class="ticket-label">템플릿 제목</div>
        <input v-model="title" class="title-form bg-[#fafafa]" placeholder="제목을 입력하세요" />
        <div class="text-red-500 text-sm mt-1" v-if="errors.title">{{ errors.title }}</div>
      </section>

      <section class="flex gap-x-48 mt-16">
        <div class="w-[500px]">
          <div class="ticket-label">1차 카테고리</div>
          <CustomDropdown
            class="h-12 py-1"
            label=""
            :options="firstCategory"
            :selected-option="computedFirstCategory"
            :onOptionSelect="handleOptionSelect('firstCategory')"
            @select="(option: BaseTicketOption) => (firstCategorySelected = option)"
            isEdit
          />
          <div class="text-red-500 text-sm mt-1" v-if="errors.firstCategory">{{ errors.firstCategorySelected }}</div>
        </div>

        <div class="w-[500px]">
          <div class="ticket-label">2차 카테고리</div>
          <CustomDropdown
            class="h-12 py-1"
            label=""
            :options="secondCategory"
            :selected-option="computedSecondCategory"
            :onOptionSelect="handleOptionSelect('secondCategory')"
            @select="(option: BaseTicketOption) => (secondCategorySelected = option)"
            isEdit
          />
          <div class="text-red-500 text-sm mt-1" v-if="errors.secondCategory">{{ errors.secondCategorySelected }}</div>
        </div>
      </section>

      <section class="mt-16">
        <div class="ticket-label mt-24">설명</div>
        <textarea v-model="content" class="ticket-desc-textarea min-h-80 w-[1200px] bg-[#fafafa]" />
        <div class="text-red-500 text-sm mt-1" v-if="errors.content">{{ errors.content }}</div>
        <div class="flex w-[1200px] justify-end pr-2 cursor-pointer">
          <SvgIcon :icon="ClipIcon" />
        </div>
      </section>

      <section class="flex justify-center">
        <TemplateCreateButton type="submit" />
      </section>
    </form>
  </main>
</template>
