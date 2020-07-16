import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
let Timer;
export default new Vuex.Store({
  state: {
	  overlay:false
  },
  mutations: {
	  showOverlay(state,value){
		 if(Timer){
			 clearTimeout(Timer);
		 }
		 state.overlay = true;
	  },
	  hideOverlay(state,value){
		 Timer = setTimeout(()=>{
			 clearTimeout(Timer);
		  	 state.overlay = false;  
		  },200)
		  
	  }
  },
  actions: {
  },
  modules: {
  }
})
