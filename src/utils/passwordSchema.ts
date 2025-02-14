import * as yup from 'yup';

export const schema = yup.object({
  originalPwd: yup.string().required('현재 비밀번호를 입력해주세요.'),
  newPwd: yup
    .string()
    .required('비밀번호를 입력해주세요.')
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
    .max(20, '비밀번호는 최대 20자입니다.')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~`!@#$%^&*()_\-+={[\]}|\\:;"'<,>.?/])[A-Za-z\d~`!@#$%^&*()_\-+={[\]}|\\:;"'<,>.?/]{8,20}$/,
      '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
    ),
  checkPwd: yup
    .string()
    .required('비밀번호 확인을 입력해주세요.')
    .oneOf([yup.ref('newPwd')], '비밀번호가 일치하지 않습니다.'),
});
