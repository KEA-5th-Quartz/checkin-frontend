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
  // 템플릿 목록 조회
  getTemplateList(membersId: number | null, page?: number, size?: number) {
    const params = new URLSearchParams();

    if (page) params.append('page', page.toString());
    if (size) params.append('size', size.toString());

    return api.get(`/members/${membersId}/templates?${params.toString()}`);
  },
  // 템플릿 상세 조회
  getTemplateDetail(templateId: number) {
    return api.get(`/members/templates/${templateId}`);
  },
  // 템플릿 다중 삭제
  deleteTemplates(data: { templateIds: number[] }) {
    return api.delete('/members/templates', { data });
  },
  // 템플릿 수정
  putTemplate(
    templateId: number,
    data: { title: string; firstCategory: string; secondCategory: string; content: string; attachmentIds: number[] },
  ) {
    return api.put(`/members/templates/${templateId}`, data);
  },
};
