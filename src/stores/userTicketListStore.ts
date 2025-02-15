import { defineStore } from 'pinia';

export const useUserTicketListStore = defineStore('user-ticket-list', {
  state: () => ({
    isDeleteMode: false,
    selectedTickets: new Set<number>(),
  }),

  actions: {
    toggleDeleteMode() {
      this.isDeleteMode = !this.isDeleteMode;
    },
    addSelectedTicket(id: number) {
      this.selectedTickets.add(id);
    },
    removeSelectedTicket(id: number) {
      this.selectedTickets.delete(id);
    },
    clearSelectedTickets() {
      this.selectedTickets.clear();
    },
  },
});
