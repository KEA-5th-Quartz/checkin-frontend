import api from '@/api/axios';

export const templateApi = {
  // 사용자가 티켓 템플릿 생성
  postTemplates(data: {
    title: string;
    firstCategory: string;
    secondCategory: string;
    content: string;
    attachmentIds: number[];
  }) {
    return api.post('/members/templates', data);
  },
};
