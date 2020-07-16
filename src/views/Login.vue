<template>
	<v-app>
		<v-app-bar app color="primary" dark>
			<div class="d-flex align-center">
				<v-img alt="Vuetify Name" class="shrink mt-1 hidden-sm-and-down" contain min-width="100" src="../assets/img/logo.png"
				 width="160" />
			</div>

			<v-spacer> 博客 </v-spacer>

			<v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
				
			</v-btn>
		</v-app-bar>

		<v-content>
			<!-- <HelloWorld/> -->
			<!--  登录 -->
			<div>
				<v-card class="mx-auto login_warp" max-width="420">
					<v-card-text>
						<center>
							<h3>博客 / 登录</h3>
						</center>

					</v-card-text>
					
					<div>
						
						<!-- <v-img src="../assets/img/user.png" class="login_icon"/> -->
						<v-text-field  prepend-icon="mdi-account" ref="user" class="logininput" label="帐号" :rules="[rules.required]" hide-details="auto" :loading="u_loading" v-model="username" @focus="u_loading=true" @blur="u_loading=false"></v-text-field>
					</div>
					<div>
						<!-- <v-img src="../assets/img/pwd.png" class="login_icon"/> -->
						<v-text-field  prepend-icon="mdi-key" :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'" :type="showPwd ? 'text' : 'password'" class="logininput" label="密码" :rules="[rules.required]"  v-model="password" @click:append="showPwd = !showPwd" :loading="p_loading" @focus="p_loading=true" @blur="p_loading=false" @keydown.enter.native="login_check"></v-text-field>
					</div>
					<center><v-btn class="text-center mr-2 login_btn"  outlined color="indigo" @click="login_check"> 登录</v-btn></center>
				</v-card>
				
				
			
			</div>
			
		</v-content>
		<transition name="fade">
			<v-alert v-if="showlogintips" dense text type="success" class="alert"> 登录成功</v-alert>
		</transition>
	</v-app>
</template>
<script>

	export default {
	  name: 'login',
	
	  components: {
	    // HelloWorld,
	  },
	
	  data(){
		 return {
			 overlay:false,
			 showlogintips:false,
			 rules:{
			 	required:value => !!value || '请填写完整.',
			 },
			 showPwd:false,
			 username:'',
			 password:'',
			 u_loading:false,
			 p_loading:false
		 }
	  },
	  methods:{
		 login_check(){
			if( this.username && this.password ){
				this.request.API_Login({
					username:this.username,
					password:this.password
				},(res)=>{
					window.localStorage.setItem('token',res.data.token);
					setTimeout(()=>{
						this.$router.push('/admin')
					},500)
				})
			}
			
		 }
	  },
	  mounted() {
	  	this.$refs.user.focus();
		
	  }
	};
</script>
<style lang="less">
	.login_warp{
		padding: 12px 40px;
		padding-bottom: 40px;
		transform: translateY(50%);
		top: -50%;
		.logininput{
			margin-bottom: 30px;
		}
		.login_icon{
			width: 20px !important;
		}
		.login_btn{
			width: 100%;
		}
		
	}
	.alert{
		width: 180px;
		margin: 0 auto;
	}
	.fade-enter-active, .fade-leave-active {
	  transition: opacity 0.5s
	}
	.fade-enter, .fade-leave-active {
	  opacity: 0
	}
	
</style>