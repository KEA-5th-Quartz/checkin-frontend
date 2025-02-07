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
    order?: string,
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
    if (order) params.append('order', order.toString());

    return api.get(`/tickets?${params.toString()}`);
  },
  // [사용자] 전체 사용자 티켓 목록 조회
  getUserTickets(statuses?: string[], categories?: string[], page?: number, size?: number, order?: string) {
    const params = new URLSearchParams();

    if (statuses?.length) {
      statuses.forEach((status) => {
        params.append('statuses', decodeURIComponent(status));
      });
    }

    if (categories?.length) {
      categories.forEach((category) => {
        params.append('categories', decodeURIComponent(category));
      });
    }
    if (page) params.append('page', page.toString());
    if (size) params.append('size', size.toString());
    if (order) params.append('order', order.toString());

    return api.get(`/tickets/my-tickets?${params.toString()}`);
  },
  // [담당자, 사용자] 티켓 상세 조회
  getTicketDetail(ticketId: number) {
    return api.get(`/tickets/${ticketId}`);
  },
  // [담당자, 사용자] 티켓의 로그와 댓글 전체 조회
  getTicketComments(ticketId: number) {
    return api.get(`/tickets/${ticketId}/comments`);
  },
  // [담당자, 사용자] 티켓 댓글 작성
  postTicketComments(ticketId: number, data: { content: string }) {
    return api.post(`/tickets/${ticketId}/comments`, data);
  },
  // [담당자, 사용자] 댓글 좋아요 토글
  putCommentsLikes(ticketId: number, commentId: number) {
    return api.put(`/tickets/${ticketId}/comments/${commentId}/likes`);
  },
  // [담당자, 사용자] 댓글 좋아요 누른 멤버 조회
  getCommentsLikes(ticketId: number, commentId: number) {
    return api.get(`/tickets/${ticketId}/comments/${commentId}/likes`);
  },
  // [담당자, 사용자] 티켓 댓글에 파일 첨부
  postTicketAttachment(ticketId: number, data: { file: FormData }) {
    return api.post(`/tickets/${ticketId}/comments/attachment`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
    return api.patch(`/tickets/${ticketId}/category/${firstCategoryId}`, data);
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
  // [사용자] 제목 또는 내용으로 검색
  getSearchUserTickets(keyword: string, page?: number, size?: number) {
    const params = new URLSearchParams();

    if (page) params.append('page', page.toString());
    if (size) params.append('size', size.toString());

    return api.get(`/tickets/my-tickets/search?keyword=${keyword}&${params.toString()}`);
  },
  // [사용자] 티켓 생성 요청
  postTicket(
    title: string,
    firstCategory: string,
    secondCategory: string,
    content: string,
    dueDate: string,
    attachmentIds: number[],
  ) {
    return api.post(`/tickets`, {
      title,
      firstCategory,
      secondCategory,
      content,
      dueDate,
      attachmentIds,
    });
  },
  // [사용자] 티켓 다중 삭제
  patchTickets(data: { ticketIds: number[] }) {
    return api.patch('/tickets', data);
  },
  // [사용자] 휴지통 목록 조회
  getTrashTickets({ page, size }: { page: number; size: number }) {
    return api.get(`/tickets/trash?page=${page}&size=${size}`);
  },
  // [사용자] 휴지통 티켓 다중 복구
  patchTrashTicket(data: { ticketIds: number[] }) {
    return api.patch('/tickets/trash/restore', data);
  },
  // [사용자] 휴지통 티켓 다중 삭제
  deleteTrashTickets(data: { ticketIds: number[] }) {
    return api.delete('/tickets', { data });
  },
  // [사용자] 티켓 수정
  puTicket(
    ticketId: number,
    data: {
      title: string;
      firstCategory: string;
      secondCategory: string;
      content: string;
      dueDate: string;
      attachmentIds: number[];
    },
  ) {
    return api.put(`/tickets/${ticketId}`, data);
  },
  // [사용자] 티켓 생성시 파일 첨부
  postAttachment(data: FormData) {
    return api.post('/tickets/attachment', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  // [담당자, 사용자] 티켓 첨부 파일 다운로드
  getTicketAttachment(ticketId: string, attachmentId: string) {
    return api.get(`/tickets/${ticketId}/{attachmentUrl}?attachmentUrl=${attachmentId}`);
  },
};
