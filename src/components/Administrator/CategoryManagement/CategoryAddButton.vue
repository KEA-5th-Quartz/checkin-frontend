<template>
  <div class="flex-center mb-5">
    <button @click="handleAddCategory" class="bg-primary-5 text-primary-3 p-3 rounded-md hover:opacity-80 w-full">
      {{ props.buttonText }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  buttonText: {
    type: String,
    default: '카테고리 추가하기',
  },
});

const emit = defineEmits(['addCategory']);

function handleAddCategory() {
  emit('addCategory');
}
</script>
