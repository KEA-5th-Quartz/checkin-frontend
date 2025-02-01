<script setup lang="ts">
import { firstCategory, secondCategory } from '@/components/manager/ticketOptionTest';
import { BaseTicketOption } from '@/types/tickets';
import CustomDropdown from '@/components/common/CustomDropdown.vue';
import { computed } from 'vue';
import { useTicketStore } from '@/stores/userTicketStore';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { ClipIcon } from '@/assets/icons/path';
import TemplateCreateButton from '@/components/user/create/TemplateCreateButton.vue';

const ticketStore = useTicketStore();

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

const firstCategorySelected = createComputedProperty(firstCategory, 'firstCategory');
const secondCategorySelected = createComputedProperty(secondCategory, 'secondCategory');

const handleOptionSelect = (field: keyof typeof ticketStore.ticket) => (option: BaseTicketOption) => {
  if (ticketStore.ticket) {
    ticketStore.updateTicket({
      ...ticketStore.ticket,
      [field]: option.label,
    });
  }
};
</script>

<template>
  <main class="ml-24">
    <section class="h-12 mt-24">
      <div class="ticket-label">티켓 제목</div>
      <input class="title-form bg-[#fafafa]" placeholder="제목을 입력하세요" />
    </section>
    <section class="flex gap-x-48 mt-16">
      <div class="w-[500px]">
        <div class="ticket-label">1차 카테고리</div>
        <CustomDropdown
          class="h-12 py-1"
          label=""
          :options="firstCategory"
          :selected-option="firstCategorySelected"
          :onOptionSelect="handleOptionSelect('firstCategory')"
          @select="(option: BaseTicketOption) => (firstCategorySelected = option)"
          isEdit
        />
      </div>
      <div class="w-[500px]">
        <div class="ticket-label">2차 카테고리</div>
        <CustomDropdown
          class="h-12 py-1"
          label=""
          :options="secondCategory"
          :selected-option="secondCategorySelected"
          :onOptionSelect="handleOptionSelect('secondCategory')"
          @select="(option: BaseTicketOption) => (secondCategorySelected = option)"
          isEdit
        />
      </div>
    </section>
    <section class="mt-16">
      <div class="ticket-label mt-24">설명</div>
      <textarea v-model="ticketStore.ticket.content" class="ticket-desc-textarea min-h-80 w-[1200px] bg-[#fafafa]" />
      <div class="flex w-[1200px] justify-end pr-2 cursor-pointer">
        <SvgIcon :icon="ClipIcon" />
      </div>
    </section>
    <section class="flex justify-center">
      <TemplateCreateButton />
    </section>
  </main>
</template>
