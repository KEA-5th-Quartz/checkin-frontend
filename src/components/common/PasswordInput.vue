<script setup lang="ts">
import { ref } from 'vue';
import SvgIcon from './SvgIcon.vue';
import { EyeIcon, EyeSlashIcon } from '@/assets/icons/path';
import { PasswordInputProps } from '@/types/common/passwordInput';

withDefaults(defineProps<PasswordInputProps>(), {
  placeholder: '',
  name: '',
  maxlength: undefined,
  error: '',
  successMessage: '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const showPassword = ref(false);

const toggleVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <div class="flex-stack gap-0.5 relative">
    <label class="text-gray-0">{{ label }}</label>
    <div class="relative">
      <input
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="w-full bg-gray-2 bg-opacity-80 rounded-lg py-2 px-3.5 focus:outline-none pr-10"
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
        'absolute top-[70px]',
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
