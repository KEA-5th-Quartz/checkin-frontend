import { IconPathTypes } from '@/types/icon';

// 대시보드 아이콘
export const DashboardIcon: IconPathTypes = {
  path: 'M16 2V4H12V2H16ZM6 2V8H2V2H6ZM16 10V16H12V10H16ZM6 14V16H2V14H6ZM18 0H10V6H18V0ZM8 0H0V10H8V0ZM18 8H10V18H18V8ZM8 12H0V18H8V12Z',
  fill: 'white',
  width: 22,
  height: 18,
};

// 타임라인 아이콘
export const TimelineIcon: IconPathTypes = {
  path: 'M16 1.77632H15V0H13V1.77632H5V0H3V1.77632H2C0.9 1.77632 0 2.57566 0 3.55263V15.9868C0 16.9638 0.9 17.7632 2 17.7632H16C17.1 17.7632 18 16.9638 18 15.9868V3.55263C18 2.57566 17.1 1.77632 16 1.77632ZM16 15.9868H2V7.10526H16V15.9868ZM2 5.32895V3.55263H16V5.32895H2ZM7.56 14.6191L13.49 9.3523L12.43 8.41086L7.56 12.7362L5.45 10.8622L4.39 11.8036L7.56 14.6191Z',
  fill: 'white',
  width: 22,
  height: 18,
};

// 통계 아이콘
export const StatisticIcon: IconPathTypes = {
  path: [
    'M8 19C8 19.5523 8.44771 20 9 20C9.55229 20 10 19.5523 10 19V1C10 0.447716 9.55229 0 9 0C8.44771 0 8 0.447716 8 1V19Z',
    'M0 19C0 19.5523 0.447715 20 1 20C1.55228 20 2 19.5523 2 19V9C2 8.44772 1.55228 8 1 8C0.447715 8 0 8.44772 0 9V19Z',
    'M5 20C4.44772 20 4 19.5523 4 19V11C4 10.4477 4.44772 10 5 10C5.55228 10 6 10.4477 6 11V19C6 19.5523 5.55228 20 5 20Z',
    'M12 19C12 19.5523 12.4477 20 13 20C13.5523 20 14 19.5523 14 19V5C14 4.44772 13.5523 4 13 4C12.4477 4 12 4.44772 12 5V19Z',
  ],
  fill: '#FEFEFE',
  width: 22,
  height: 20,
};

