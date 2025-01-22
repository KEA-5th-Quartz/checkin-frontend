export interface BaseTicketOption {
  id: number;
  value: string;
  label: string;
}

export interface TestTicketOption extends BaseTicketOption {
  bg?: string;
  text?: string;
}

export interface StatusTicketOption extends BaseTicketOption {
  bg: string;
  text: string;
}

export interface DropdownProps {
  options: BaseTicketOption[];
  selectedOption: BaseTicketOption;
  label: string;
  hasColor?: boolean;
  onOptionSelect?: (option: BaseTicketOption) => void;
  isUser?: boolean;
}
