export const isImageFile = (fileUrl: string): boolean => {
  const extension = fileUrl.split('.').pop()?.toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif'].includes(extension || '');
};

export const getFileType = (fileUrl: string): string => {
  const extension = fileUrl.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return '첨부 이미지';
    case 'pdf':
      return '첨부 PDF';
    case 'csv':
      return '첨부 CSV';
    case 'xml':
      return '첨부 XML';
    default:
      return '첨부 파일';
  }
};
