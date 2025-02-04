import * as yup from 'yup';
import { addMonths } from 'date-fns';

export const validationSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required('* 제목을 입력하세요')
    .max(25, '* 제목은 최대 25자까지 입력 가능합니다')
    .matches(/^[^\s]+(\s+[^\s]+)*$/, '* 공백만 입력할 수 없습니다')
    .matches(/^[\p{L}\p{N}\p{P}\p{Z}]+$/u, '* 특수문자는 사용할 수 없습니다'),

  firstCategory: yup
    .object()
    .shape({
      firstCategoryId: yup.number().required(), // 실제 API 요청에 필요
      firstCategoryName: yup.string().required('* 1차 카테고리를 선택하세요'), // 사용자에게 보이는 값
    })
    .required('* 1차 카테고리를 선택하세요'),

  secondCategory: yup
    .object()
    .shape({
      secondCategoryId: yup.number().required(),
      secondCategoryName: yup.string().required('* 2차 카테고리를 선택하세요'),
    })
    .required('* 2차 카테고리를 선택하세요'),

  content: yup
    .string()
    .trim()
    .required('* 설명을 입력하세요')
    .min(10, '* 설명은 최소 10자 이상이어야 합니다')
    .max(100, '* 설명은 최대 100자까지 입력 가능합니다')
    .matches(/^[^\s]+(\s+[^\s]+)*$/, '* 공백만 입력할 수 없습니다')
    .matches(/^(?!.*<script>).*$/, '* HTML 태그를 포함할 수 없습니다'),

  dueDate: yup
    .string()
    .required('* 날짜를 입력해주세요')
    .matches(/^\d{4}-\d{2}-\d{2}$/, '* 날짜 형식이 올바르지 않습니다. YYYY-MM-DD 형식으로 입력해주세요')
    .test('is-future-date', '* 과거 날짜는 선택할 수 없습니다', (value) =>
      value ? new Date(value) >= new Date(new Date().toISOString().split('T')[0]) : false,
    )
    .test('is-within-one-months', '* 마감 기한은 1개월 이내여야 합니다', (value) =>
      value ? new Date(value) <= addMonths(new Date(), 1) : false,
    ),

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
