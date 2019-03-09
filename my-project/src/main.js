// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import iview from 'iview';
import 'iview/dist/styles/iview.css';
// import axios from 'axios';
// 引入echarts
import echarts from 'echarts';

Vue.use(iview);
// Vue.prototype.$axios= axios
Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false;

import { post, fetch, patch, put } from './utils/http';
console.log(process.env.NODE_ENV)
//定义全局变量
Vue.prototype.$post = post;
Vue.prototype.$fetch = fetch;
Vue.prototype.$patch = patch;
Vue.prototype.$put = put;

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App/>'
});
