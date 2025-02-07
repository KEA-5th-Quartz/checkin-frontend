<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';
import { useForm, useField } from 'vee-validate';
import { ticketValidationSchema } from '@/utils/ticketValidation';
import CustomDropdown from '@/components/common/CustomDropdown.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { ClipIcon, PencilIcon } from '@/assets/icons/path';
import CommonDialog from '@/components/common/CommonDialog.vue';
import TicketCreateButton from '@/components/user/create/TicketCreateButton.vue';
import { BaseTicketOption } from '@/types/tickets';
import { categoryApi } from '@/services/categoryService/categoryService';
import { useCustomMutation } from '@/composables/useCustomMutation'; // 뮤테이션에 api 생성 -> 함수생성 -> 버튼연결
import { useCustomQuery } from '@/composables/useCustomQuery';
import { ticketApi } from '@/services/ticketService/ticketService';
import { useQueryClient } from '@tanstack/vue-query';

// 알림창 상태 체크
const showDialog = ref(false);

// 캐시 무효화를 위한 queryClient
const queryClient = useQueryClient();

// 무한요청 방지 객체
const isUploading = ref<boolean>(false);

// 티켓 템플릿 하드코딩
const template = ref<string>(
  '  이 기능이 어떻게 동작해야 하나요?  상세한 요청 사항을 입력해주세요.  관련 정보(링크, 파일 등)를 포함해주세요.',
);

// Vee-validate의 useForm으로 폼 초기화 및 유효성 검증 스키마 적용
const { handleSubmit, errors, validate } = useForm({
  validationSchema: ticketValidationSchema,
  initialValues: {
    title: '',
    content: '',
    firstCategory: null as BaseTicketOption | null,
    secondCategory: null as BaseTicketOption | null,
    dueDate: '',
    attachmentIds: [] as number[],
  },
});

// useField로 각 필드 생성
const { value: title } = useField<string>('title');
const { value: selectedFirstCategory } = useField<BaseTicketOption>('firstCategory');
const { value: selectedSecondCategory } = useField<BaseTicketOption>('secondCategory');
const { value: content } = useField<string>('content');
const { value: dueDate } = useField<string>('dueDate');

// 첨부파일 ID 요청을 위해 파일이름을 담을 값 생성 O
const attachment = ref<FormData | null>(null);

// 티켓생성 API 요청 및 프리뷰 정보를 저장할 객체 생성 O
const attachmentIds = ref<number[]>([]);
const previewUrl = ref<string[]>([]);

// 클릭시 파일 첨부 수행하기 위한 ref O
const fileInput = ref<HTMLInputElement | null>(null);

// 파일 첨부요청 뮤테이션
const attachmentMutation = useCustomMutation(
  async ({ attachment }: { attachment: FormData }) => {
    const response = await ticketApi.postAttachment(attachment); // 서버 전체 응답 데이터

    return response.data; // 백엔드 응답 데이터를 반환
  },
  {
    onSuccess: (response) => {
      const uploadedAttachmentIds = response.data.map((file: { attachmentid: string }) => file.attachmentid); //attachmentId 배열 반환
      attachmentIds.value.push(uploadedAttachmentIds);
      const uploadedAttachmentUrl = response.data.map((file: { url: string; attachmentid: string }) => file.url); // url 배열 반환
      previewUrl.value.push(...uploadedAttachmentUrl);
    },
    onError: (error) => {
      console.error('파일 첨부에 실패했습니다', error);
    },
  },
);

/*
  1. 사용자가 클립 아이콘 클릭 시 파일 탐색기 열기 O
  2. 사용자가 첨부한 파일 데이터 받아와서 attachement 객체(FormData)에 저장 O
  3. attachment(useField로 선언) 유효성 검사 진행 후 통과되면 프리뷰 렌더링, 아니면 에러 메시지 렌더링 X 
  4. 프리뷰 렌더링되면 첨부파일 뮤테이션 불러와서 attachement를 인자로 넘기는 함수 실행 
  5. 성공하면 응답 데이터(attachmentRes[])중 attachmentIds 배열(number[])에 push, url은 previewUrl(string[] | null)에 push O
  */

// 1. 파일 선택 트리거 함수
const triggerFileInput = () => {
  fileInput.value?.click();
};

