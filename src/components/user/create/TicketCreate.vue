<script setup lang="ts">
import { ref, watch, nextTick, watchEffect } from 'vue';
import { useForm, useField } from 'vee-validate';
import { ticketValidationSchema } from '@/utils/ticketValidation';
import CustomDropdown from '@/components/common/CustomDropdown.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { ClipIcon } from '@/assets/icons/path';
import CommonDialog from '@/components/common/CommonDialog.vue';
import TicketCreateButton from '@/components/user/create/TicketCreateButton.vue';
import TicketTemplateButton from './TicketTemplateButton.vue';
import { BaseTicketOption } from '@/types/tickets';
import { categoryApi } from '@/services/categoryService/categoryService';
import { templateApi } from '@/services/templateService/templateService';
import { useCustomMutation } from '@/composables/useCustomMutation';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { ticketApi } from '@/services/ticketService/ticketService';
import { useQueryClient } from '@tanstack/vue-query';
import { useMemberStore } from '@/stores/memberStore';
import { useRouter } from 'vue-router';
import CommonInput from '@/components/common/CommonInput.vue';
import CommonTextarea from '@/components/common/commonTextarea.vue';
import { DialogProps, initialDialog } from '@/types/common/dialog';
import { handleError } from '@/utils/handleError';

const router = useRouter();
const memberStore = useMemberStore();

/*
  === 새로 추가된 부분 1) ===
  첨부파일 (attachmentId, url) 매핑을 저장하는 배열.
  - 업로드 응답을 받아서 id와 url 쌍으로 저장하고,
  - X 버튼 누를 때 해당 ID를 찾아서 서버에서도 삭제할 수 있게 함.
*/
const attachmentsMap = ref<{ id: number; url: string }[]>([]);

const templateOptions = ref<
  {
    id: number | string;
    value: string;
    label: string;
    content: string;
    firstCategory: string;
    secondCategory: string;
  }[]
>([]);

const showDialog = ref<boolean>(false);
const showTemplateDialog = ref<boolean>(false);
const attachmentError = ref<string | null>(null);
const dialogState = ref<DialogProps>({ ...initialDialog });

const response = ref<
  { templateId: string; title: string; firstCategory: string; secondCategory: string; content: string }[]
>([]);

const queryClient = useQueryClient();
const isUploading = ref<boolean>(false);

