import * as yup from 'yup';
import { addMonths } from 'date-fns';

export const ticketValidationSchema = yup.object({
  title: yup
    .string()
    .required('* 제목을 입력하세요')
    .trim()
    .test('no-only-whitespace', '* 공백만 입력할 수 없습니다', (val) => val?.trim().length !== 0)
    .max(25, '* 제목은 최대 25자까지 입력 가능합니다')
    .matches(/^[^\s]+(\s+[^\s]+)*$/, '* 공백만 입력할 수 없습니다')
    .matches(/^[\p{L}\p{N}\p{P}\p{Z}]+$/u, '* 특수문자는 사용할 수 없습니다'),

  firstCategory: yup
    .object()
    .shape({
      id: yup.number().required(),
      value: yup.string().required('* 1차 카테고리를 선택하세요'),
      label: yup.string().required(),
    })
    .required('* 1차 카테고리를 선택하세요'),

  secondCategory: yup
    .object()
    .shape({
      id: yup.number().required(),
      value: yup.string().required('* 2차 카테고리를 선택하세요'),
      label: yup.string().required(),
    })
    .required('* 2차 카테고리를 선택하세요'),

  content: yup
    .string()
    .trim()
    .required('* 요청사항을 입력하세요')
    .min(10, '* 요청사항은 최소 10자 이상이어야 합니다')
    .max(100, '* 요청사항은 최대 256자까지 입력 가능합니다')
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
      if (!value) return true;
      const files = Array.isArray(value) ? value : [value];
      return files.every((file) => (file as File).size <= 10 * 1024 * 1024);
    })
    .test('fileType', '* 허용되지 않는 파일 형식입니다.', (value) => {
      if (!value) return true;

      const allowedTypes = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/zip',
        'application/x-rar-compressed',
        'application/x-7z-compressed',
      ];

      const files = Array.isArray(value) ? value : [value];
      return files.every((file) => allowedTypes.includes((file as File).type));
    })
    .test('maxFiles', '* 최대 3개까지 첨부 가능합니다.', (value) => {
      if (!value) return true; // 파일이 없으면 검사 통과
      const files = Array.isArray(value) ? value : [value];
      return files.length <= 3; // ✅ 3개 이하만 허용
    })
    .test('duplicateFiles', '* 이미 업로드한 첨부파일입니다.', (value) => {
      if (!value) return true;

      const files = Array.isArray(value) ? value : [value];
      const fileNames = files.map((file) => (file as File).name);
      const uniqueFileNames = new Set(fileNames);

      return fileNames.length === uniqueFileNames.size; // ✅ 중복 파일 검사
    }),
});
