import * as yup from 'yup';
import { addMonths } from 'date-fns';

export const ticketEditValidationSchema = yup.object({
  title: yup
    .string()
    .required('* 제목을 입력하세요')
    .trim()
    .test('no-only-whitespace', '* 공백만 입력할 수 없습니다', (val) => val?.trim().length !== 0)
    .max(25, '* 제목은 최대 25자까지 입력 가능합니다')
    .matches(/^[^\s]+(\s+[^\s]+)*$/, '* 공백만 입력할 수 없습니다')
    .matches(/^[\p{L}\p{N}\p{P}\p{Z}]+$/u, '* 특수문자는 사용할 수 없습니다'),

  firstCategory: yup.string().required('* 1차 카테고리를 선택하세요'),

  secondCategory: yup.string().required('* 2차 카테고리를 선택하세요'),

  content: yup
    .string()
    .trim()
    .required('* 요청사항을 입력하세요')
    .min(10, '* 요청사항은 최소 10자 이상이어야 합니다')
    .max(100, '* 요청사항은 최대 100자까지 입력 가능합니다')
    .matches(/^[^\s]+(\s+[^\s]+)*$/, '* 공백만 입력할 수 없습니다'),
  due_date: yup
    .string()
    .required('* 날짜를 입력해주세요')
    .test('is-future-date', '* 과거 날짜는 선택할 수 없습니다', (value) => {
      if (!value) return false;
      // '/' 또는 '-' 형식 모두 처리
      const formattedDate = value.replace(/\//g, '-');
      return new Date(formattedDate) >= new Date(new Date().toISOString().split('T')[0]);
    })
    .test('is-within-one-months', '* 마감 기한은 1개월 이내여야 합니다', (value) => {
      if (!value) return false;
      const formattedDate = value.replace(/\//g, '-');
      return new Date(formattedDate) <= addMonths(new Date(), 1);
    }),

  attachments: yup
    .mixed()
    .test('fileSize', '* 첨부파일 크기는 개당 10MB 이하여야 합니다.', (value) => {
      if (!value) return true; // 파일이 없으면 검사 통과
      const files = Array.isArray(value) ? value : [value];
      return files.every((file) => (file as File).size <= 10 * 1024 * 1024); // 10MB 이하
    })
    .test('fileType', '* 허용되지 않는 파일 형식입니다.', (value) => {
      if (!value) return true;

      //  허용할 파일 확장자 목록 (이미지, 문서, 압축 파일 포함)
      const allowedTypes = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/webp', // 이미지 파일
        'application/pdf',
        'application/msword', // PDF, Word 문서
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xls, .xlsx
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .ppt, .pptx
        'application/zip',
        'application/x-rar-compressed',
        'application/x-7z-compressed', // ZIP, RAR, 7z
      ];

      const files = Array.isArray(value) ? value : [value];
      return files.every((file) => allowedTypes.includes((file as File).type));
    }),
});
