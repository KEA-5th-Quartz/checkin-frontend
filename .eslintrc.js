module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true, // Vue 3 <script setup> 매크로 지원
  },
  // 전역 변수 설정 (Vue 3의 <script setup> 매크로들, 읽기 전용)
  globals: {
    defineProps: 'readonly', // props 정의
    defineEmits: 'readonly', // emit 정의
    defineExpose: 'readonly', // 컴포넌트 외부 노출 속성 정의
    withDefaults: 'readonly', // props 기본값 설정
  },
  // ESLint 설정을 확장
  extends: [
    'plugin:vue/vue3-essential', // Vue 3 필수 규칙
    'eslint:recommended', // ESLint 추천 규칙
    '@vue/typescript/recommended', // TypeScript 추천 규칙
    'plugin:prettier/recommended', // Prettier 통합 규칙
  ],
  // 파서 옵션 설정
  parserOptions: {
    ecmaVersion: 2020, // ECMAScript 2020 문법 사용
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto', // 운영체제에 따라 줄바꿈 문자를 자동으로 설정 (Windows: CRLF, Linux/Mac: LF)
        singleQuote: true, // 문자열에 작은따옴표 사용 ("대신 '를 사용)
        semi: true, // 문장 끝에 세미콜론 사용
        useTabs: false, // 탭 대신 스페이스 사용 false
        tabWidth: 2, // 들여쓰기 너비를 2칸으로 설정
        trailingComma: 'all', // 객체나 배열의 마지막 항목에도 콤마 추가
        printWidth: 120, // 한 줄의 최대 길이를 120자로 제한
        arrowParens: 'always', // 화살표 함수의 매개변수를 항상 괄호로 감싸기 (x => x 대신 (x) => x 사용)
      },
    ],
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
};
