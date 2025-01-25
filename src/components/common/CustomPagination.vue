<template>
  <div class="flex justify-end items-center space-x-2 mt-4 gap-1">
    <!-- 이전 버튼 -->
    <button
      :disabled="currentPage === 1"
      @click="goToPage(currentPage - 1)"
      class="w-10 h-10 px-2 py-1 bg-gray-3 rounded disabled:bg-gray-3 flex items-center justify-center border-gray-4"
    >
      <span class="text-sm">&lt;</span>
    </button>

    <!-- 페이지 번호 버튼 -->
    <button
      v-for="page in pages"
      :key="page"
      @click="goToPage(page)"
      :class="[
        'w-10 h-10 text-sm px-2 py-1 rounded border-gray-4',
        page === currentPage ? 'bg-primary-0 text-white-0 border-purple-400' : 'bg-gray-3',
      ]"
      :disabled="page === '...'"
    >
      {{ page }}
    </button>

    <!-- 다음 버튼 -->
    <button
      :disabled="currentPage === totalPages"
      @click="goToPage(currentPage + 1)"
      class="w-10 h-10 px-2 py-1 bg-gray-3 rounded disabled:bg-gray-3 flex items-center justify-center"
    >
      <span class="text-sm">&gt;</span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'CustomPagination',
  props: {
    itemsPerPage: {
      type: Number,
      required: true, // 한 페이지에 표시할 데이터 수
    },
    currentPage: {
      type: Number,
      required: true, // 현재 페이지 번호
    },
    totalPages: {
      type: Number,
      required: true, // 총 페이지 수
    },
    visiblePages: {
      type: Number,
      default: 10, // 한 번에 보여줄 페이지 번호의 개수
    },
  },
  emits: ['pageChange'], // 페이지 변경 이벤트
  setup(props, { emit }) {
    // 페이지 이동 핸들러
    const goToPage = (page: number) => {
      if (page < 1 || page > props.totalPages) return; // 유효하지 않은 페이지 번호 무시
      emit('pageChange', page); // 부모 컴포넌트로 변경된 페이지 번호 전달
    };

    // 동적으로 표시할 페이지 계산
    const pages = computed(() => {
      const { currentPage, totalPages, visiblePages } = props;
      const half = Math.floor(visiblePages / 2);

      let start = Math.max(1, currentPage - half); // 시작 페이지
      let end = Math.min(totalPages, currentPage + half); // 끝 페이지

      // 페이지 범위가 부족하면 보정
      if (end - start + 1 < visiblePages) {
        if (start === 1) {
          end = Math.min(totalPages, start + visiblePages - 1);
        } else if (end === totalPages) {
          start = Math.max(1, end - visiblePages + 1);
        }
      }

      // 최대 visiblePages 개수만 유지
      if (end - start + 1 > visiblePages) {
        end = start + visiblePages - 1;
      }

      // 페이지 목록 생성
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    });

    return {
      goToPage,
      pages,
    };
  },
});
</script>
<style scoped>
button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
