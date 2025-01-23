export interface OverlayProps {
  onClick?: () => void;
}

export interface DialogProps {
  isOneBtn?: boolean;
  hasInput?: boolean;
  placeholder?: string;
  isWarn?: boolean;
  title: string;
  content?: string;
  cancelText?: string;
  onCalcelClick?: () => void;
  mainText: string;
  onMainClick: (inputValue?: string) => void;
}
