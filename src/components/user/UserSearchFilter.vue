<script setup lang="ts">
import { ref } from 'vue';
import { SearchIcon, TrashcanIcon } from '../../assets/icons/path';
import SvgIcon from '../common/SvgIcon.vue';
import { BaseTicketOption } from '@/types/tickets';
import CustomDropdown from '../common/CustomDropdown.vue';
import { useUserTicketStore } from '@/stores/userTicketStore';

const ticketStore = useUserTicketStore();

const statusOptions = [
  { id: 0, value: 'none', label: '진행 상태' },
  { id: 1, value: '생성', label: '생성' },
  { id: 2, value: '진행중', label: '진행중' },
  { id: 3, value: '완료', label: '완료' },
];

const managerOptions = [
  { id: 0, value: 'none', label: '담당자' },
  { id: 1, value: '김철환', label: '김철환' },
  { id: 2, value: '김현중', label: '김현중' },
  { id: 3, value: '박가현', label: '박가현' },
  { id: 4, value: '박석종', label: '박석종' },
  { id: 5, value: '박준한', label: '박준한' },
  { id: 6, value: '손성민', label: '손성민' },
  { id: 7, value: '임찬호', label: '임찬호' },
  { id: 8, value: '조기헌', label: '조기헌' },
  { id: 9, value: '최현준', label: '최현준' },
];

const firstCategory = [
  { id: 0, value: 'none', label: '1차 카테고리' },
  { id: 1, value: 'VM1', label: 'VM1' },
  { id: 2, value: 'VM2', label: 'VM2' },
  { id: 3, value: 'VM3', label: 'VM3' },
];

const statusSelected = ref<BaseTicketOption>(statusOptions[0]);
const handleStatusSelect = (option: BaseTicketOption) => {
  console.log('진행 상태 변경: ', option.label);
  statusSelected.value = option;
};

const managerSelected = ref(managerOptions[0]);
const handleManagerSelect = (option: BaseTicketOption) => {
  console.log('담당자 변경:', option.label);
  managerSelected.value = option;
};

const firstCategorySelected = ref(firstCategory[0]);
const handleFirstCategorySelect = (option: BaseTicketOption) => {
  console.log('1차 카테고리 변경:', option.label);
  firstCategorySelected.value = option;
};

const handleCancel = () => {
  ticketStore.toggleDeleteMode();
  ticketStore.clearSelectedTickets();
};

const handleDelete = () => {
  console.log('삭제 확인 모달 등장');
};
</script>

<template>
  <section v-if="!ticketStore.isDeleteMode" class="flex justify-between mx-auto w-[95%] mt-[50px]">
    <!-- 검색 -->
    <div class="manager-search-div">
      <input placeholder="티켓 검색..." class="manager-search-input" />
      <SvgIcon :icon="SearchIcon" />
    </div>

    <!-- 필터 -->
    <div class="flex items-center gap-10">
      <CustomDropdown
        label=""
        :options="statusOptions"
        :selected-option="statusSelected"
        :option-select="(option: BaseTicketOption)=>handleStatusSelect(option as BaseTicketOption)"
        @select="(option) => statusSelected = option as BaseTicketOption"
        isUser
      />

      <CustomDropdown
        label=""
        :options="managerOptions"
        :selected-option="managerSelected"
        :onOptionSelect="handleManagerSelect"
        @select="(option) => (managerSelected = option)"
        isUser
      />

      <CustomDropdown
        label=""
        :options="firstCategory"
        :selected-option="firstCategorySelected"
        :onOptionSelect="handleFirstCategorySelect"
        @select="(option) => (firstCategorySelected = option)"
        isUser
      />

      <SvgIcon :icon="TrashcanIcon" class="cursor-pointer" @click="ticketStore.toggleDeleteMode" />
    </div>
  </section>

  <section v-else class="flex justify-between mx-auto w-[95%] mt-14">
    <div class="flex items-center gap-4 ml-auto">
      <button @click="handleCancel" class="px-6 py-2 text-sm border border-gray-1 rounded-lg hover:bg-gray-100">
        취소
      </button>
      <button
        @click="handleDelete"
        class="px-6 py-2 text-sm text-white bg-primary-0 rounded-lg hover:bg-opacity-80 text-white-0"
      >
        삭제
      </button>
    </div>
  </section>
</template>
