# ✨ CheckIn

## 프로젝트 소개
- 카카오엔터프라이즈 5기 기업 실무 프로젝트에서 진행하는 협업 프로젝트입니다.
- TMS(Ticket Management System)을 개발합니다.

#### 서비스 배포 주소
- [kc.quartz-checkin.xyz](https://kc.quartz-checkin.xyz/)

#### 개발 기간
- 팀 구성 및 기획
  2025.01.06 ~ 2025.01.19
- 프로젝트 개발
  2025.01.20 ~ 2025.02.07
- QA
  2025.02.08 ~ 2025.02.18

  
## 🧑‍💻 개발자 소개
|<img src="https://github.com/user-attachments/assets/3ae3d63a-3706-4aa2-9ff0-8db94d661436" width="150px" height="200px" />|<img src="https://github.com/user-attachments/assets/0701bd84-45bc-4391-9b06-16cf6d8d9468" width="150px" height="200px" />|<img src="https://github.com/user-attachments/assets/d0908b15-9ffe-45d2-acc4-7528227d444c" width="150px" height="200px" />|
|:---:|:---:|:---:|
|**김현중(PL)**|**박석종**|**박준한**|
|Frontend Developer|Frontend Developer|Frontend Developer|
|[GitHub](https://github.com/kimgorok) | [GitHub](https://github.com/PSeokJong) | [GitHub](https://github.com/viola30th)|

## 🤖 개발 환경 설정

### ⚙️ Node 버전과 패키지 매니저
- Node.js: v22.13.1
- 패키지 매니저: npm

### 🔐 환경 변수
프로젝트 실행을 위해 루트 디렉토리에 `.env` 파일을 생성하고 다음 환경 변수를 설정해주세요:

`VUE_APP_BASE_URL='https://api.quartz-checkin.xyz'`

## 🛠️ 기술 스택

### 언어

<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">

#### 프레임워크

<img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D"> 

### 스타일링

<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"> <img src="https://img.shields.io/badge/CSS-239120?&style=for-the-badge&logo=css3&logoColor=white">

#### 라이브러리

- **Pinia** (로컬 상태 관리)

- **vueRouter** (라우팅 라이브러리)

- **TanStack Query(VueQuery)** (강력한 서버 상태 관리 및 데이터 동기화 라이브러리)

- **VeeValidate** (폼 유효성 검사)

- **VueUse** (Vue Composition API 유틸리티 컬렉션)

- **apex-chart** (차트 UI)

- **yup** (스키마 기반 유효성 검증)

- **date-fns** (날짜 관리 유틸리티 라이브러리)


### 데이터 프로세싱

<img src="https://img.shields.io/badge/AXIOS-5A29E4?style=for-the-badge&logo=axios&logoColor=white">

#### 코드 포매터 및 검사 도구

<img src="https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white"> <img src="https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E"> 

#### 협업툴

<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"> <img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white"> <img src="https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=Jira&logoColor=white"> <img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white">

## 💻 주요 기능
**1. 대시보드**

https://github.com/user-attachments/assets/728edc9c-d8a0-4810-8742-67701a59d3cf

- 헤더를 통해 현재 티켓 상황 파악 가능
- 검색, 정렬, 개수 조절, 다양한 필터링, 페이지네이션 기능 제공
- 티켓 선택 시 상세로 연결

**2. 티켓 생성 및 관리**

https://github.com/user-attachments/assets/8b0e6a98-10ef-4b32-9d3e-904045622e84

- 저장된 템플릿 불러오기 가능
- 각 카테고리 별 요청사항 가이드 추가
- 생성된 티켓은 모든 담당자 목록에 표시됨

**3. 템플릿 생성 및 사용**

https://github.com/user-attachments/assets/26747fa4-70c6-4ce3-a20b-379b7e1d72e6

 - 템플릿 생성 및 수정 가능
 - 템플릿 목록에서 템플릿 상세 조회 가능
 - 티켓 생성 화면에서 작성한 템플릿 불러오기 가능
  
**4. 티켓 내부 채팅**

https://github.com/user-attachments/assets/fd725d5b-ed54-46b3-9ae7-6afff438d464

 - 사용자와 담당자의 실시간 채팅 기능
 - 각 말풍선에 좋아요 버튼을 누를 수 있고, 좋아요를 누른 사용자 조회 가능
 - 채팅창에서 업데이트 로그 확인 가능능

**5. 통계 조회**

https://github.com/user-attachments/assets/d241a0c1-9f39-4454-8ebd-fabdbfe62c90

 - 각종 통계를 차트 및 표를 통해 확인 가능
 - 차트를 이미지 혹은 .csv 파일로 다운로드 가능


     
