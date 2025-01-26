import { defineStore } from 'pinia';

export interface Template {
  title: string;
  firstCategory: string;
  secondCategory: string;
  due_date: string;
  content: string;
}

const defaultTemplate: Template = {
  title: '',
  firstCategory: '',
  secondCategory: '',
  due_date: '',
  content: '',
};

export const useTemplateStore = defineStore('template', {
  state: () => ({
    template: defaultTemplate as Template,
    originalTicket: null as Template | null, // 원본 데이터 저장용
    isEditMode: false,
  }),

  actions: {
    setTemplate(template: Template) {
      this.template = { ...template };
      this.originalTicket = { ...template }; // 원본 데이터 저장
    },

    updateTicket(updatedTicket: Template) {
      this.template = { ...updatedTicket };
    },

    toggleEditMode() {
      this.isEditMode = !this.isEditMode;
    },

    resetToOriginal() {
      if (this.originalTicket) {
        this.template = { ...this.originalTicket }; // 원본 데이터로 복원
      }
    },
  },
});
