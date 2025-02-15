import { DialogProps, initialDialog } from '@/types/common/dialog';
import { Ref } from 'vue';

export const handleError = (dialogState: Ref<DialogProps>, errorMessage: string): DialogProps => {
  return {
    open: true,
    isOneBtn: true,
    title: '예상치 못한 문제가 발생했습니다.',
    content: errorMessage,
    mainText: '확인',
    onMainClick: () => {
      dialogState.value = { ...initialDialog };
    },
  };
};
