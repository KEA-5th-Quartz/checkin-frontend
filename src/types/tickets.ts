export interface BaseTicketOption {
  id: number | string;
  value: string;
  label: string;
  profilePic?: string;
  secondCategories?: BaseTicketOption[];
}

export interface StatusTicketOption extends BaseTicketOption {
  bg: string;
  text: string;
}

export interface DropdownProps {
  options: BaseTicketOption[];
  selectedOption: BaseTicketOption | undefined;
  label: string;
  hasColor?: boolean;
  onOptionSelect?: (option: BaseTicketOption) => void;
  isEdit?: boolean;
  my_ref?: null;
  disabled?: boolean;
  isManager?: boolean;
}

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

export interface CommentMember {
  memberId: number;
  username: string;
  profilePic: string;
}

export interface AttachedFile {
  commentId: number;
  attachmentUrl: string;
  isImage: boolean;
}

export interface AttachmentResponse {
  data: AttachedFile;
}

export interface AttachedResponse {
  attachmentid: string;
  id: number;
}
