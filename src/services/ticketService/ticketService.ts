import api from '@/api/axios';

export const ticketApi = {
  // [담당자] 전체 담당자 티켓 목록 조회
  getTickets(
    statuses?: string[],
    usernames?: string[],
    categories?: string[],
    dueToday?: boolean,
    dueThisWeek?: boolean,
    page?: number,
    size?: number,
  ) {
    const params = new URLSearchParams();

    if (statuses?.length) {
      statuses.forEach((status) => {
        params.append('statuses', decodeURIComponent(status));
      });
    }
    if (usernames?.length) {
      usernames.forEach((username) => {
        params.append('usernames', decodeURIComponent(username));
      });
    }
    if (categories?.length) {
      categories.forEach((category) => {
        params.append('categories', decodeURIComponent(category));
      });
    }

    if (dueToday) params.append('dueToday', dueToday.toString());
    if (dueThisWeek) params.append('dueThisWeek', dueThisWeek.toString());
    if (page) params.append('page', page.toString());
    if (size) params.append('size', size.toString());

    return api.get(`/tickets?${params.toString()}`);
  },
  // [담당자, 사용자] 티켓 상세 조회
  getTicketDetail(ticketId: number) {
    return api.get(`/tickets/${ticketId}`);
  },
  // [담당자, 사용자] 티켓의 로그와 댓글 전체 조회
  getTicketComments(ticketId: number) {
    return api.get(`/tickets/${ticketId}/comments`);
  },
  // [담당자] 티켓 상태 변경 (생성 -> 진행중)
  patchTicketInProgress(ticketId: number, data: { status: string }) {
    return api.patch(`/tickets/${ticketId}/assign`, data);
  },
  // [담당자] 티켓 상태 변경 (진행중 -> 완료)
  patchTicketClose(ticketId: number) {
    return api.patch(`/tickets/${ticketId}/close`);
  },
  // [담당자] 티켓 1차 카테고리 수정
  patchTicketFirstCategory(ticketId: number, data: { firstCategory: string }) {
    return api.patch(`/tickets/${ticketId}/category`, data);
  },
  // [담당자] 티켓 2차 카테고리 수정
  patchTicketSecondCategory(ticketId: number, firstCategoryId: number, data: { secondCategory: string }) {
    return api.patch(`/tickets/${ticketId}/${firstCategoryId}/category`, data);
  },
  // [담당자] 티켓의 담당자 변경
  patchTicketReassign(ticketId: number, data: { manager: string }) {
    return api.patch(`/tickets/${ticketId}/reassign`, data);
  },
  // [담당자] 티켓의 중요도 변경
  patchTicketPriority(ticketId: number, data: { priority: string }) {
    return api.patch(`/tickets/${ticketId}/priority`, data);
  },
  // [담당자] 제목 또는 내용으로 검색
  getSearchTicekts(keyword: string, page?: number, size?: number) {
    const params = new URLSearchParams();

    if (page) params.append('page', page.toString());
    if (size) params.append('size', size.toString());

    return api.get(`/tickets/search?keyword=${keyword}&${params.toString()}`);
  },
};
