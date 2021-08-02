import axios from 'axios';
import vue from 'vue'
import vuex from 'vuex'

import router from './../../router'

import vueExample from '../../main.js'

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

let token = window.localStorage.getItem('token');

let baseURL = {
	api_host:'https://blog-api.lipengpeng.com'
}
// let baseURL = {
// 	api_host:'http://127.0.0.1:8000'
// }

let pending = []; //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let cancelToken = axios.CancelToken;
let removePending = (config) => {
    for(let p in pending){
        if(pending[p].u === config.url + JSON.stringify(config.data) + '&' + config.method) { //当当前请求在数组中存在时执行函数体
            pending[p].f(); //执行取消操作
            pending.splice(p, 1); //把这条记录从数组中移除
			
        }
    }
}

// http请求拦截器
axios.interceptors.request.use(config => {
	let token = window.localStorage.getItem('token');
	!!token ? config.headers.token = token : '';
	removePending(config); //在一个axios发送前执行一下取消操作
	config.cancelToken = new cancelToken((c)=>{
	    // 这里的axios标识我是用请求地址&请求方式拼接的字符串
	    pending.push({ u: config.url + JSON.stringify(config.data) +'&' + config.method, f: c });  
	});
	return Promise.resolve(config)
}, error => {
	return Promise.reject(error)
})

// http响应拦截器
axios.interceptors.response.use(data => { 
	removePending(data.config);  //在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
	// Indicator.close();
	// this.$router.push('/login')
	if(data.data.status == '401'){
		var confirm = window.confirm("登录过期请重新登录！");
		if(confirm){
			vueExample.$router.push('/login')
		}
	}
	
	return Promise.resolve(data)
	
}, error => {
	//加载失败
	return {'data':{}}
	// return Promise.reject(error)
})


