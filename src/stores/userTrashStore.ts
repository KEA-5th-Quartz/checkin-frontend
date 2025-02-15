import { defineStore } from 'pinia';

export const useUserTrashListStore = defineStore('user-trash-list', {
  state: () => ({
    selectedTickets: new Set<number>(),
  }),

  actions: {
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
