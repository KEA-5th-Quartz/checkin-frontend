export interface BaseTicketOption {
  id: number | string;
  value: string;
  label: string;
  profilePic?: string;
  secondCategories?: BaseTicketOption[];
  firstCategory?: string;
  secondCategory?: string;
  content?: string;
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

export interface CommentMember {
  memberId: number;
  username: string;
  profilePic: string;
}

// 파일 첨부
export interface AttachedFile {
  commentId: number;
  attachmentUrl: string;
  isImage: boolean;
}

export interface AttachmentResponse {
  data: AttachedFile;
}

// 티켓 생성 파일첨부 응답
export interface AttachedResponse {
  attachmentid: string;
  id: number;
}
