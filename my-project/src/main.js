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
//定义全局变量
Vue.prototype.$post = post;
Vue.prototype.$fetch = fetch;
Vue.prototype.$patch = patch;
Vue.prototype.$put = put;

// 路由跳转滚动条置顶
router.afterEach((to,from,next) => {
	window.scrollTo(0,0);
});
// 路由跳转改变页面title
router.beforeEach((to, from, next) => {
	/* 路由发生变化修改页面title */
	if (to.meta.title) {
	  	document.title = to.meta.title
	}
	next()
})
/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	components: { App },
	template: '<App/>'
});