export default {
	baseURL,
	async API_Login({
		username,password
	} = {}, callback,errback) {
		var data = arguments[0];
		await vueExample;
		vueExample.$store.commit('showOverlay');
		axios.post(baseURL.api_host + '/login', data)
			.then(function(response) {
				console.log(' 登录响应: ', response.data)
				var r = response.data;
				vueExample.$store.commit('hideOverlay');
				if (r.status == 0) {
					callback(r)
				} else {
					!!errback && errback() || vueExample.$toast(r.message);
					
				}
			})
			.catch(function(error) {
				console.log(error)
			})
	},
	//密码修改
	async API_pwdEdit({
		username,pwd,modifyPwd
	} = {}, callback,errback) {
		var data = arguments[0];
		await vueExample;
		vueExample.$store.commit('showOverlay');
		axios.post(baseURL.api_host + '/users/update', data)
			.then(function(response) {
				console.log('密码修改: ', response.data)
				var r = response.data;
				vueExample.$store.commit('hideOverlay');
				if (r.status == 0) {
					callback(r)
				} else {
					!!errback && errback() || vueExample.$toast(r.message);
					
				}
			})
			.catch(function(error) {
				console.log(error)
			})
	},
	async API_classification_select(callback,errback) {
		await vueExample;
		vueExample.$store.commit('showOverlay');
		axios.post(baseURL.api_host + '/classification/select')
			.then(function(response) {
				console.log('查分类响应: ', response.data)
				var r = response.data;
				vueExample.$store.commit('hideOverlay');
				if (r.status == 0) {
					callback(r)
				} else {
					!!errback && errback() || vueExample.$toast(r.message);
					
				}
			})
			.catch(function(error) {
				console.log(error)
			})
	},
	async API_classification_add({name,remarks} = {},callback,errback) {
		var data = arguments[0];
		await vueExample;
		vueExample.$store.commit('showOverlay');
		axios.post(baseURL.api_host + '/classification/add',data)
			.then(function(response) {
				console.log('分类增加: ', response.data)
				var r = response.data;
				vueExample.$store.commit('hideOverlay');
				if (r.status == 0) {
					callback(r)
				} else {
					!!errback && errback() || vueExample.$toast(r.message);
					
				}
			})
			.catch(function(error) {
				console.log(error)
			})
	},
	async API_classification_del(uuid,callback,errback) {
		await vueExample;
		vueExample.$store.commit('showOverlay');
		axios.post(baseURL.api_host + '/classification/del',{uuid})
			.then(function(response) {
				console.log('分类删除: ', response.data)
				var r = response.data;
				vueExample.$store.commit('hideOverlay');
				if (r.status == 0) {
					callback(r)
				} else {
					!!errback && errback() || vueExample.$toast(r.message);
					
				}
			})
			.catch(function(error) {
				console.log(error)
			})
	},
	async API_classification_update({uuid,name,remarks} = {},callback,errback) {
		var data = arguments[0];
		await vueExample;
		vueExample.$store.commit('showOverlay');
		axios.post(baseURL.api_host + '/classification/update',data)
			.then(function(response) {
				console.log('分类名修改: ', response.data)
				var r = response.data;
				vueExample.$store.commit('hideOverlay');
				if (r.status == 0) {
					callback(r)
				} else {
					!!errback && errback() || vueExample.$toast(r.message);
					
				}
			})
			.catch(function(error) {
				console.log(error)
			})
	},
	
	// 文章
	
	async API_articles_edit({title,classUuid,content,author} = {},callback,errback) {
		var data = arguments[0];
		await vueExample;
		vueExample.$store.commit('showOverlay');
		axios.post(baseURL.api_host + '/article/create',data)
			.then(function(response) {
				console.log('文章创建: ', response)
				var r = response.data;
				vueExample.$store.commit('hideOverlay');
				if (r.status == 0) {
					callback(r)
				} else {
					!!errback && errback() || vueExample.$toast(r.message);
					
				}
			})
			.catch(function(error) {
				console.log(error)
			})
	},
	async API_articles_update({title,content,uuid} = {},callback,errback) {
		var data = arguments[0];
		await vueExample;
		vueExample.$store.commit('showOverlay');
		axios.post(baseURL.api_host + '/article/update',data)
			.then(function(response) {
				console.log('文章更新: ', response)
				var r = response.data;
				vueExample.$store.commit('hideOverlay');
				if (r.status == 0) {
					callback(r)
				} else {
					!!errback && errback() || vueExample.$toast(r.message);
					
				}
			})
			.catch(function(error) {
				console.log(error)
			})
	},
	async API_articles_find({pageSize,pageNum,keywords,classUuid} = {},callback,errback) {
		var data = arguments[0];
		await vueExample;
		vueExample.$store.commit('showOverlay');
		axios.post(baseURL.api_host + '/article/find',data)
			.then(function(response) {
				console.log('文章查询|筛选: ', response)
				var r = response.data;
				vueExample.$store.commit('hideOverlay');
				if (r.status == 0) {
					callback(r)
				} else {
					!!errback && errback() || vueExample.$toast(r.message);
					
				}
			})
			.catch(function(error) {
				console.log(error)
			})
	},
	//  文章详情
	async API_articles_detail(uuid,callback,errback) {
		await vueExample;
		vueExample.$store.commit('showOverlay');
		axios.post(baseURL.api_host + '/article/find_details',{uuid})
			.then(function(response) {
				console.log('文章详情: ', response)
				var r = response.data;
				vueExample.$store.commit('hideOverlay');
				if (r.status == 0) {
					callback(r)
				} else {
					!!errback && errback() || vueExample.$toast(r.message);
					
				}
			})
			.catch(function(error) {
				console.log(error)
			})
	},
	async API_articles_del(uuid,callback,errback) {
		await vueExample;
		vueExample.$store.commit('showOverlay');
		axios.post(baseURL.api_host + '/article/del',{uuid})
			.then(function(response) {
				console.log('文章删除: ', response)
				var r = response.data;
				vueExample.$store.commit('hideOverlay');
				if (r.status == 0) {
					callback(r)
				} else {
					!!errback && errback() || vueExample.$toast(r.message);
					
				}
			})
			.catch(function(error) {
				console.log(error)
			})
	},
	async API_Image_upload(formData,callback) {
		await vueExample;
		vueExample.$store.commit('showOverlay');
		
		var request = new XMLHttpRequest();
		request.open("POST", baseURL.api_host+"/upload/images?token="+token || window.localStorage.getItem('token'));
		// request.setRequestHeader('token',token || window.localStorage.getItem('token'));
		request.send(formData);
		request.onreadystatechange = function(){
			vueExample.$store.commit('hideOverlay');
		    if(request.readyState === 4 & request.status === 200){
		        var response = JSON.parse(request.responseText);
		        console.log(response);
				callback(response)
		    }
			
		}
	}
	


}
