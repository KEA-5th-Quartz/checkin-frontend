export const roleInKorean = (role: string): string => {
  const roleMap: Record<string, string> = {
    ADMIN: '관리자',
    MANAGER: '담당자',
    USER: '사용자',
  };

  return roleMap[role] || role;
};
