import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import './assets/main.css';
import { VueQueryPlugin } from '@tanstack/vue-query';
import VueApexCharts from 'vue3-apexcharts';

const app = createApp(App);

app.use(createPinia()).use(router).use(VueQueryPlugin).use(VueApexCharts).mount('#app');