// 설정 아이콘
export const SettingIcon: IconPathTypes = {
  path: [
    'M11.0002 8C8.79111 8 7.00024 9.79086 7.00024 12C7.00024 14.2091 8.79111 16 11.0002 16C13.2094 16 15.0002 14.2091 15.0002 12C15.0002 9.79086 13.2094 8 11.0002 8ZM9.00024 12C9.00024 10.8954 9.89567 10 11.0002 10C12.1048 10 13.0002 10.8954 13.0002 12C13.0002 13.1046 12.1048 14 11.0002 14C9.89567 14 9.00024 13.1046 9.00024 12Z',
    'M10.2867 0.5C8.88583 0.5 7.6461 1.46745 7.37171 2.85605L7.29264 3.25622C7.10489 4.20638 6.06195 4.83059 5.04511 4.48813L4.64825 4.35447C3.32246 3.90796 1.83873 4.42968 1.11836 5.63933L0.40492 6.83735C-0.32227 8.05846 -0.0456512 9.60487 1.03927 10.5142L1.35714 10.7806C2.12939 11.4279 2.12939 12.5721 1.35714 13.2194L1.03927 13.4858C-0.045651 14.3951 -0.32227 15.9415 0.404919 17.1626L1.11833 18.3606C1.83872 19.5703 3.3225 20.092 4.64831 19.6455L5.04506 19.5118C6.06191 19.1693 7.1049 19.7935 7.29264 20.7437L7.37172 21.1439C7.6461 22.5325 8.88584 23.5 10.2867 23.5H11.7136C13.1146 23.5 14.3543 22.5325 14.6287 21.1438L14.7077 20.7438C14.8954 19.7936 15.9384 19.1693 16.9553 19.5118L17.3521 19.6455C18.6779 20.092 20.1617 19.5703 20.8821 18.3606L21.5955 17.1627C22.3227 15.9416 22.046 14.3951 20.9611 13.4858L20.6432 13.2194C19.8709 12.5722 19.8709 11.4278 20.6432 10.7806L20.9611 10.5142C22.046 9.60489 22.3227 8.05845 21.5955 6.83732L20.8821 5.63932C20.1617 4.42968 18.678 3.90795 17.3522 4.35444L16.9552 4.48814C15.9384 4.83059 14.8954 4.20634 14.7077 3.25617L14.6287 2.85616C14.3543 1.46751 13.1146 0.5 11.7136 0.5H10.2867ZM9.33378 3.24375C9.41487 2.83334 9.79829 2.5 10.2867 2.5H11.7136C12.2021 2.5 12.5855 2.83336 12.6666 3.24378L12.7456 3.64379C13.1791 5.83811 15.4909 7.09167 17.5935 6.38353L17.9905 6.24984C18.4495 6.09527 18.9394 6.28595 19.1637 6.66264L19.8771 7.86064C20.0946 8.22587 20.0208 8.69271 19.6764 8.98135L19.3586 9.24773C17.6325 10.6943 17.6325 13.3057 19.3586 14.7523L19.6764 15.0186C20.0208 15.3073 20.0946 15.7741 19.8771 16.1394L19.1637 17.3373C18.9394 17.714 18.4495 17.9047 17.9905 17.7501L17.5936 17.6164C15.4909 16.9082 13.1791 18.1618 12.7456 20.3562L12.6666 20.7562C12.5855 21.1666 12.2021 21.5 11.7136 21.5H10.2867C9.7983 21.5 9.41488 21.1667 9.33379 20.7562L9.25471 20.356C8.82113 18.1617 6.50931 16.9082 4.40665 17.6165L4.0099 17.7501C3.55092 17.9047 3.06104 17.714 2.83671 17.3373L2.1233 16.1393C1.9058 15.7741 1.97959 15.3073 2.32398 15.0186L2.64185 14.7522C4.36782 13.3056 4.36781 10.6944 2.64185 9.24779L2.32398 8.98137C1.97959 8.69273 1.9058 8.2259 2.1233 7.86067L2.83674 6.66266C3.06106 6.28596 3.55093 6.09528 4.0099 6.24986L4.40676 6.38352C6.50938 7.09166 8.82112 5.83819 9.2547 3.64392L9.33378 3.24375Z',
  ],
  fill: 'white',
  width: 22,
  height: 24,
};

// 로그아웃 아이콘
export const LogoutIcon: IconPathTypes = {
  path: 'M2.66667 21.3158C1.93333 21.3158 1.30578 21.0841 0.784 20.6207C0.262222 20.1572 0.000888889 19.5995 0 18.9474V2.36842C0 1.71711 0.261333 1.15974 0.784 0.696316C1.30667 0.232895 1.93422 0.000789474 2.66667 0H12V2.36842H2.66667V18.9474H12V21.3158H2.66667ZM17.3333 16.5789L15.5 14.8618L18.9 11.8421H8V9.47368H18.9L15.5 6.45395L17.3333 4.73684L24 10.6579L17.3333 16.5789Z',
  fill: 'white',
  width: 24,
  height: 22,
};

// 집 아이콘
export const HomeIcon: IconPathTypes = {
  path: 'M6 19h3v-6h6v6h3v-9l-6-4.5L6 10zm-2 2V9l8-6l8 6v12h-7v-6h-2v6zm8-8.75',
  fill: 'white',
  width: 22,
  height: 22,
};

