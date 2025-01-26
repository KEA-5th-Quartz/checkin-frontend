export type MemberType = 'ADMIN' | 'MANAGER' | 'USER';

export interface MemberState {
  memberId: number | null;
  username: string;
  profilePic: string;
  role: string;
  accessToken: string;
  passwordChangedAt: string | null;
}
