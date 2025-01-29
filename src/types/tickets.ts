export interface BaseTicketOption {
  id: number;
  value: string;
  label: string;
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
  isEdit?: boolean;
  my_ref?: null;
  disabled?: boolean;
}

// 티켓 타입
export interface Ticket {
  ticketId: number;
  title: string;
  firstCategory: string;
  secondCategory: string;
  manager: string;
  content: string;
  dueDate: string;
  priority: 'EMERGENCY' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
}
