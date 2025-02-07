export type MemberType = 'ADMIN' | 'MANAGER' | 'USER';

export interface MemberState {
  memberId: number | null;
  username: string;
  profilePic: string;
  role: string | MemberType;
  email: string;
  accessToken: string;
  passwordResetToken: string | null;
  isLoggedOut?: boolean;
}
