<script setup lang="ts">
import { ref, watch, nextTick, onMounted, computed, watchEffect } from 'vue';
import { useForm, useField } from 'vee-validate';
import { ticketValidationSchema } from '@/utils/ticketValidation';
import CustomDropdown from '@/components/common/CustomDropdown.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { ClipIcon, PencilIcon } from '@/assets/icons/path';
import CommonDialog from '@/components/common/CommonDialog.vue';
import TicketCreateButton from '@/components/user/create/TicketCreateButton.vue';
import TicketTemplateButton from './TicketTemplateButton.vue';
import { BaseTicketOption } from '@/types/tickets';
import { categoryApi } from '@/services/categoryService/categoryService';
import { templateApi } from '@/services/templateService/templateService';
import { useCustomMutation } from '@/composables/useCustomMutation'; // 뮤테이션에 api 생성 -> 함수생성 -> 버튼연결
import { useCustomQuery } from '@/composables/useCustomQuery';
import { ticketApi } from '@/services/ticketService/ticketService';
import { useQueryClient } from '@tanstack/vue-query';
import { useMemberStore } from '@/stores/memberStore';
import { useRouter } from 'vue-router';
import CommonInput from '@/components/common/CommonInput.vue';
import CommonTextarea from '@/components/common/commonTextarea.vue';

const router = useRouter();

const memberStore = useMemberStore();

const templateOptions = ref<
  { id: number; value: string; label: string; content: string; firstCategory: string; secondCategory: string }[]
>([]);

// 알림창 상태 체크
const showDialog = ref<boolean>(false);
const showTemplateDialog = ref<boolean>(false);

// 템플릿 목록을 불러올때 map함수 두번 돌리기 위해 잠시 저장할 객체
const response = ref<any>(null);

// 캐시 무효화를 위한 queryClient
const queryClient = useQueryClient();

// 무한요청 방지 객체
const isUploading = ref<boolean>(false);

// 티켓 템플릿 하드코딩
const template = ref<string>(
  '  이 기능이 어떻게 동작해야 하나요  상세한 요청 사항을 입력해주세요.  관련 정보를 포함해주세요.',
);

// Vee-validate의 useForm으로 폼 초기화 및 유효성 검증 스키마 적용
const { handleSubmit, errors, validate, validateField } = useForm({
  validationSchema: ticketValidationSchema,
  initialValues: {
    title: '',
    content: '',
    firstCategory: null as BaseTicketOption | null,
    secondCategory: null as BaseTicketOption | null,
    dueDate: '',
    attachments: [],
    attachmentIds: [] as number[],
  },
});

// useField로 각 필드 생성
const { value: title, handleChange: titleChange } = useField<string>('title');
const { value: selectedFirstCategory } = useField<BaseTicketOption>('firstCategory');
const { value: selectedSecondCategory } = useField<BaseTicketOption>('secondCategory');
const { value: content, handleChange: contentChange } = useField<string>('content');
const { value: dueDate } = useField<string>('dueDate');
const { value: selectedTitle } = useField<BaseTicketOption>('title');
const { value: attachments, errorMessage: attachmentsError } = useField<File[]>('attachments');

const handleTitleInput = (event: Event) => {
  const sanitizedValue = (event.target as HTMLInputElement).value
    .replace(/<[^>]*>/g, '') // HTML 태그 제거
    .replace(/javascript:/gi, '') // javascript: 프로토콜 제거
    .replace(/on\w+\s*=/gi, '') // 이벤트 핸들러 제거
    .replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

  titleChange(sanitizedValue);
};

const handleContentInput = (event: Event) => {
  const sanitizedValue = (event.target as HTMLTextAreaElement).value
    .replace(/<[^>]*>/g, '') // HTML 태그 제거
    .replace(/javascript:/gi, '') // javascript: 프로토콜 제거
    .replace(/on\w+\s*=/gi, '') // 이벤트 핸들러 제거
    .replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

  contentChange(sanitizedValue);
};

