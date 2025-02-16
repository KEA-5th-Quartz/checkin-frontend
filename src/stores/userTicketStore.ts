import { defineStore } from 'pinia';

export interface Ticket {
  title: string;
  firstCategory: string;
  secondCategory: string;
  due_date: string;
  content: string;
  attachmentIds?: () => [];
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
    originalTicket: null as Ticket | null,
    isEditMode: false,
  }),

  actions: {
    setTicket(ticket: Ticket) {
      this.ticket = { ...ticket };
      this.originalTicket = { ...ticket };
    },

    updateTicket(updatedTicket: Ticket) {
      this.ticket = { ...updatedTicket };
    },

    toggleEditMode() {
      this.isEditMode = !this.isEditMode;
    },

    resetToOriginal() {
      if (this.originalTicket) {
        this.ticket = { ...this.originalTicket };
      }
    },
  },
});