// 회원 아이콘
export const MemberIcon: IconPathTypes = {
  path: 'M5.5 7a3 3 0 1 1 6 0a3 3 0 0 1-6 0m3-5a5 5 0 1 0 0 10a5 5 0 0 0 0-10m7 0h-1v2h1a3 3 0 1 1 0 6h-1v2h1a5 5 0 0 0 0-10M0 19a5 5 0 0 1 5-5h7a5 5 0 0 1 5 5v2h-2v-2a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v2H0zm24 0a5 5 0 0 0-5-5h-1v2h1a3 3 0 0 1 3 3v2h2z',
  fill: 'white',
  width: 22,
  height: 22,
};

// 카테고리 아이콘
export const CategoryIcon: IconPathTypes = {
  path: 'M7 9V7h14v2zm0 4v-2h14v2zm0 4v-2h14v2zM4 9q-.425 0-.712-.288T3 8t.288-.712T4 7t.713.288T5 8t-.288.713T4 9m0 4q-.425 0-.712-.288T3 12t.288-.712T4 11t.713.288T5 12t-.288.713T4 13m0 4q-.425 0-.712-.288T3 16t.288-.712T4 15t.713.288T5 16t-.288.713T4 17',
  fill: 'white',
  width: 22,
  height: 22,
};

// 생성 아이콘
export const CreateIcon: IconPathTypes = {
  path: 'M0 2.5C0 1.11929 1.11929 0 2.5 0H17.5C18.8807 0 20 1.11929 20 2.5V17.5C20 18.8807 18.8807 20 17.5 20H2.5C1.11929 20 0 18.8807 0 17.5V2.5ZM10.5 3.5C11.0523 3.5 11.5 3.94772 11.5 4.5V8.5H15.5C16.0523 8.5 16.5 8.94772 16.5 9.5V10.5C16.5 11.0523 16.0523 11.5 15.5 11.5H11.5V15.5C11.5 16.0523 11.0523 16.5 10.5 16.5H9.5C8.94772 16.5 8.5 16.0523 8.5 15.5V11.5H4.5C3.94772 11.5 3.5 11.0523 3.5 10.5V9.5C3.5 8.94772 3.94772 8.5 4.5 8.5H8.5V4.5C8.5 3.94772 8.94772 3.5 9.5 3.5H10.5Z',
  fill: 'white',
  width: 22,
  height: 22,
};

// 경고 아이콘
export const WarningIcon: IconPathTypes = {
  path: 'M9.70151 2.26881C10.7002 0.462807 13.296 0.462807 14.2947 2.26881L23.3317 18.6033C24.3 20.3533 23.0342 22.5 21.0345 22.5H2.96284C0.962006 22.5 -0.303828 20.3533 0.664505 18.6033L9.70151 2.26881ZM13.163 17.8333C13.1679 17.6772 13.1415 17.5217 13.0852 17.3761C13.0288 17.2304 12.9438 17.0976 12.8352 16.9854C12.7265 16.8733 12.5964 16.7841 12.4526 16.7232C12.3088 16.6623 12.1542 16.6309 11.9981 16.6309C11.8419 16.6309 11.6874 16.6623 11.5436 16.7232C11.3998 16.7841 11.2697 16.8733 11.161 16.9854C11.0524 17.0976 10.9673 17.2304 10.911 17.3761C10.8547 17.5217 10.8282 17.6772 10.8332 17.8333C10.8427 18.1359 10.9697 18.4229 11.1871 18.6335C11.4045 18.8441 11.6954 18.9619 11.9981 18.9619C12.3008 18.9619 12.5917 18.8441 12.8091 18.6335C13.0265 18.4229 13.1534 18.1359 13.163 17.8333ZM12.8608 8.67147C12.8306 8.45175 12.7181 8.2517 12.546 8.11179C12.3739 7.97188 12.1551 7.90255 11.9338 7.91781C11.7125 7.93308 11.5053 8.0318 11.354 8.19402C11.2028 8.35624 11.1188 8.56984 11.119 8.79164L11.1237 14.0428L11.1318 14.1618C11.1621 14.3815 11.2746 14.5816 11.4467 14.7215C11.6188 14.8614 11.8376 14.9307 12.0589 14.9155C12.2802 14.9002 12.4874 14.8015 12.6386 14.6393C12.7899 14.477 12.8739 14.2634 12.8737 14.0416L12.869 8.78931L12.8608 8.67147Z',
  fill: '#232D64',
  width: 24,
  height: 24,
  options: {
    stroke: '#FFFFFF',
    fillRule: 'evenodd',
    clipRule: 'evenodd',
  },
};

