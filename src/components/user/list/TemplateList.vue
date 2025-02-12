<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue';
import TemplateDetail from './TemplateDetail.vue';
import { useUserTemplateListStore } from '@/stores/userTemplateListStore';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { ArrowDownIcon, CreateTicketIcon, TrashcanIcon } from '@/assets/icons/path';
import { perPageOptions } from '@/components/manager/ticketOptionTest';
import { onClickOutside } from '@vueuse/core';
import { DialogProps, initialDialog } from '@/types/common/dialog';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { useMemberStore } from '@/stores/memberStore';
import { templateApi } from '@/services/templateService/templateService';
import CommonDialog from '@/components/common/CommonDialog.vue';
import CustomPagination from '@/components/common/CustomPagination.vue';
import { useCustomMutation } from '@/composables/useCustomMutation';
import { useQueryClient } from '@tanstack/vue-query';
import router from '@/router';

const templateStore = useUserTemplateListStore();
const memberStore = useMemberStore();
const queryClient = useQueryClient();
const selectedTemplateId = ref<number | null>(null);

const initialPage = parseInt(sessionStorage.getItem('templateCurrentPage') || '1');
const currentPage = ref(initialPage);

const pageSize = ref(perPageOptions[0].value);

const selectedPerPage = ref(perPageOptions[0]);
const isSizeOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

onClickOutside(dropdownRef, () => (isSizeOpen.value = false));

const queryParams = ref({
  page: currentPage.value,
  size: pageSize.value,
  memberId: memberStore.memberId,
});

watchEffect(() => {
  queryParams.value = {
    page: currentPage.value,
    size: pageSize.value,
    memberId: memberStore.memberId,
  };
});

const selectOption = (option: { id: number; value: number; label: string }) => {
  selectedPerPage.value = option;
  pageSize.value = option.value;
  currentPage.value = 1;
  sessionStorage.setItem('templateCurrentPage', '1');
  isSizeOpen.value = false;
};

const dialogState = ref<DialogProps>({ ...initialDialog });

// 데이터 페칭
const { data: templateData } = useCustomQuery(
  ['template-list', queryParams],
  async () => {
    const response = await templateApi.getTemplateList(
      queryParams.value.memberId,
      queryParams.value.page,
      queryParams.value.size,
    );
    return response.data;
  },
  {
    enabled: true,
    keepPreviousData: false,
    refetchOnWindowFocus: false,
  },
);

// 템플릿 삭제 뮤테이션
const deleteMutation = useCustomMutation(
  async ({ templateIds }: { templateIds: number[] }) => {
    const response = await templateApi.deleteTemplates({ templateIds });
    return response.data;
  },
  {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['template-list'] });
    },
  },
);

const handleDelete = () => {
  const selectedTemplateIds = Array.from(templateStore.selectedTemplates);
  const templateCount = selectedTemplateIds.length;

  dialogState.value = {
    open: true,
    isWarn: true,
    title: `${templateCount}개의 템플릿을 삭제하시겠습니까?`,
    cancelText: '취소',
    onCancelClick: () => {
      dialogState.value = { ...initialDialog };
    },
    mainText: '삭제',
    onMainClick: () => {
      deleteMutation.mutate({ templateIds: selectedTemplateIds });
      templateStore.clearSelectedTemplates();
      templateStore.toggleDeleteMode();
      dialogState.value = { ...initialDialog };
    },
  };
};

const handleCancel = () => {
  templateStore.toggleDeleteMode();
  templateStore.clearSelectedTemplates();
};

const handleRowClick = (id: number) => {
  selectedTemplateId.value = id;
};

const handleCloseModal = () => {
  selectedTemplateId.value = null;
};

