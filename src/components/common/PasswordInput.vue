<script setup lang="ts">
import { ref } from 'vue';
import SvgIcon from './SvgIcon.vue';
import { EyeIcon, EyeSlashIcon } from '@/assets/icons/path';
import CommonInput from './CommonInput.vue';
import { PasswordInputProps } from '@/types/common/input';

withDefaults(defineProps<PasswordInputProps>(), {
  placeholder: '',
  name: '',
  maxlength: undefined,
  error: '',
  successMessage: '',
  modelValue: '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const showPassword = ref(false);

const toggleVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleInput = (e: Event) => {
  const input = (e.target as HTMLInputElement).value;
  const cleanedValue = input
    .replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      '',
    )
    .replace(/\s/g, '');
  emit('update:modelValue', cleanedValue);
};
</script>

<template>
  <div class="flex-stack gap-0.5 relative">
    <label class="text-gray-0">{{ label }}</label>
    <div class="relative">
      <CommonInput
        :value="modelValue"
        @input="handleInput"
        class="w-full bg-gray-2 bg-opacity-40 rounded-lg py-2 px-3.5 focus:outline-none pr-10 placeholder:text-sm"
        :type="showPassword ? 'text' : 'password'"
        :placeholder="placeholder"
        :name="name"
        :maxlength="maxlength"
      />
      <SvgIcon
        class="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
        @click="toggleVisibility"
        :icon="showPassword ? EyeIcon : EyeSlashIcon"
      />
    </div>
    <p
      v-if="error || successMessage"
      :class="[
        'absolute top-[70px] text-sm',
        {
          'text-red-1': error,
          'text-green-1': !error && successMessage,
        },
      ]"
    >
      {{ error || successMessage }}
    </p>
  </div>
</template>