// 선택된 템플릿을 저장하는 객체
const selectedTemplate = ref<{ title: string; firstCategory: any; secondCategory: any; content: string } | null>(null);

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
    const response = await ticketApi.postAttachment(attachment);
    return response.data;
  },
  {
    onSuccess: (response) => {
      console.log('📌 파일 업로드 응답 데이터:', response.data);

      // ✅ attachmentId를 올바르게 추출하여 기존 배열과 병합 (중복 제거)
      const uploadedAttachmentIds = response.data
        .map((file: { attachmentId: number }) => file.attachmentId)
        .filter((id) => Number.isInteger(id)); // 숫자 값만 남기기

      console.log('📌 올바르게 추출된 attachmentIds:', uploadedAttachmentIds);

      // ✅ 기존 배열을 직접 변경하지 않고 새로운 배열을 할당 (불필요한 중첩 방지)
      attachmentIds.value = [...new Set([...attachmentIds.value, ...uploadedAttachmentIds])];
      console.log('📌 최종 attachmentIds:', attachmentIds.value);

      // ✅ 업로드된 파일 URL 저장
      const uploadedAttachmentUrls = response.data.map((file: { url: string }) => file.url);
      previewUrl.value = [...new Set([...previewUrl.value, ...uploadedAttachmentUrls])];
    },
    onError: (error) => {
      console.error('파일 첨부 실패:', error);
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
  if (isUploading.value) {
    console.warn('📌 이미 파일 업로드 중입니다. 중복 요청 방지.');
    return;
  }

  const target = event.target as HTMLInputElement;

  if (!target.files || target.files.length === 0) {
    console.error('📌 파일이 선택되지 않았습니다.');
    return;
  }

  const files = Array.from(target.files);

  attachments.value = files; // ✅ `attachments` 필드 업데이트

  // ✅ 유효성 검사 실행
  const isValid = await validateField('attachments');

  if (!isValid) {
    console.warn('📌 파일 유효성 검사 실패:', attachmentsError.value);
    attachments.value = []; // 🚨 오류 발생 시 파일 목록 초기화
    target.value = ''; // 파일 선택 초기화
    return;
  }

  // ✅ 파일 업로드 로직 시작 (유효한 경우)
  isUploading.value = true;

  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  attachment.value = formData; // `FormData` 객체로 상태 업데이트

  try {
    const response = await attachmentMutation.mutateAsync({ attachment: attachment.value });

    // ✅ 백엔드에서 받은 `attachmentId` 업데이트
    const uploadedAttachmentIds = response.data.map((file: { attachmentId: number }) => file.attachmentId);
    attachmentIds.value = Array.from(new Set([...attachmentIds.value, ...uploadedAttachmentIds]));

    // ✅ 프리뷰 URL 저장
    const uploadedAttachmentUrls = response.data.map((file: { url: string }) => file.url);
    previewUrl.value = Array.from(new Set([...previewUrl.value, ...uploadedAttachmentUrls]));
  } catch (error) {
    console.error('파일 업로드 실패:', error);
  } finally {
    isUploading.value = false;
    target.value = ''; // ✅ 업로드 후 초기화
  }
};

// 템플릿 불러오기 api 재사용을 위한 요청값 하드코딩
const pages = 1;
const size = 100;

// 템플릿 불러오기 api을 위한 사용자 id값 불러오기
const memberId = ref<number | null>(null);

// memberStore의 memberId가 변경될 때마다 memberId 값 업데이트
watch(
  () => memberStore.memberId,
  (newMemberId) => {
    memberId.value = newMemberId;
  },
);

// 템플릿 목록 불러오기 뮤테이션 생성 => 캐싱O 리패칭x => 받아온 값에서 title,category,content만 따로 저장
const fetchTemplates = useCustomQuery(['templates', memberId], async () => {
  try {
    const response = await templateApi.getTemplateList(memberStore.memberId, pages, size);
    return response.data.data.templates.map((template: any) => ({
      templateId: template.templateId,
      title: template.title,
      firstCategory: template.firstCategory,
      secondCategory: template.secondCategory,
      content: template.content,
    })); // 뮤테이션 호출시 [ {제목, 1차 카테고리, 2차 카테고리, 요청 사항}, ... , ] 객체들의 배열이 반환됨
  } catch (error) {
    console.error('템플릿 불러오기 API 에러:', error);
  }
});

// 템플릿 목록 조회 api 받아서 title에[ {id: value: label:} ]배열로 값 저장하는 로직
const handleTemplateClick = async (event: Event) => {
  event.preventDefault();
  console.log('📌 TicketTemplateButton 클릭됨!');

  try {
    response.value = fetchTemplates.data.value ?? [];
    console.log(fetchTemplates.data.value);
    if (Array.isArray(response.value)) {
      templateOptions.value = response.value.map((template: any) => ({
        id: template.templateId,
        value: template.title, // ✅ 제목
        label: template.title,
        firstCategory: template.firstCategory, // ✅ 1차 카테고리 추가
        secondCategory: template.secondCategory, // ✅ 2차 카테고리 추가
        content: template.content, // ✅ 요청 사항 추가
      }));
    } else {
      templateOptions.value = [];
    }

    console.log('📌 templateOptions 업데이트됨:', templateOptions.value);
    showTemplateDialog.value = true;
  } catch (error) {
    console.error('📌 템플릿 목록 불러오기 실패!', error);
  }
};

// 티켓 생성 버튼
// ✅ 요청 중복 방지 플래그
const isSubmitting = ref(false);

// ✅ 티켓 생성 버튼 (무한 요청 방지)
const onSubmit = handleSubmit(async () => {
  if (isSubmitting.value) {
    console.warn('🚨 이미 요청 중입니다. 중복 요청 방지!');
    return;
  }

  isSubmitting.value = true; // ✅ 요청 시작
  console.log('🚀 티켓 생성 요청 실행');

  try {
    await createTicketMutation.mutateAsync({
      title: title.value,
      firstCategory: selectedFirstCategory.value?.label || '',
      secondCategory: selectedSecondCategory.value?.label || '',
      content: content.value,
      dueDate: dueDate.value,
      attachmentIds: attachmentIds.value,
    });

    console.log('✅ 티켓 생성 성공');
    showDialog.value = true; // ✅ 요청 성공 후 다이얼로그 표시
  } catch (error) {
    console.error('❌ 티켓 생성 실패:', error);
    isSubmitting.value = false; // 요청 실패 시 즉시 상태 초기화
  }
});

// ✅ 티켓 생성 완료 후 정상적인 이동 처리
const handleMain = async () => {
  if (!showDialog.value) return;

  console.log('🔄 티켓 리스트로 이동');
  showDialog.value = false; // ✅ 다이얼로그 닫기
  isSubmitting.value = false; // ✅ 상태 초기화

  await nextTick(); // ✅ UI 업데이트 이후 실행
  router.push('/user/ticketlist'); // ✅ 정상적으로 페이지 이동
};

// ✅ 다이얼로그 상태 변경을 감지하여 불필요한 onSubmit 재실행 방지
watch(showDialog, (newValue) => {
  if (newValue) {
    console.log('📌 티켓 생성 완료 다이얼로그가 열림');
  } else {
    console.log('📌 티켓 생성 완료 다이얼로그가 닫힘');
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

const handleTitleSelect = (option: any) => {
  selectedTitle.value = option;
  selectedTemplate.value = {
    title: option.value,
    firstCategory: option.firstCategory,
    secondCategory: option.secondCategory,
    content: option.content,
  };
};

// ✅ 1차 카테고리 선택 및 2차 카테고리 초기화
const handleFirstCategorySelect = (option: BaseTicketOption) => {
  selectedFirstCategory.value = option;
  // selectedSecondCategory.value = null;
  updateSecondCategoryList();

  validate();
};

const firstCategoryError = ref<string | null>(null);

// ✅ 2차 카테고리 선택 시, 1차 카테고리가 없으면 에러 메시지 표시
const handleSecondCategorySelect = (option: BaseTicketOption) => {
  if (!selectedFirstCategory.value) {
    firstCategoryError.value = '1차 카테고리를 먼저 선택하세요.';
    return; // 선택 방지
  }

  // 정상적으로 선택되면 에러 메시지 제거
  firstCategoryError.value = null;
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
      queryClient.invalidateQueries(['user-tickets']); // 티켓 생성목록 데이터 자동 리패칭
    },
  },
);

// 취소, 확인 버튼 클릭
const computedContent = computed(() => content.value);

const styledContent = computed(() => {
  return `<span style="color: gray;">${template.value}</span><br><br><span style="color: black;">${
    selectedTemplate.value?.content || ''
  }</span>`;
});

const tempContent = ref(''); // ✅ 임시 content 변수

const handleCancel = () => {
  showTemplateDialog.value = false;
};

const handleConfirm = async () => {
  if (selectedTemplate.value) {
    console.log('📌 선택된 템플릿:', JSON.stringify(selectedTemplate.value, null, 2));

    // ✅ 제목, 카테고리 반영
    title.value = selectedTemplate.value.title;

    selectedFirstCategory.value =
      firstCategoryList.value.find((category) => category.value === selectedTemplate.value?.firstCategory) || null;

    if (selectedFirstCategory.value) {
      updateSecondCategoryList();
      watchEffect(() => {
        selectedSecondCategory.value =
          secondCategoryList.value.find((category) => category.value === selectedTemplate.value?.secondCategory) ||
          null;
      });
    }

    // ✅ 기존 템플릿 유지하면서 새 요청 사항 추가
    if (selectedTemplate.value.content) {
      await nextTick(); // Vue가 UI 업데이트할 시간을 줌
      content.value = `${template.value}\n\n${selectedTemplate.value.content}`; // ✅ 기존 템플릿 + 새 내용 추가
      console.log('📌 최종 요청 사항:', content.value);
    }
  }

  showTemplateDialog.value = false; // ✅ 다이얼로그 닫기
};

const isImage = (url: string) => /\.(jpeg|jpg|gif|png|svg|webp)$/i.test(url);

const getFileExtensionLabel = (url: string) => {
  try {
    const decodedUrl = decodeURIComponent(url); // URL 디코딩
    const filename = decodedUrl.split('/').pop(); // 파일명 추출
    const extension = filename?.split('.').pop()?.toLowerCase(); // 확장자 소문자로 변환

    return extension ? `${extension.toUpperCase()} 파일` : '알 수 없는 파일';
  } catch (error) {
    return '알 수 없는 파일';
  }
};

const removeFile = (index: number) => {
  previewUrl.value.splice(index, 1);
};
</script>

<template>
  <main class="ml-24 w-full max-w-[80%]">
    <form @submit.prevent="onSubmit">
      <section class="w-full h-12 mt-12">
        <label class="ticket-label">티켓 제목</label>
        <CommonInput
          :value="title"
          @input="handleTitleInput"
          name="title"
          class="title-form bg-[#fafafa]"
          placeholder="제목을 입력하세요"
          maxLength="25"
        />
        <div class="text-red-1 text-sm mt-1" v-if="errors.title">{{ errors.title }}</div>
      </section>

      <section class="w-full flex gap-x-32 mt-12">
        <div class="max-w-[50%] w-full">
          <label class="ticket-label">1차 카테고리</label>
          <CustomDropdown
            class="h-12 py-1 text-black-2 max-w-full"
            :options="firstCategoryList"
            :selectedOption="selectedFirstCategory"
            label=""
            @select="handleFirstCategorySelect"
            isEdit
          />
          <div class="text-red-2 text-sm mt-1" v-if="errors.firstCategory || firstCategoryError">
            {{ errors.firstCategory || firstCategoryError }}
          </div>
        </div>

        <div class="max-w-[50%] w-full">
          <label class="ticket-label">2차 카테고리</label>
          <CustomDropdown
            v-if="fetchCategories.data?.value"
            class="h-12 py-1 text-black-2 max-w-full"
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
        <CommonTextarea
          :value="content"
          @input="handleContentInput"
          name="content"
          class="ticket-desc-textarea min-h-80 bg-[#fafafa]"
          maxLength="256"
        />
        <div class="text-red-2 text-sm" v-if="errors.content">{{ errors.content }}</div>
        <div class="flex justify-end cursor-pointer">
          <!-- 숨겨진 파일 선택 input -->
          <input type="file" ref="fileInput" @change="handleFileChange" multiple class="hidden" />
          <SvgIcon
            :icon="ClipIcon"
            class="text-gray-1 hover:bg-primary-5 h-6 w-6 rounded-md"
            @click="triggerFileInput"
          />
        </div>
      </section>
      <section class="w-full mt-4">
        <label class="ticket-label">첨부된 파일</label>
        <div class="text-red-1 text-sm mt-1" v-if="attachmentsError">
          {{ attachmentsError }}
        </div>
        <div class="flex flex-wrap gap-2 mt-2">
          <div
            v-for="(url, index) in previewUrl"
            :key="index"
            class="relative w-24 h-24 border border-gray-2 rounded-lg overflow-hidden flex-center bg-gray-100"
          >
            <img v-if="isImage(url)" :src="url" alt="첨부된 이미지" class="w-full h-full object-cover" />
            <div v-else class="text-xs text-gray-700 text-center px-2">{{ getFileExtensionLabel(url) }}</div>
            <button @click="removeFile(index)" class="absolute top-1 right-1 w-5 h-5 flex-center rounded-full text-xs">
              ❌
            </button>
          </div>
        </div>
      </section>
      <section class="flex justify-center">
        <TicketTemplateButton type="button" @click="handleTemplateClick" />
        <TicketCreateButton type="onSubmit" class="ml-6" />
      </section>
      <CommonDialog
        v-if="showDialog"
        title="티켓 요청 완료"
        content="티켓이 정상적으로 요청되었습니다."
        :isOneBtn="true"
        mainText="확인"
        :onMainClick="handleMain"
      />
      <CommonDialog
        v-if="showTemplateDialog"
        title="템플릿 선택"
        mainText="확인"
        cancel-text="취소"
        :onMainClick="handleConfirm"
        :onCancelClick="handleCancel"
      >
        <CustomDropdown
          v-if="templateOptions.length > 0"
          class="h-12 py-1 max-w-full"
          :options="templateOptions"
          :selectedOption="selectedTitle"
          label=""
          @select="handleTitleSelect"
          isEdit
        />
      </CommonDialog>
    </form>
  </main>
</template>