const { handleSubmit, errors, validate } = useForm({
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

const { value: title, handleChange: titleChange } = useField<string>('title');
const { value: selectedFirstCategory } = useField<BaseTicketOption | null>('firstCategory');
const { value: selectedSecondCategory } = useField<BaseTicketOption | null>('secondCategory');
const { value: content, handleChange: contentChange } = useField<string>('content');
const { value: dueDate } = useField<string>('dueDate');
let { value: selectedTitleform } = useField<string>('title');
const { value: attachments, errorMessage: attachmentsError } = useField<File[]>('attachments');

const selectedTitle = ref<BaseTicketOption | undefined>(undefined);
const selectedTemplateError = ref<string | null>(null);

const handleTitleInput = (event: Event) => {
  const sanitizedValue = (event.target as HTMLInputElement).value
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

  titleChange(sanitizedValue);
};

const handleContentInput = (event: Event) => {
  const sanitizedValue = (event.target as HTMLTextAreaElement).value
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

  contentChange(sanitizedValue);
};

const selectedTemplate = ref<{
  title: string;
  firstCategory: string;
  secondCategory: string;
  content: string;
}>({
  title: '',
  firstCategory: '',
  secondCategory: '',
  content: '',
});

const attachment = ref<FormData | null>(null);

const attachmentIds = ref<number[]>([]);
const previewUrl = ref<string[]>([]);

const fileInput = ref<HTMLInputElement | null>(null);

const attachmentMutation = useCustomMutation(
  async ({ attachment }: { attachment: FormData }) => {
    const response = await ticketApi.postAttachment(attachment);
    return response.data;
  },
  {
    onSuccess: (response) => {
      const uploadedAttachmentIds = response.data
        .map((file: { attachmentId: number }) => file.attachmentId)
        .filter((id: unknown) => Number.isInteger(id));

      attachmentIds.value = [...new Set([...attachmentIds.value, ...uploadedAttachmentIds])];

      const uploadedAttachmentUrls = response.data.map((file: { url: string }) => file.url);
      previewUrl.value = [...new Set([...previewUrl.value, ...uploadedAttachmentUrls])];

      /*
        === 새로 추가된 부분 2) ===
        서버 응답에 담긴 (attachmentId, url)을 attachmentsMap에 저장,
        이후 removeFile() 시 여기서 id 찾아 서버 삭제.
      */
      response.data.forEach((file: { attachmentId: number; url: string }) => {
        attachmentsMap.value.push({ id: file.attachmentId, url: file.url });
      });
    },
    onError: () => {
      dialogState.value = {
        open: true,
        isOneBtn: true,
        title: '오류',
        content: '파일 업로드에 실패했습니다..',
        mainText: '확인',
        onMainClick: () => {
          dialogState.value = { ...initialDialog };
        },
      };
    },
  },
);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
  if (isUploading.value) {
    attachmentError.value = '* 이미 파일 업로드 중입니다.';
    return;
  }

  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const files = Array.from(target.files);

  if (previewUrl.value.length + files.length > 3) {
    attachmentError.value = '* 첨부 파일은 총 3개를 초과할 수 없습니다.';
    target.value = '';
    return;
  }

  const oversizedFiles = files.filter((file) => file.size > 10 * 1024 * 1024);
  if (oversizedFiles.length > 0) {
    attachmentError.value = '* 첨부파일 크기는 개당 10MB 이하여야 합니다.';
    target.value = '';
    return;
  }

  const allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
  ];

  const invalidFiles = files.filter((file) => !allowedTypes.includes(file.type));
  if (invalidFiles.length > 0) {
    attachmentError.value = '* 허용되지 않는 파일 형식입니다.';
    target.value = '';
    return;
  }

  const existingFileNames = previewUrl.value.map((url) => url.split('/').pop());
  const newFileNames = files.map((file) => file.name);
  const hasDuplicate = newFileNames.some((name) => existingFileNames.includes(name));

  if (hasDuplicate) {
    attachmentError.value = '* 이미 업로드한 첨부파일입니다.';
    target.value = '';
    return;
  }

  attachments.value = files;

  try {
    isUploading.value = true;
    attachmentError.value = null;

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    attachment.value = formData;

    const response = await attachmentMutation.mutateAsync({ attachment: attachment.value });

    const uploadedAttachmentIds = response.data.map((file: { attachmentId: number }) => file.attachmentId);
    attachmentIds.value = Array.from(new Set([...attachmentIds.value, ...uploadedAttachmentIds]));

    const uploadedAttachmentUrls = response.data.map((file: { url: string }) => file.url);
    previewUrl.value = Array.from(new Set([...previewUrl.value, ...uploadedAttachmentUrls]));
  } catch (error) {
    attachmentError.value = '* 파일 업로드에 실패했습니다.';
  } finally {
    isUploading.value = false;
    target.value = '';
  }
};

const pages = 1;
const size = 100;

const memberId = ref<number | null>(null);

watch(
  () => memberStore.memberId,
  (newMemberId) => {
    memberId.value = newMemberId;
  },
);

const fetchTemplates = useCustomQuery(['template-list', memberId], async () => {
  try {
    const response = await templateApi.getTemplateList(memberStore.memberId, pages, size);
    return response.data.data.templates.map((template: any) => ({
      templateId: template.templateId,
      title: template.title,
      firstCategory: template.firstCategory,
      secondCategory: template.secondCategory,
      content: template.content,
    }));
  } catch (error) {
    handleError(dialogState, '템플릿 불러오기 실패');
  }
});

