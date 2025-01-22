<script setup lang="ts">
import { ref } from 'vue';
import { SearchIcon } from '../../assets/icons/path';
import SvgIcon from '../common/SvgIcon.vue';
import { BaseTicketOption } from '@/types/tickets';
import CustomDropdown from '../common/CustomDropdown.vue';

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
</script>

<template>
  <section class="flex justify-between mx-auto w-[95%] mt-[50px]">
    <!-- 검색 -->
    <div class="manager-search-div">
      <input placeholder="티켓 검색..." class="manager-search-input" />
      <SvgIcon :icon="SearchIcon" />
    </div>

    <!-- 필터 -->
    <div class="flex gap-10">
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
    </div>
  </section>
</template>