// 2. 숨겨진 input 클릭 시 나타나는 파일탐색기
const handleFileChange = async (event: Event) => {
  // 파일 중복 요청 방지 코드
  if (isUploading.value) {
    console.warn('📌 이미 파일 업로드 중입니다. 중복 요청 방지.');
    return; // ✅ 중복 실행 방지
  }

  const target = event.target as HTMLInputElement;

  // 파일이 없는 경우 처리
  if (!target.files || target.files.length === 0) {
    console.error('📌 파일이 선택되지 않았습니다.');
    return;
  }
  // 파일 업로드 시 isUploading 상태 true로 전환
  isUploading.value = true; // ✅ 업로드 시작

  // 타겟 파일 배열로 변환해서 files에 저장
  const files = Array.from(target.files);

  // 기존 FormData 초기화
  const formData = new FormData(); // formData는 객체임

  // formData 객체를 file값들로 초기화
  files.forEach((file) => {
    // files 중 개별 요소를 file이란 이름으로 초기화
    formData.append('files', file); // file 값들을 formData에 채우기
  });

  // 선택된 files의 개별 값인 file을 담은 formData 객체값으로 attachment 상태값 초기화
  attachment.value = formData; // 기존 attachment 값이 FormData 배열이지만 초기값이 null이기 때문에 null이 사라지지않음

  // 유효성 검사 실행
  validate();

  try {
    // 유효성 검사 통과시 첨부파일 요청 뮤테이션 실행
    const response = await attachmentMutation.mutateAsync({ attachment: attachment.value }); // response값은 백엔드 응답데이터

    // attachmentId 필터링해서 숫자인 경우만 배열에 저장
    const uploadedAttachmentIds = response.data
      .map((file: { attachmentId: string }) => file.attachmentId)
      .filter((id: unknown) => Number.isInteger(id));

    // attachmentIds가 배열인지 확인 후 처리
    if (!Array.isArray(attachmentIds.value)) {
      attachmentIds.value = []; // ✅ 배열이 아닌 경우 초기화
    }

    // ✅ Proxy 문제 해결 (push() 대신 spread 연산자 사용)
    attachmentIds.value = [...uploadedAttachmentIds];

    // ✅ 업로드된 파일 URL 저장
    const uploadedAttachmentUrl = response.data.map((file: { url: string }) => file.url);
    previewUrl.value = [...previewUrl.value, ...uploadedAttachmentUrl];
  } catch (error) {
    console.error('파일 업로드 실패:', error);
  } finally {
    isUploading.value = false; // ✅ 업로드 완료 후 상태 초기화
  }
};

// 티켓 생성 버튼
const onSubmit = handleSubmit(async () => {
  try {
    await createTicketMutation.mutateAsync({
      title: title.value,
      firstCategory: selectedFirstCategory.value.label,
      secondCategory: selectedSecondCategory.value.label,
      content: content.value,
      dueDate: dueDate.value,
      attachmentIds: attachmentIds.value, // .value 사용
    });
    showDialog.value = true;
  } catch (error) {
    console.error('티켓 생성 실패:', error);
  }
});

// 카테고리 데이터 가져오는 커스텀 쿼리
const fetchCategories = useCustomQuery(['category'], async () => {
  try {
    const response = await categoryApi.getCategories();
    return response.data.data.map(
      (category: { firstCategoryId: string; firstCategoryName: string; secondCategories: any[] }) => ({
        id: category.firstCategoryId, // ✅ 변경: firstCategory → firstCategoryId
        value: category.firstCategoryName,
        label: category.firstCategoryName,
        secondCategories: category.secondCategories.map((subCategory) => ({
          id: subCategory.secondCategoryId,
          value: subCategory.name, // ✅ 변경: subCategory.Name → subCategory.name
          label: subCategory.name,
        })),
      }),
    );
  } catch (error) {
    console.error('에러 처리:', error);
    throw error;
  }
});

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

// watch를 사용하여 fetchCategories에 데이터가 들어오면 firstCategoryList 업데이트
watch(
  () => fetchCategories.data.value,
  (newData) => {
    if (newData) {
      firstCategoryList.value = newData;

      // ✅ 1차 카테고리 업데이트 후 2차 카테고리 업데이트 실행
      updateSecondCategoryList();
    }
  },
  { immediate: true },
);

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
    onSuccess: () => {
      showDialog.value = true;
      queryClient.refetchQueries(['ticket-list']); // 티켓 생성목록 데이터 자동 리패칭
    },
  },
);

// Dialog 안닫히는 문제해결용 함수
const closeDialog = async () => {
  showDialog.value = false;
  await nextTick(); // Vue의 상태 업데이트 보장
};

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
          <input v-model="title" class="title-form bg-[#fafafa] pr-10 text-black-2" placeholder="제목을 입력하세요" />
          <SvgIcon
            class="absolute right-3 top-1/2 tran sform -translate-y-1/2 w-4 h-4 text-gray-1"
            :icon="PencilIcon"
          />
        </div>
        <div class="text-red-2 text-sm mt-1" v-if="errors.title">{{ errors.title }}</div>
      </section>

      <section class="w-full flex gap-x-32 mt-12">
        <div class="max-w-[50%] w-full">
          <label class="ticket-label">1차 카테고리</label>
          <CustomDropdown
            class="h-12 py-1 text-black-2"
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
            v-if="fetchCategories.data?.value"
            class="h-12 py-1 text-black-2"
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
        <label class="ticket-label">요청 사항</label>
        <textarea v-model="content" class="ticket-desc-textarea min-h-80 bg-[#fafafa] text-black-2" />
        <div class="text-red-2 text-sm" v-if="errors.content">{{ errors.content }}</div>
        <div class="flex justify-end cursor-pointer">
          <!-- 숨겨진 파일 선택 input -->
          <input type="file" ref="fileInput" @change="handleFileChange" multiple class="hidden" />
          <SvgIcon :icon="ClipIcon" class="text-gray-1" @click="triggerFileInput" />
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
        :onMainClick="
          () => {
            closeDialog();
          }
        "
      />
    </form>
  </main>
</template>
