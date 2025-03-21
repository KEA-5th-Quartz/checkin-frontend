export interface CommonInputProps {
  modelValue?: string;
  placeholder?: string;
}

export interface PasswordInputProps {
  modelValue: string;
  label: string;
  placeholder?: string;
  name?: string;
  maxlength?: string;
  error?: string;
  successMessage?: string;
}
