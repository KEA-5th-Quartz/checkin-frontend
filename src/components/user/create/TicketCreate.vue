<script setup lang="ts">
import { ref, watch, computed, nextTick, onMounted } from 'vue';
import { useForm, useField } from 'vee-validate';
import { ticketValidationSchema } from '@/utils/ticketValidation';
import { watchEffect } from 'vue';
import CustomDropdown from '@/components/common/CustomDropdown.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { ClipIcon, PencilIcon } from '@/assets/icons/path';
import CommonDialog from '@/components/common/CommonDialog.vue';
import TicketCreateButton from '@/components/user/create/TicketCreateButton.vue';
import { BaseTicketOption } from '@/types/tickets';
import { useTicketStore } from '@/stores/userTicketStore';
import { categoryApi } from '@/services/categoryService/categoryService';
import { useCustomMutation } from '@/composables/useCustomMutation'; // 뮤테이션에 api 생성 -> 함수생성 -> 버튼연결
import { useCustomQuery } from '@/composables/useCustomQuery';
import { ticketApi } from '@/services/ticketService/ticketService';
import { useQueryClient } from '@tanstack/vue-query';
import { AttachedFile } from '@/types/tickets';
import { useMemberStore } from '@/stores/memberStore';

const attachmentIds = [];
const memberStore = useMemberStore();

// Vue Store 사용
const ticketStore = useTicketStore();

// Dialog 상태 체크
const showDialog = ref(false);

// 티켓 템플릿 하드코딩
const template = ref<string>(
  '  이 기능이 어떻게 동작해야 하나요?  상세한 요청 사항을 입력해주세요.  관련 정보(링크, 파일 등)를 포함해주세요.',
);

const props = defineProps<{
  ticketId: number;
}>();

const queryClient = useQueryClient();

// 첨부된 파일 정보를 저장할 ref
const attachedFiles = ref<AttachedFile[]>([]);
const previewUrl = ref<string | null>(null);
const showPreview = ref(false);

// 파일 첨부 뮤테이션
const attachmentMutation = useCustomMutation(
  async ({ ticketId, formData }: { ticketId: number; formData: any }) => {
    const response = await ticketApi.postTicketAttachment(ticketId, formData);

    return response.data;
  },
  {
    onSuccess: (response) => {
      const newFile = response.data;
      attachedFiles.value.push({
        commentId: newFile.commentId,
        attachmentUrl: newFile.attachmentUrl,
        isImage: newFile.isImage,
      });

      queryClient.invalidateQueries({ queryKey: ['ticket-comments', props.ticketId] });
    },
  },
);

// Vee-validate의 useForm으로 폼 초기화 및 유효성 검증 스키마 적용
const { handleSubmit, errors, validate } = useForm({
  validationSchema: ticketValidationSchema,
  initialValues: {
    // ✅ 초기값 설정
    content: '', // ✅ content의 초기값을 빈 문자열로 설정
  },
});

// useField로 각 필드 생성
const { value: title } = useField<string>('title');
const { value: selectedFirstCategory } = useField<BaseTicketOption>('firstCategory');
const { value: selectedSecondCategory } = useField<BaseTicketOption>('secondCategory');
const { value: content } = useField<string>('content');
const { value: dueDate } = useField<string>('dueDate');
const { value: attachment } = useField<number>('attachment');

// 티켓 생성 버튼
const onSubmit = handleSubmit(async () => {
  console.log('생성 함수 실행');

  try {
    await createTicketMutation.mutateAsync({
      title: title.value,
      firstCategory: selectedFirstCategory.value.label,
      secondCategory: selectedSecondCategory.value.label,
      content: content.value,
      dueDate: dueDate.value,
      attachmentIds: attachmentIds,
    });

    showDialog.value = true; // ✅ API 요청이 성공한 후 다이얼로그 표시
  } catch (error) {
    console.error('티켓 생성 실패:', error);
  }
});

// 카테고리 데이터 가져오는 API
const fetchCategories = useCustomQuery(['category'], async () => {
  try {
    const response = await categoryApi.getCategories();
    return response.data.data.map((category) => ({
      id: category.firstCategoryId, // ✅ 변경: firstCategory → firstCategoryId
      value: category.firstCategoryName,
      label: category.firstCategoryName,
      secondCategories: category.secondCategories.map((subCategory) => ({
        id: subCategory.secondCategoryId,
        value: subCategory.name, // ✅ 변경: subCategory.Name → subCategory.name
        label: subCategory.name,
      })),
    }));
  } catch (error) {
    console.error('에러 처리:', error);
    throw error;
  }
});

