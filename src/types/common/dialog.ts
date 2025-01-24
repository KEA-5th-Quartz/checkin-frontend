export interface OverlayProps {
  onClick?: () => void;
}

export interface DialogProps {
  open?: boolean;
  isOneBtn?: boolean;
  hasInput?: boolean;
  placeholder?: string;
  isWarn?: boolean;
  title: string;
  content?: string;
  cancelText?: string;
  onCancelClick?: () => void;
  mainText: string;
  onMainClick: (inputValue?: string) => void;
}

// 다이얼로그 초기값
export const initialDialog = {
  open: false,
  hasInput: false,
  placeholder: '',
  isWarn: false,
  title: '',
  content: '',
  cancelText: '',
  onCancelClick: () => undefined,
  mainText: '',
  onMainClick: () => undefined,
};
