import { defineStore } from 'pinia';

export const useUserTemplateListStore = defineStore('user-template-list', {
  // 함수로 작성하여 각 스토어 인스턴스가 독립적으로 동작하게
  state: () => ({
    isDeleteMode: false, // 초기값
    selectedTemplates: new Set<number>(), // 선택된 티켓들의 ID를 저장하는 set객체
  }),
  // actions: 상태를 변경할 수 있는 메서드들 정의
  actions: {
    toggleDeleteMode() {
      this.isDeleteMode = !this.isDeleteMode;
    },
    addSelectedTemplate(id: number) {
      this.selectedTemplates.add(id); // id를 set에 추가
    },
    removeSelectedTemplate(id: number) {
      this.selectedTemplates.delete(id); // id를 set에서 제거
    },
    clearSelectedTemplates() {
      this.selectedTemplates.clear(); // 선택한 모든 id 초기화
    },
  },
});
