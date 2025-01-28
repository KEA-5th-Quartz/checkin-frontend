import api from '@/api/axios';

export const ticketApi = {
  // [담당자] 전체 담당자 티켓 목록 조회
  getTickets(
    statuses?: string,
    usernames?: string,
    categories?: string,
    priorities?: string,
    dueToday?: boolean,
    dueThisWeek?: boolean,
    page?: number,
    size?: number,
  ) {
    const params = new URLSearchParams();

    // 값이 있는 경우에만 파라미터 추가
    if (statuses) params.append('statuses', statuses);
    if (usernames) params.append('usernames', usernames);
    if (categories) params.append('categories', categories);
    if (priorities) params.append('priorities', priorities);
    if (dueToday) params.append('dueToday', dueToday.toString());
    if (dueThisWeek) params.append('dueThisWeek', dueThisWeek.toString());
    if (page) params.append('page', page.toString());
    if (size) params.append('size', size.toString());

    const queryString = params.toString();
    return api.get(`/tickets${queryString ? `?${queryString}` : ''}`);
  },
};
