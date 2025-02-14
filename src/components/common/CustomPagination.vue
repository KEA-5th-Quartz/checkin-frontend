<script setup lang="ts">
import { computed } from 'vue';

interface PaginationProps {
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  visiblePages?: number;
}

const props = withDefaults(defineProps<PaginationProps>(), {
  visiblePages: 5,
});

const emit = defineEmits<{
  (e: 'page-change', page: number): void;
}>();

const goToPage = (page: number) => {
  if (page < 1 || page > props.totalPages) return;
  emit('page-change', page);
};

const pages = computed(() => {
  const { currentPage, totalPages, visiblePages } = props;
  const half = Math.floor(visiblePages / 2);

  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, currentPage + half);

  if (end - start + 1 < visiblePages) {
    if (start === 1) {
      end = Math.min(totalPages, start + visiblePages - 1);
    } else if (end === totalPages) {
      start = Math.max(1, end - visiblePages + 1);
    }
  }

  if (end - start + 1 > visiblePages) {
    end = start + visiblePages - 1;
  }

  const result: (number | string)[] = [];

  if (start > 1) {
    result.push(1);
    if (start > 2) result.push('...');
  }

  for (let i = start; i <= end; i++) {
    result.push(i);
  }

  if (end < totalPages) {
    if (end < totalPages - 1) result.push('...');
    result.push(totalPages);
  }

  return result;
});
</script>

<template>
  <div class="flex justify-end items-center space-x-2 mt-4 mr-5 gap-1">
    <button
      :disabled="currentPage === 1"
      @click="goToPage(currentPage - 1)"
      class="w-10 h-10 px-2 py-1 bg-gray-3 rounded disabled:bg-gray-3 flex-center border-gray-4"
    >
      <span class="text-sm">&lt;</span>
    </button>

    <button
      v-for="page in pages"
      :key="page"
      @click="typeof page === 'number' ? goToPage(page) : null"
      :class="[
        'w-10 h-10 text-sm px-2 py-1 rounded border-gray-4',
        page === currentPage
          ? 'bg-primary-0 text-white-0 border-purple-400 hover:bg-opacity-80'
          : 'bg-gray-3 hover:bg-gray-2',
        page === '...' ? 'cursor-default' : 'cursor-pointer',
      ]"
      :disabled="page === '...'"
    >
      {{ page }}
    </button>

    <button
      :disabled="currentPage === totalPages"
      @click="goToPage(currentPage + 1)"
      class="w-10 h-10 px-2 py-1 bg-gray-3 hover:bg-gray-2 rounded disabled:bg-gray-3 flex-center"
    >
      <span class="text-sm">&gt;</span>
    </button>
  </div>
</template>

<style scoped>
button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
