export const primaryCategories = [
  { id: 1, name: '인프라검토' },
  { id: 2, name: 'VM' },
  { id: 3, name: 'NFS' },
  { id: 4, name: 'DNS' },
];

export const SecondaryCategories = [
  { id: 1, parentId: 1, name: '생성' },
  { id: 2, parentId: 1, name: '삭제' },
  { id: 3, parentId: 1, name: '변경' },
  { id: 4, parentId: 1, name: '기타' },
  { id: 5, parentId: 2, name: '설정' },
  { id: 6, parentId: 2, name: '배포' },
  { id: 7, parentId: 3, name: '공유' },
];