// watch를 사용하여 fetchCategories에 데이터가 들어오면 firstCategoryList 업데이트
watch(
  () => fetchCategories.data.value,
  (newData) => {
    if (newData) {
      firstCategoryList.value = newData;
      console.log('📌 1차 카테고리 업데이트됨:', firstCategoryList.value);

      // ✅ 1차 카테고리 업데이트 후 2차 카테고리 업데이트 실행
      updateSecondCategoryList();
    }
  },
  { immediate: true },
);

// 카테고리 옵션 리스트
const firstCategoryList = ref<BaseTicketOption[]>([]);
const secondCategoryList = ref<BaseTicketOption[]>([]);

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

// ✅ 1차 카테고리 선택 및 2차 카테고리 초기화
const handleFirstCategorySelect = (option: BaseTicketOption) => {
  selectedFirstCategory.value = option;
  // selectedSecondCategory.value = null;
  updateSecondCategoryList();

  validate();
};

// ✅ 2차 카테고리 선택
const handleSecondCategorySelect = (option: BaseTicketOption) => {
  selectedSecondCategory.value = option;
};

const contentWithoutTemplate = computed(() => {
  return content.value.replace(template.value, '').trim(); // ✅ 템플릿 부분 제거
});

// 티켓 생성 뮤테이션
const createTicketMutation = useCustomMutation(
  async ({
    title,
    firstCategory,
    secondCategory,
    content,
    dueDate,
    attachmentIds,
  }: {
    title: string;
    firstCategory: string;
    secondCategory: string;
    content: string;
    dueDate: string;
    attachmentIds: number[];
  }) => {
    return ticketApi.postTicket(title, firstCategory, secondCategory, content, dueDate, attachmentIds);
  },
  {
    onSuccess: (data) => {
      showDialog.value = true;
      queryClient.refetchQueries(['ticket-list']); // 티켓 생성목록 데이터 자동 리패칭
      console.log('생성 티켓 번호:', data.data.data); // 티켓 번호 콘솔에 출력
    },
    onError: (error) => {
      console.log('티켓 생성 실패:', error);
    },
  },
);

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
  console.log(content.value);
});

// ✅ 초기 렌더링 시 템플릿을 content에 추가
onMounted(() => {
  if (!content.value) {
    content.value = template.value + '\n\n'; // ✅ 처음 페이지 로딩 시 템플릿 추가
  }
});

watch(content, (newValue) => {
  if (newValue.length < template.value.length) {
    content.value = template.value + '\n\n'; // ✅ 사용자가 템플릿을 삭제하면 복구
  } else if (!newValue.startsWith(template.value)) {
    content.value = template.value + '\n\n' + newValue.slice(template.value.length).trim(); // ✅ 템플릿 중복 방지
  }
});
</script>

<template>
  <main class="ml-24 w-full max-w-[80%]">
    <form @submit.prevent="onSubmit">
      <section class="w-full h-12 mt-12">
        <label class="ticket-label">티켓 제목</label>
        <div class="relative w-full">
          <input v-model="title" class="title-form bg-[#fafafa] pr-10" placeholder="제목을 입력하세요" />
          <SvgIcon class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-1" :icon="PencilIcon" />
        </div>
        <div class="text-red-2 text-sm mt-1" v-if="errors.title">{{ errors.title }}</div>
      </section>

      <section class="w-full flex gap-x-32 mt-12">
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
      <section class="w-full mt-12">
        <label class="ticket-label">마감 기한</label>
        <input type="date" v-model="dueDate" class="dueDate-form" />
        <div class="text-red-2 text-sm mt-1" v-if="errors.dueDate">{{ errors.dueDate }}</div>
      </section>

      <section class="w-full mt-12">
        <label class="ticket-label">요청 내용</label>
        <textarea v-model="content" class="ticket-desc-textarea min-h-80 bg-[#fafafa]" />
        <div class="text-red-2 text-sm" v-if="errors.content">{{ errors.content }}</div>
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
