<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import { validationSchema } from '@/utils/formValidation'; // 유효성 검증 스키마 가져오기
import { firstCategory, secondCategory } from '@/components/manager/ticketOptionTest';
import { BaseTicketOption } from '@/types/tickets';
import CustomDropdown from '@/components/common/CustomDropdown.vue';
import { computed, ref, nextTick } from 'vue';
import { useTicketStore } from '@/stores/userTicketStore';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { ClipIcon, PencilIcon } from '@/assets/icons/path';
import TicketCreateButton from '@/components/user/create/TicketCreateButton.vue';
import CommonDialog from '@/components/common/CommonDialog.vue';
import { watchEffect } from 'vue';
import { formatMinusDate } from '@/utils/dateFormat';

const showDialog = ref(false);

// Vee-validate의 useForm으로 폼 초기화 및 유효성 검증 스키마 적용
const { handleSubmit, errors } = useForm({
  validationSchema,
});

// 현재 에러 상태 체크용 함수
watchEffect(() => {
  console.log('현재 에러 상태:', errors.value);
});

// 각 필드에 대한 useField 적용
const { value: title } = useField<string>('title');
const { value: content } = useField<string>('content');
const { value: due_Date } = useField<string>('dueDate');
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

const formattedDueDate = computed({
  get: () => {
    return formatMinusDate(ticketStore.ticket.due_date);
  },
  set: (newValue: string) => {
    // '-' 형식을 '/' 형식으로 변환하여 저장
    const formattedValue = newValue.replace(/-/g, '/');
    ticketStore.updateTicket({
      ...ticketStore.ticket,
      due_date: formattedValue,
    });
  },
});

// 템플릿 생성 버튼 클릭 시 실행될 함수
const onSubmit = handleSubmit(() => {
  console.log('생성 함수 실행');
  showDialog.value = true; // 다이얼로그 표시
});

// Dialog 안닫히는 문제해결용 함수
const closeDialog = async () => {
  console.log('버튼 클릭됨! showDialog 값 변경 전:', showDialog.value);
  showDialog.value = false;
  await nextTick(); // Vue의 상태 업데이트 보장
  console.log('showDialog 값 변경 후:', showDialog.value);
};
</script>

<template>
  <main class="ml-24 w-full max-w-[80%]">
    <form @submit.prevent="onSubmit">
      <section class="w-full h-12 mt-16">
        <label class="ticket-label">티켓 제목</label>
        <div class="relative w-full">
          <input v-model="title" class="title-form bg-[#fafafa] pr-10" placeholder="제목을 입력하세요" />
          <SvgIcon class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-1" :icon="PencilIcon" />
        </div>
        <div class="text-red-500 text-sm mt-1" v-if="errors.title">{{ errors.title }}</div>
      </section>

      <section class="w-full flex gap-x-32 mt-16">
        <div class="max-w-[50%] w-full">
          <label class="ticket-label">1차 카테고리</label>
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

        <div class="max-w-[50%] w-full">
          <label class="ticket-label">2차 카테고리</label>
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
      <section class="w-full mt-16">
        <label class="ticket-label">마감 기한</label>
        <input type="date" class="dueDate-form" v-model="due_Date" />
        <div class="text-red-500 text-sm mt-1" v-if="errors.due_Date">{{ errors.due_Date }}</div>
      </section>

      <section class="w-full mt-16">
        <label class="ticket-label">설명</label>
        <textarea v-model="content" class="ticket-desc-textarea min-h-80 bg-[#fafafa]" />
        <div class="text-red-500 text-sm mt-1" v-if="errors.content">{{ errors.content }}</div>
        <div class="flex justify-end cursor-pointer">
          <SvgIcon :icon="ClipIcon" class="text-gray-1" />
        </div>
      </section>
      <section class="flex justify-center">
        <TicketCreateButton type="onSubmit" />
      </section>
      <CommonDialog
        v-if="showDialog"
        title="티켓 요청 완료"
        content="티켓이 정상적으로 요청되었습니다."
        :isOneBtn="true"
        mainText="확인"
        @onMainClick="
          () => {
            console.log('✅ 다이얼로그 버튼 클릭됨!');
            closeDialog();
          }
        "
      />
    </form>
  </main>
</template>
