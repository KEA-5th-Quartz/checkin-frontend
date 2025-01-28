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
};
