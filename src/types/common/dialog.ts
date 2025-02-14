export interface OverlayProps {
  onClick?: () => void;
}

export interface DialogProps {
  open?: boolean;
  isOneBtn?: boolean;
  placeholder?: string;
  isWarn?: boolean;
  title: string;
  content?: string;
  cancelText?: string;
  onCancelClick?: () => void;
  mainText: string;
  onMainClick: (inputValue?: string) => void;
}

export const initialDialog = {
  open: false,
  placeholder: '',
  isWarn: false,
  title: '',
  content: '',
  cancelText: '',
  onCancelClick: () => undefined,
  mainText: '',
  onMainClick: () => undefined,
};
