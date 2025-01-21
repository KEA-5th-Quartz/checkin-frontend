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

export interface DropdownProps<T extends BaseTicketOption> {
  options: T[];
  selectedOption: T;
  label: string;
  hasColor?: boolean;
  onOptionSelect?: (option: T) => void;
}
