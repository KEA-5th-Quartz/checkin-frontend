<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';

const isDark = useDark(); // localStorage에 다크모드 상태 저장
const toggleDark = useToggle(isDark); // useToggle(): boolean 값을 토글하는 함수를 반환하는 컴포저블
</script>

<template>
  <button @click="toggleDark()" class="p-2 rounded-lg">
    <!-- 추후에 환경설정으로 이동 -->
    <div v-if="isDark">🌞 Light</div>
    <div v-else>🌙 Dark</div>
  </button>
</template>