// 연필 아이콘
export const PencilIcon: IconPathTypes = {
  path: 'M16.4324 2C16.2266 2 16.0227 2.04055 15.8325 2.11933C15.6423 2.19811 15.4695 2.31358 15.3239 2.45914L3.25659 14.5265L2.42524 17.5748L5.47353 16.7434L17.5409 4.67608C17.6864 4.53051 17.8019 4.3577 17.8807 4.16751C17.9595 3.97732 18 3.77348 18 3.56761C18 3.36175 17.9595 3.1579 17.8807 2.96771C17.8019 2.77752 17.6864 2.60471 17.5409 2.45914C17.3953 2.31358 17.2225 2.19811 17.0323 2.11933C16.8421 2.04055 16.6383 2 16.4324 2ZM15.0671 0.271568C15.5 0.0922788 15.9639 0 16.4324 0C16.9009 0 17.3648 0.0922786 17.7977 0.271568C18.2305 0.450858 18.6238 0.713646 18.9551 1.04493C19.2864 1.37621 19.5492 1.7695 19.7285 2.20235C19.9077 2.63519 20 3.09911 20 3.56761C20 4.03611 19.9077 4.50003 19.7285 4.93288C19.5492 5.36572 19.2864 5.75901 18.9551 6.09029L6.69996 18.3454C6.57691 18.4685 6.42387 18.5573 6.25597 18.6031L1.26314 19.9648C0.916928 20.0592 0.546666 19.9609 0.292916 19.7071C0.0391662 19.4534 -0.0591621 19.0831 0.0352593 18.7369L1.39694 13.7441C1.44273 13.5762 1.53154 13.4231 1.6546 13.3001L13.9097 1.04493C14.241 0.713645 14.6343 0.450857 15.0671 0.271568Z',
  fill: '#253C7F',
  width: 20,
  height: 20,
};

// 진행중 아이콘
export const ProgressIcon: IconPathTypes = {
  path: 'M23.3826 7.92388C23.7562 7.7691 23.9999 7.40446 23.9999 7V1C23.9999 0.447716 23.5522 0 22.9999 0H16.9999C16.5954 0 16.2308 0.243643 16.076 0.617317C15.9212 0.990992 16.0068 1.42111 16.2928 1.70711L18.2322 3.64649L13.5 8.37869L9.56062 4.43935C8.97484 3.85356 8.02509 3.85356 7.4393 4.43935L0.646409 11.2322C0.255885 11.6228 0.255885 12.2559 0.646409 12.6465L1.35352 13.3536C1.74404 13.7441 2.3772 13.7441 2.76773 13.3536L8.49996 7.62133L12.4393 11.5607C13.0251 12.1465 13.9748 12.1465 14.5606 11.5607L20.3535 5.76781L22.2928 7.70711C22.5788 7.9931 23.0089 8.07866 23.3826 7.92388Z',
  fill: '#253C7F',
  width: 24,
  height: 14,
};

// 메달 아이콘
export const MedalIcon: IconPathTypes = {
  path: [
    'M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0Z',
    'M2 16.0007C3.67132 17.2561 5.74879 18 8 18C10.2512 18 12.3287 17.2561 14 16.0007V23C14 23.3844 13.7797 23.7348 13.4332 23.9013C13.0867 24.0678 12.6755 24.021 12.3753 23.7809L8 21L3.6247 23.7809C3.32453 24.021 2.91328 24.0678 2.56681 23.9013C2.22035 23.7348 2 23.3844 2 23V16.0007Z',
  ],
  fill: '#253C7F',
  width: 16,
  height: 24,
};

