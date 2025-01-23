import { defineStore } from 'pinia';

export interface Ticket {
  title: string;
  firstCategory: string;
  secondCategory: string;
  due_date: string;
  content: string;
}

const defaultTicket: Ticket = {
  title: '',
  firstCategory: '',
  secondCategory: '',
  due_date: '',
  content: '',
};

export const useTicketStore = defineStore('ticket', {
  state: () => ({
    ticket: defaultTicket as Ticket,
    originalTicket: null as Ticket | null, // 원본 데이터 저장용
    isEditMode: false,
  }),

  actions: {
    setTicket(ticket: Ticket) {
      this.ticket = { ...ticket };
      this.originalTicket = { ...ticket }; // 원본 데이터 저장
    },

    updateTicket(updatedTicket: Ticket) {
      this.ticket = { ...updatedTicket };
    },

    toggleEditMode() {
      this.isEditMode = !this.isEditMode;
    },

    resetToOriginal() {
      if (this.originalTicket) {
        this.ticket = { ...this.originalTicket }; // 원본 데이터로 복원
      }
    },
  },
});
