import { defineStore } from 'pinia';

export interface Template {
  title: string;
  firstCategory: string;
  secondCategory: string;
  content: string;
}

const defaultTemplate: Template = {
  title: '',
  firstCategory: '',
  secondCategory: '',
  content: '',
};

export const useTemplateStore = defineStore('template', {
  state: () => ({
    template: defaultTemplate as Template,
    originalTicket: null as Template | null,
    isEditMode: false,
  }),

  actions: {
    setTemplate(template: Template) {
      this.template = { ...template };
      this.originalTicket = { ...template };
    },

    updateTemplate(updateTemplate: Template) {
      this.template = { ...updateTemplate };
    },

    toggleEditMode() {
      this.isEditMode = !this.isEditMode;
    },

    resetToOriginal() {
      if (this.originalTicket) {
        this.template = { ...this.originalTicket };
      }
    },
  },
});