// 책갈피 아이콘
export const BookmarkIcon: IconPathTypes = {
  path: 'M0.949707 3.44975C0.949692 2.06903 2.06898 0.949725 3.4497 0.949723L11.0209 0.949707C11.8165 0.949705 12.5796 1.26578 13.1422 1.82839L21.0417 9.72788C22.6038 11.29 22.6038 13.8226 21.0417 15.3847L15.3848 21.0416C13.8227 22.6037 11.2901 22.6037 9.72796 21.0416L1.82846 13.1421C1.26586 12.5795 0.949792 11.8164 0.949784 11.0208L0.949707 3.44975ZM7.5 8.99988C8.32843 8.99988 9 8.32831 9 7.49988C9 6.67145 8.32843 5.99988 7.5 5.99988C6.67157 5.99988 6 6.67145 6 7.49988C6 8.32831 6.67157 8.99988 7.5 8.99988Z',
  fill: '#253C7F',
  width: 23,
  height: 23,
};

// 돋보기 아이콘
export const SearchIcon: IconPathTypes = {
  path: 'M20.75 20.75L14.0833 14.0833M0.75 8.52778C0.75 9.54917 0.951178 10.5606 1.34205 11.5042C1.73292 12.4478 2.30582 13.3053 3.02806 14.0275C3.75029 14.7497 4.60771 15.3226 5.55135 15.7135C6.49499 16.1044 7.50639 16.3056 8.52778 16.3056C9.54917 16.3056 10.5606 16.1044 11.5042 15.7135C12.4478 15.3226 13.3053 14.7497 14.0275 14.0275C14.7497 13.3053 15.3226 12.4478 15.7135 11.5042C16.1044 10.5606 16.3056 9.54917 16.3056 8.52778C16.3056 7.50639 16.1044 6.49499 15.7135 5.55135C15.3226 4.60771 14.7497 3.75029 14.0275 3.02806C13.3053 2.30582 12.4478 1.73292 11.5042 1.34205C10.5606 0.951178 9.54917 0.75 8.52778 0.75C7.50639 0.75 6.49499 0.951178 5.55135 1.34205C4.60771 1.73292 3.75029 2.30582 3.02806 3.02806C2.30582 3.75029 1.73292 4.60771 1.34205 5.55135C0.951178 6.49499 0.75 7.50639 0.75 8.52778Z',
  fill: 'none',
  width: 22,
  height: 22,
  options: {
    stroke: '#5D5C5C',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 1.5,
  },
};