const handleTemplateClick = async (event: Event) => {
  event.preventDefault();
  try {
    response.value = fetchTemplates.data.value;
    if (Array.isArray(response.value)) {
      templateOptions.value = response.value.map((template) => ({
        id: template.templateId,
        value: template.title,
        label: template.title,
        firstCategory: template.firstCategory,
        secondCategory: template.secondCategory,
        content: template.content,
      }));
    } else {
      templateOptions.value = [];
    }
    showTemplateDialog.value = true;
  } catch (error) {
    handleError(dialogState, '템플릿 목록 불러오기 실패');
  }
};

const isSubmitting = ref(false);
const preventSubmit = ref(false);

const onSubmit = handleSubmit(async () => {
  await nextTick();

  if (preventSubmit.value) return;

  if (isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    await createTicketMutation.mutateAsync({
      title: title.value,
      firstCategory: selectedFirstCategory.value?.label || '',
      secondCategory: selectedSecondCategory.value?.label || '',
      content: content.value,
      dueDate: dueDate.value,
      attachmentIds: attachmentIds.value,
    });

    showDialog.value = true;
  } catch (error) {
    isSubmitting.value = false;
  }
});

const handleMain = async () => {
  if (!showDialog.value) return;

  showDialog.value = false;
  isSubmitting.value = false;

  await nextTick();
  router.push('/user/ticketlist');
};

const fetchCategories = useCustomQuery(['category'], async () => {
  try {
    const response = await categoryApi.getCategories();
    return response.data.data.map(
      (category: {
        firstCategoryId: number;
        firstCategoryName: string;
        contentGuide: string;
        secondCategories: any[];
      }) => ({
        id: category.firstCategoryId,
        value: category.firstCategoryName,
        label: category.firstCategoryName,
        contentGuide: category.contentGuide,
        secondCategories: category.secondCategories.map((subCategory) => ({
          id: subCategory.secondCategoryId,
          value: subCategory.name,
          label: subCategory.name,
        })),
      }),
    );
  } catch (error) {
    handleError(dialogState, '카테고리 목록 불러오기 실패');
    throw error;
  }
});

const firstCategoryList = ref<BaseTicketOption[]>([]);
const secondCategoryList = ref<BaseTicketOption[]>([]);
const contentPlaceholder = ref('');

watch(selectedFirstCategory, (newCategory) => {
  if (newCategory) {
    const matchedCategory = firstCategoryList.value.find((cat) => cat.id === newCategory.id);
    if (matchedCategory) {
      contentPlaceholder.value = matchedCategory.contentGuide || '';
    }
    secondCategoryList.value = matchedCategory?.secondCategories || [];
  } else {
    contentPlaceholder.value = '';
    secondCategoryList.value = [];
  }
});

const updateSecondCategoryList = () => {
  if (selectedFirstCategory.value) {
    secondCategoryList.value =
      firstCategoryList.value.find((cat) => cat.id === selectedFirstCategory.value?.id)?.secondCategories || [];
  } else {
    secondCategoryList.value = [];
  }
};

const handleTitleSelect = (option: BaseTicketOption) => {
  selectedTitle.value = option;
  selectedTitleform.value = selectedTitle.value.label;
  selectedTemplate.value = {
    title: option.label,
    firstCategory: option.firstCategory || '',
    secondCategory: option.secondCategory || '',
    content: option.content || '',
  };

  selectedTemplateError.value = null;
};

const handleFirstCategorySelect = (option: BaseTicketOption) => {
  selectedFirstCategory.value = option;
  updateSecondCategoryList();
  validate();
};

const firstCategoryError = ref<string | null>(null);

const handleSecondCategorySelect = (option: BaseTicketOption) => {
  if (!selectedFirstCategory.value) {
    firstCategoryError.value = '1차 카테고리를 먼저 선택하세요.';
    return;
  }
  firstCategoryError.value = null;
  selectedSecondCategory.value = option;
};

