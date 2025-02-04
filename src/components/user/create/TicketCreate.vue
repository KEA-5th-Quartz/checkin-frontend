<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue';
import { useForm, useField } from 'vee-validate';
import { validationSchema } from '@/utils/formValidation';
import { watchEffect } from 'vue';
import CustomDropdown from '@/components/common/CustomDropdown.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { ClipIcon, PencilIcon } from '@/assets/icons/path';
import CommonDialog from '@/components/common/CommonDialog.vue';
import TicketCreateButton from '@/components/user/create/TicketCreateButton.vue';
import { BaseTicketOption } from '@/types/tickets';
import { useTicketStore } from '@/stores/userTicketStore';
import { formatMinusDate } from '@/utils/dateFormat';
import { categoryApi } from '@/services/categoryService/categoryService';

// Vue Store 사용
const ticketStore = useTicketStore();

// Dialog 상태 체크
const showDialog = ref(false);

// Vee-validate의 useForm으로 폼 초기화 및 유효성 검증 스키마 적용
const { handleSubmit, errors } = useForm({
  validationSchema,
});

// useField로 각 필드 생성
const { value: title } = useField<string>('title');
const { value: firstCategory } = useField<BaseTicketOption>('firstCategory');
const { value: secondCategory } = useField<BaseTicketOption>('secondCategory');
const { value: content } = useField<string>('content');
const { value: dueDate } = useField<string>('dueDate');
const { value: attachment } = useField<number>('attachment');

// 서버에서 받아올 1차 카테고리 리스트
const firstCategoryList = ref<BaseTicketOption[]>([]);
// 선택된 1차 카테고리의 2차 카테고리 리스트
const secondCategoryList = ref<BaseTicketOption[]>([]);

// 현재 선택된 카테고리
const selectedFirstCategory = ref<BaseTicketOption | null>(null);
const selectedSecondCategory = ref<BaseTicketOption | null>(null);

// API에서 카테고리 데이터를 가져오는 함수
const fetchCategories = async () => {
  try {
    const response = await categoryApi.getCategories();

    if (!response.data || !Array.isArray(response.data.data)) {
      throw new Error('잘못된 API 응답 형식입니다.');
    }

    // 1차 카테고리 변환
    firstCategoryList.value = response.data.data.map((category) => ({
      id: category.firstCategoryId,
      value: category.firstCategoryName,
      label: category.firstCategoryName,
      secondCategories: category.secondCategories.map((subCategory) => ({
        id: subCategory.secondCategoryId,
        value: subCategory.name,
        label: subCategory.name,
      })),
    }));
  } catch (error: any) {
    console.error('📌 [API 오류] 카테고리 불러오기 실패:', error.message || error);
  }
};

// ✅ 1차 카테고리 선택 시, 해당 2차 카테고리 리스트 변경
const updateSecondCategoryList = () => {
  if (selectedFirstCategory.value) {
    secondCategoryList.value =
      firstCategoryList.value.find((category) => category.id === selectedFirstCategory.value?.id)?.secondCategories ||
      [];
  } else {
    secondCategoryList.value = [];
  }
};

// ✅ 1차 카테고리 변경 시, 2차 카테고리 초기화
const handleFirstCategorySelect = (option: BaseTicketOption) => {
  selectedFirstCategory.value = option;
  selectedSecondCategory.value = null;
  updateSecondCategoryList();
};

// ✅ 2차 카테고리 선택
const handleSecondCategorySelect = (option: BaseTicketOption) => {
  selectedSecondCategory.value = option;
};

// ✅ 컴포넌트 마운트 시 API 호출
onMounted(fetchCategories);

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

// 현재 에러 상태 체크용 함수
watchEffect(() => {
  console.log('현재 에러 상태:', errors.value);
});
</script>

<template>
  <main class="ml-24 w-full max-w-[80%]">
    <form @submit.prevent="onSubmit">
      <section class="w-full h-12 mt-16">
        <label class="ticket-label">티켓 제목</label>
        <div class="relative w-full">
          <input v-model="title" class="title-form bg-[#fafafa] px-3 py-3 pr-10" placeholder="제목을 입력하세요" />
          <SvgIcon class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-1" :icon="PencilIcon" />
        </div>
        <div class="text-red-2 text-sm mt-1" v-if="errors.title">{{ errors.title }}</div>
      </section>

      <section class="w-full flex gap-x-32 mt-16">
        <div class="max-w-[50%] w-full">
          <label class="ticket-label">1차 카테고리</label>
          <CustomDropdown
            class="h-12 py-1"
            :options="firstCategoryList"
            :selectedOption="selectedFirstCategory"
            label=""
            @select="handleFirstCategorySelect"
            isEdit
          />
          <div class="text-red-2 text-sm mt-1" v-if="errors.firstCategory">{{ errors.firstCategory }}</div>
        </div>

        <div class="max-w-[50%] w-full">
          <label class="ticket-label">2차 카테고리</label>
          <CustomDropdown
            class="h-12 py-1"
            :options="secondCategoryList"
            :selectedOption="selectedSecondCategory"
            label=""
            @select="handleSecondCategorySelect"
            isEdit
          />
          <div class="text-red-2 text-sm mt-1" v-if="errors.secondCategory">{{ errors.secondCategory }}</div>
        </div>
      </section>
      <section class="w-full mt-16">
        <label class="ticket-label">마감 기한</label>
        <input type="date" v-model="dueDate" class="dueDate-form" />
        <div class="text-red-2 text-sm mt-1" v-if="errors.dueDate">{{ errors.dueDate }}</div>
      </section>

      <section class="w-full mt-16">
        <label class="ticket-label">설명</label>
        <textarea v-model="content" class="ticket-desc-textarea min-h-80 bg-[#fafafa]" />
        <div class="text-red-2 text-sm mt-1" v-if="errors.content">{{ errors.content }}</div>
        <div class="flex justify-end cursor-pointer">
          <SvgIcon :icon="ClipIcon" class="text-gray-1" v-model="attachment" />
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
            console.log('다이얼로그 버튼 클릭됨');
            closeDialog();
          }
        "
      />
    </form>
  </main>
</template>
