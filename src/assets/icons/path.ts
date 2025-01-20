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
  path: 'M9.82664 1.22902C10.7938 -0.409674 13.2063 -0.409675 14.1735 1.22902L23.6599 17.3024C24.6578 18.9933 23.3638 21 21.4865 21H2.51362C0.63634 21 -0.657696 18.9933 0.340215 17.3024L9.82664 1.22902ZM10.0586 6.05547C10.0268 5.48227 10.483 5 11.0571 5H12.9429C13.517 5 13.9732 5.48227 13.9414 6.05547L13.5525 13.0555C13.523 13.5854 13.0847 14 12.554 14H11.446C10.9153 14 10.477 13.5854 10.4475 13.0555L10.0586 6.05547ZM14 17C14 18.1046 13.1046 19 12 19C10.8954 19 10 18.1046 10 17C10 15.8954 10.8954 15 12 15C13.1046 15 14 15.8954 14 17Z',
  fill: '#253C7F',
  width: 24,
  height: 21,
};
