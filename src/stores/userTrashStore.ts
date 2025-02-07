import { defineStore } from 'pinia';

export const useUserTrashListStore = defineStore('user-trash-list', {
  // 함수로 작성하여 각 스토어 인스턴스가 독립적으로 동작하게
  state: () => ({
    selectedTickets: new Set<number>(), // 선택된 티켓들의 ID를 저장하는 set객체
  }),
  // actions: 상태를 변경할 수 있는 메서드들 정의
  actions: {
    addSelectedTicket(id: number) {
      this.selectedTickets.add(id); // id를 set에 추가
    },
    removeSelectedTicket(id: number) {
      this.selectedTickets.delete(id); // id를 set에서 제거
    },
    clearSelectedTickets() {
      this.selectedTickets.clear(); // 선택한 모든 id 초기화
    },
  },
});