// 필터 아이콘
export const FilterIcon: IconPathTypes = {
  path: 'M19.25 9.99989H6.895M2.534 9.99989H0.75M2.534 9.99989C2.534 9.42172 2.76368 8.86723 3.17251 8.4584C3.58134 8.04957 4.13583 7.81989 4.714 7.81989C5.29217 7.81989 5.84666 8.04957 6.25549 8.4584C6.66432 8.86723 6.894 9.42172 6.894 9.99989C6.894 10.5781 6.66432 11.1326 6.25549 11.5414C5.84666 11.9502 5.29217 12.1799 4.714 12.1799C4.13583 12.1799 3.58134 11.9502 3.17251 11.5414C2.76368 11.1326 2.534 10.5781 2.534 9.99989ZM19.25 16.6069H13.502M13.502 16.6069C13.502 17.1852 13.2718 17.7403 12.8628 18.1492C12.4539 18.5582 11.8993 18.7879 11.321 18.7879C10.7428 18.7879 10.1883 18.5572 9.77951 18.1484C9.37068 17.7396 9.141 17.1851 9.141 16.6069M13.502 16.6069C13.502 16.0286 13.2718 15.4745 12.8628 15.0655C12.4539 14.6566 11.8993 14.4269 11.321 14.4269C10.7428 14.4269 10.1883 14.6566 9.77951 15.0654C9.37068 15.4742 9.141 16.0287 9.141 16.6069M9.141 16.6069H0.75M19.25 3.39289H16.145M11.784 3.39289H0.75M11.784 3.39289C11.784 2.81472 12.0137 2.26023 12.4225 1.8514C12.8313 1.44257 13.3858 1.21289 13.964 1.21289C14.2503 1.21289 14.5338 1.26928 14.7983 1.37883C15.0627 1.48839 15.3031 1.64897 15.5055 1.8514C15.7079 2.05383 15.8685 2.29415 15.9781 2.55864C16.0876 2.82313 16.144 3.10661 16.144 3.39289C16.144 3.67917 16.0876 3.96265 15.9781 4.22714C15.8685 4.49163 15.7079 4.73195 15.5055 4.93438C15.3031 5.13681 15.0627 5.29739 14.7983 5.40695C14.5338 5.5165 14.2503 5.57289 13.964 5.57289C13.3858 5.57289 12.8313 5.34321 12.4225 4.93438C12.0137 4.52555 11.784 3.97106 11.784 3.39289Z',
  fill: 'none',
  width: 20,
  height: 20,
  options: {
    stroke: '#84818A',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 1.5,
  },
};

// 아래 화살표 아이콘(회전시키며 사용)
export const ArrowDownIcon: IconPathTypes = {
  path: 'M13.77 1.08545L8.60831 6.24712C7.99873 6.8567 7.00123 6.8567 6.39165 6.24712L1.22998 1.08545',
  fill: 'none',
  width: 15,
  height: 8,
  options: {
    stroke: '#84818A',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 1.5,
  },
};

// X 아이콘
export const XIcon: IconPathTypes = {
  path: ['m4.3 2.9l12.8 12.8l-1.4 1.4L2.9 4.3z', 'M17.1 4.3L4.3 17.1l-1.4-1.4L15.7 2.9z'],
  fill: 'currentColor',
  width: 20,
  height: 20,
};

// 따봉 아이콘
export const LikeIcon: IconPathTypes = {
  path: 'M25.8337 10.6667C25.8337 10.0479 25.5878 9.45442 25.1502 9.01683C24.7127 8.57925 24.1192 8.33341 23.5003 8.33341H16.127L17.247 3.00175C17.2703 2.88508 17.282 2.75675 17.282 2.62841C17.282 2.15008 17.0837 1.70675 16.7687 1.39175L15.532 0.166748L7.85533 7.84341C7.42366 8.27508 7.16699 8.85841 7.16699 9.50008V21.1667C7.16699 21.7856 7.41282 22.3791 7.85041 22.8167C8.28799 23.2542 8.88149 23.5001 9.50033 23.5001H20.0003C20.9687 23.5001 21.797 22.9167 22.147 22.0767L25.6703 13.8517C25.7753 13.5834 25.8337 13.3034 25.8337 13.0001V10.6667ZM0.166992 23.5001H4.83366V9.50008H0.166992V23.5001Z',
  fill: '#8A8A8A',
  width: 26,
  height: 24,
};

