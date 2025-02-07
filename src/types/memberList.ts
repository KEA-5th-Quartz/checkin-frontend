export interface MemberListItem {
  memberId: number;
  username: string;
  email: string;
  profilePic: string;
  role: 'ADMIN' | 'MANAGER' | 'USER';
}

export interface MemberListResponse {
  status: number;
  data: {
    page: number;
    size: number;
    totalPages: number;
    totalMembers: number;
    members: MemberListItem[];
  };
}
