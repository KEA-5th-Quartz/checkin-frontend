<template>
  <div class="relative" ref="dropdownRef">
    <button ref="buttonRef" @click.stop="toggleMenu" class="text-gray-0 hover:text-black-0">⋮</button>
    <ul
      v-if="isOpen"
      class="fixed bg-white-0 border border-gray-2 w-28 z-50 shadow-md rounded-md"
      :style="{ top: dropdownPosition.top, left: dropdownPosition.left, minWidth: '7rem' }"
    >
      <li @click="handleEdit" class="px-4 py-2 cursor-pointer hover:bg-gray-3">수정</li>
      <li @click="handleDelete" class="px-4 py-2 cursor-pointer text-red-1 hover:bg-gray-3">삭제</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
  category: {
    type: Object as () => {
      id: number;
      name: string;
    },
    required: true,
  },
});

const emit = defineEmits(['edit', 'delete']);

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const buttonRef = ref<HTMLButtonElement | null>(null);
const dropdownPosition = ref({ top: '0px', left: '0px' });

async function toggleMenu(event: MouseEvent) {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    await nextTick();
    adjustDropdownPosition(event.target as HTMLElement);
  }
}

function adjustDropdownPosition(button: HTMLElement | null) {
  if (!button) return;

  const rect = button.getBoundingClientRect();
  const dropdownWidth = 112;
  const dropdownHeight = 100;
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  let top = rect.bottom + 5;
  let left = rect.left;

  if (rect.bottom + dropdownHeight > windowHeight) {
    top = rect.top - dropdownHeight - 5;
  }

  if (rect.right + dropdownWidth > windowWidth) {
    left = rect.right - dropdownWidth;
  }

  dropdownPosition.value = { top: `${top}px`, left: `${left}px` };
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

function handleResize() {
  if (isOpen.value && buttonRef.value) {
    adjustDropdownPosition(buttonRef.value);
  }
}

function handleEdit() {
  emit('edit', props.category);
  isOpen.value = false;
}

function handleDelete() {
  emit('delete', props.category);
  isOpen.value = false;
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', handleResize);
});
</script>