const handleCheckboxClick = (event: Event, id: number) => {
  event.stopPropagation();

  if (templateStore.selectedTemplates.has(id)) {
    templateStore.removeSelectedTemplate(id);
  } else {
    templateStore.addSelectedTemplate(id);
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  sessionStorage.setItem('templateCurrentPage', page.toString());
};

onMounted(() => {
  queryClient.invalidateQueries({
    queryKey: ['template-list'],
  });
});

onBeforeUnmount(() => {
  sessionStorage.setItem('templateCurrentPage', currentPage.value.toString());
});
</script>

<template>
  <section v-if="templateData?.data.templates !== 0" class="pb-10 mt-12">
    <header v-if="!templateStore.isDeleteMode" class="flex justify-end items-center mt-8 gap-10 mr-10">
      <div ref="dropdownRef" class="relative mt-1 flex items-center gap-10">
        <button @click="isSizeOpen = !isSizeOpen" class="manager-filter-btn">
          <span class="font-medium">{{ selectedPerPage.label }}</span>
          <SvgIcon :icon="ArrowDownIcon" :class="['transition-02s', isSizeOpen ? 'rotate-180' : '']" />
        </button>

        <div v-if="isSizeOpen" class="manager-filter-menu mt-44 w-[112px]">
          <ul>
            <li v-for="option in perPageOptions" :key="option.id" @click="selectOption(option)" class="board-size-menu">
              {{ option.label }}
            </li>
          </ul>
        </div>
        <SvgIcon :icon="TrashcanIcon" class="cursor-pointer" @click="templateStore.toggleDeleteMode" />
      </div>
    </header>

    <header v-else class="board-header">
      <div class="flex items-center gap-4 ml-auto">
        <button @click="handleCancel" class="btn-cancel py-2">취소</button>
        <button @click="handleDelete" class="btn-main py-2">삭제</button>
      </div>
    </header>

    <article class="overflow-x-auto mt-5 px-5 pb-20 hide-scrollbar">
      <div class="h-[calc(100vh-300px)]">
        <table class="min-w-full table-fixed">
          <thead class="manager-thead">
            <tr>
              <th v-if="templateStore.isDeleteMode" class="manager-th w-[1%]">선택</th>
              <th :class="['manager-th w-[5%]', templateStore.isDeleteMode ? 'pl-0' : 'pl-6']">번호</th>
              <th class="manager-th text-start w-[25%]">제목</th>
              <th class="manager-th w-[10%]">1차 <span class="hidden lg:inline-block">카테고리</span></th>
              <th class="manager-th w-[7.5%]">2차 <span class="hidden lg:inline-block">카테고리</span></th>
              <th class="manager-th w-[32.5%] text-start">요청사항</th>
            </tr>
          </thead>

          <tbody class="whitespace-nowrap">
            <tr
              v-for="item in templateData?.data.templates"
              :key="item.templateId"
              class="hover:bg-white-1 relative"
              @click="handleRowClick(item.templateId)"
            >
              <td v-if="templateStore.isDeleteMode" class="manager-td">
                <div class="flex items-center justify-center">
                  <input
                    type="checkbox"
                    :class="['w-4 h-4 cursor-pointer']"
                    :checked="templateStore.selectedTemplates.has(item.templateId)"
                    @click="(e) => handleCheckboxClick(e, item.templateId)"
                  />
                </div>
              </td>
              <td :class="['manager-td max-w-0', templateStore.isDeleteMode ? 'pl-0' : 'pl-6']">
                <p :title="item.id as unknown as string">
                  {{ item.templateId }}
                </p>
              </td>
              <td class="manager-td max-w-0 text-start">
                <p class="truncate" :title="item.title">
                  {{ item.title }}
                </p>
              </td>
              <td class="manager-td max-w-0">
                <p class="truncate">
                  {{ item.firstCategory }}
                </p>
              </td>
              <td class="manager-td max-w-0">
                <p class="truncate">
                  {{ item.secondCategory }}
                </p>
              </td>
              <td class="manager-td max-w-0 text-start">
                <p class="truncate" :title="item.content">
                  {{ item.content }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <TemplateDetail v-if="selectedTemplateId" :template-id="selectedTemplateId" @close="handleCloseModal" />
    </article>

    <CustomPagination
      :items-per-page="pageSize"
      :current-page="currentPage"
      :total-pages="templateData?.data.totalPages || 1"
      :visible-pages="5"
      @page-change="handlePageChange"
    />

    <CommonDialog
      v-if="dialogState.open"
      :isWarn="dialogState.isWarn"
      :title="dialogState.title"
      :cancelText="dialogState.cancelText"
      :mainText="dialogState.mainText"
      :onCancelClick="dialogState.onCancelClick"
      :onMainClick="dialogState.onMainClick"
    />
  </section>

  <section v-else class="w-full flex flex-col items-center pb-40">
    <div class="flex flex-col items-center gap-8 mt-32">
      <img src="@/assets/no-template.png" class="w-96 h-96" />
      <div class="flex flex-col items-center gap-2">
        <h1 class="text-xl">아직 생성한 템플릿이 없어요</h1>
        <p>템플릿 생성을 눌러 새로운 템플릿을 생성하세요</p>
      </div>
    </div>

    <button
      @click="router.push('/user/templatecreate')"
      class="flex items-center bg-primary-0 py-2.5 px-8 rounded text-white-0 gap-2.5 text-sm font-semibold mt-20"
    >
      <SvgIcon :icon="CreateTicketIcon" />
      템플릿 생성
    </button>
  </section>
</template>
