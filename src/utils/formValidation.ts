import * as yup from 'yup';

export const templateValidationSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required('* 제목을 입력하세요')
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
    .max(256, '* 요청사항은 최대 256자까지 입력 가능합니다')
    .matches(/^[^\s]+(\s+[^\s]+)*$/, '* 공백만 입력할 수 없습니다')
    .matches(/^(?!.*<script>).*$/, '* HTML 태그를 포함할 수 없습니다'),
});
