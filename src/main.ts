import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import './assets/main.css';
import { VueQueryPlugin } from '@tanstack/vue-query';

// Vue 애플리케이션의 루트 인스턴스를 생성하고 App 컴포넌트를 최상위 컴포넌트로 설정
const app = createApp(App);

// mount('#app'): 앱을 #app 요소에 마운트
app.use(createPinia()).use(router).use(VueQueryPlugin).mount('#app');
