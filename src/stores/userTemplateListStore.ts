import { defineStore } from 'pinia';

export const useUserTemplateListStore = defineStore('user-template-list', {
  state: () => ({
    isDeleteMode: false,
    selectedTemplates: new Set<number>(),
  }),

  actions: {
    toggleDeleteMode() {
      this.isDeleteMode = !this.isDeleteMode;
    },
    addSelectedTemplate(id: number) {
      this.selectedTemplates.add(id);
    },
    removeSelectedTemplate(id: number) {
      this.selectedTemplates.delete(id);
    },
    clearSelectedTemplates() {
      this.selectedTemplates.clear();
    },
  },
});