watch(
  () => fetchCategories.data.value,
  (newData) => {
    if (newData) {
      firstCategoryList.value = newData;
      updateSecondCategoryList();
    }
  },
  { immediate: true },
);

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
      queryClient.invalidateQueries(['user-tickets']);
      queryClient.refetchQueries(['user-tickets']);
    },
  },
);

const handleCancel = () => {
  showTemplateDialog.value = false;
};

const handleConfirm = async () => {
  if (!selectedTitle.value) {
    selectedTemplateError.value = '템플릿을 선택하세요.';
    preventSubmit.value = true;
    return;
  }

  selectedTemplateError.value = null;
  preventSubmit.value = false;

  if (selectedTemplate.value) {
    title.value = selectedTemplate.value.title;

    selectedFirstCategory.value =
      firstCategoryList.value.find((category) => category.value === selectedTemplate.value?.firstCategory) || null;

    if (selectedFirstCategory.value) {
      updateSecondCategoryList();
      watchEffect(() => {
        selectedSecondCategory.value =
          secondCategoryList.value.find((cat) => cat.value === selectedTemplate.value?.secondCategory) || null;
      });
    }

    if (selectedTemplate.value.content) {
      content.value = selectedTemplate.value.content;
    }
  }
  await nextTick();
  showTemplateDialog.value = false;
};

const removeFile = async (index: number) => {
  const removedUrl = previewUrl.value[index];
  previewUrl.value.splice(index, 1);

  const removedItem = attachmentsMap.value.find((item) => item.url === removedUrl);

  if (removedItem) {
    attachmentsMap.value = attachmentsMap.value.filter((item) => item.url !== removedUrl);
    attachmentIds.value = attachmentIds.value.filter((id) => id !== removedItem.id);
  }
};

const isImage = (url: string) => /\.(jpeg|jpg|gif|png|svg|webp)$/i.test(url);

const getFileExtensionLabel = (url: string) => {
  try {
    const decodedUrl = decodeURIComponent(url);
    const filename = decodedUrl.split('/').pop();
    const extension = filename?.split('.').pop()?.toLowerCase();
    return extension ? `${extension.toUpperCase()} 파일` : '알 수 없는 파일';
  } catch (error) {
    return '알 수 없는 파일';
  }
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
            :selectedOption="selectedFirstCategory as BaseTicketOption"
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
            :selectedOption="selectedSecondCategory as BaseTicketOption"
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
          :placeholder="contentPlaceholder"
        />
        <div class="text-red-2 text-sm" v-if="errors.content">{{ errors.content }}</div>

        <div class="flex justify-end cursor-pointer">
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
          {{ attachmentsError || attachmentError }}
        </div>

        <!-- 프리뷰 목록 -->
        <div class="flex flex-wrap gap-2 mt-2">
          <div
            v-for="(url, index) in previewUrl"
            :key="index"
            class="relative w-24 h-24 border border-gray-2 rounded-lg overflow-hidden flex-center bg-gray-100"
          >
            <img v-if="isImage(url)" :src="url" alt="첨부된 이미지" class="w-full h-full object-cover" />
            <div v-else class="text-xs text-gray-700 text-center px-2">
              {{ getFileExtensionLabel(url) }}
            </div>
            <!-- X 버튼 클릭 시 removeFile 함수 실행 -->
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

      <!-- 티켓 생성 완료 다이얼로그 -->
      <CommonDialog
        v-if="showDialog"
        title="티켓 요청 완료"
        content="티켓이 정상적으로 요청되었습니다."
        :isOneBtn="true"
        mainText="확인"
        :onMainClick="handleMain"
      />

      <CommonDialog
        v-if="dialogState.open"
        :isOneBtn="dialogState.isOneBtn"
        :title="dialogState.title"
        :content="dialogState.content"
        :mainText="dialogState.mainText"
        :onCancelClick="dialogState.onMainClick"
        :onMainClick="dialogState.onMainClick"
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
        <div class="text-red-1 text-sm mt-2" v-if="selectedTemplateError">
          {{ selectedTemplateError }}
        </div>
      </CommonDialog>
    </form>
  </main>
</template>
