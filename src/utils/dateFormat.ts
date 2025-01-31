// 2025-01-20T05:34:02 -> 2025/01/20
export const formatSlashDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}`;
};

// 2025/01/30 -> 2025-01-30
export const formatMinusDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('/');
  return `${year}-${month}-${day}`;
};
