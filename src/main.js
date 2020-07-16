import Vue from 'vue'
import App from './App.vue'

import store from './store'

import router from './router'

import request from './assets/js/request.js'
Vue.prototype.request = request;
console.log('挂载时间' + new Date())
import vuetify from './plugins/vuetify';

import './components/Toast/Toast.css';
import Toast from './components/Toast/Toast.js';
Vue.use(Toast)


Vue.config.productionTip = false

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)

router.beforeEach((to, from, next) => {
	if (to.path !== '/login' && !window.localStorage.getItem('token') && to.meta.auth) {
		next({
			path: '/login'
		})
	} else {
		next();
	}
})



const vueExample = new Vue({
	router,
	store,
	vuetify,
	render: h => h(App)
}).$mount('#app')

export default vueExample;