// 첨푸파일 클립 아이콘
export const ClipIcon: IconPathTypes = {
  path: 'M2.264 8.57896C2.20042 8.64376 2.12456 8.69523 2.04085 8.73036C1.95715 8.7655 1.86728 8.7836 1.7765 8.7836C1.68572 8.7836 1.59585 8.7655 1.51215 8.73036C1.42844 8.69523 1.35258 8.64376 1.289 8.57896C1.15959 8.4473 1.08707 8.27007 1.08707 8.08546C1.08707 7.90085 1.15959 7.72362 1.289 7.59196L7.32 1.49996C8.68 0.443961 10.048 -0.0630391 11.41 0.00596089C13.126 0.0939609 14.462 0.747961 15.596 1.82096C16.752 2.91496 17.5 4.47596 17.5 6.36796C17.5 7.81996 17.078 9.09796 16.187 10.232L7.684 18.992C6.824 19.697 5.868 20.038 4.844 19.997C3.544 19.943 2.577 19.523 1.858 18.812C1.016 17.981 0.5 16.96 0.5 15.587C0.5 14.495 0.877 13.487 1.655 12.541L9.139 4.89996C9.739 4.25996 10.326 3.87996 10.926 3.78796C11.3265 3.72524 11.7362 3.76122 12.1196 3.8928C12.503 4.02437 12.8484 4.24755 13.126 4.54296C13.658 5.10596 13.886 5.80796 13.806 6.60696C13.751 7.15196 13.528 7.65396 13.118 8.13496L6.238 15.183C6.17483 15.248 6.09935 15.2998 6.01596 15.3354C5.93256 15.3709 5.84292 15.3895 5.75226 15.3901C5.6616 15.3907 5.57173 15.3732 5.4879 15.3386C5.40408 15.3041 5.32796 15.2532 5.264 15.189C5.13378 15.0581 5.06019 14.8813 5.05906 14.6967C5.05794 14.5121 5.12938 14.3344 5.258 14.202L12.105 7.18996C12.305 6.95496 12.41 6.71796 12.435 6.46596C12.475 6.06596 12.379 5.77096 12.13 5.50796C12.0041 5.37341 11.847 5.27199 11.6726 5.21268C11.4982 5.15337 11.3118 5.13801 11.13 5.16796C10.887 5.20496 10.547 5.42596 10.128 5.87196L2.675 13.479C2.138 14.134 1.878 14.829 1.878 15.588C1.878 16.542 2.223 17.225 2.82 17.814C3.295 18.284 3.94 18.564 4.9 18.604C5.58 18.631 6.21 18.406 6.758 17.962L15.155 9.31196C15.8 8.48496 16.122 7.51196 16.122 6.36896C16.122 4.88696 15.545 3.68496 14.654 2.84096C13.744 1.97896 12.704 1.47096 11.341 1.40096C10.333 1.34896 9.276 1.74096 8.224 2.54696L2.264 8.57896Z',
  fill: '#8A8A8A',
  width: 18,
  height: 20,
};

// 종이비행기 전송 아이콘
export const SendIcon: IconPathTypes = {
  path: [
    'M1.685 6.659c-.926.309-.906 1.626.03 1.906l7.493 2.242l2.447 7.71c.293.922 1.596.932 1.902.013L18.86 2.62a1 1 0 0 0-1.265-1.265zm3.633.897l11.012-3.67l-3.698 11.096l-1.677-5.284a1 1 0 0 0-.667-.655z',
    'm17.767 1.44l1.044 1.077l-8.828 8.544l-1.044-1.078z',
  ],
  fill: '#8A8A8A',
  width: 20,
  height: 20,
  options: {
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
};

// 쓰레기통 아이콘
export const TrashcanIcon: IconPathTypes = {
  path: 'M1 5H16M6.625 9V15M10.375 9V15M1.9375 5L2.875 17C2.875 17.5304 3.07254 18.0391 3.42417 18.4142C3.77581 18.7893 4.25272 19 4.75 19H12.25C12.7473 19 13.2242 18.7893 13.5758 18.4142C13.9275 18.0391 14.125 17.5304 14.125 17L15.0625 5M5.6875 5V2C5.6875 1.73478 5.78627 1.48043 5.96209 1.29289C6.1379 1.10536 6.37636 1 6.625 1H10.375C10.6236 1 10.8621 1.10536 11.0379 1.29289C11.2137 1.48043 11.3125 1.73478 11.3125 2V5',
  fill: 'none',
  width: 17,
  height: 20,
  options: {
    stroke: '#51525B',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
};
