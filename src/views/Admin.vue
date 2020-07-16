<template>

	<v-app id="inspire">
		<v-navigation-drawer app clipped :mini-variant.sync="mini" permanent>
			<v-list-item class="px-2">


				<v-list-item-title>已登录：admin</v-list-item-title>

				<v-btn icon @click.stop="mini = !mini">
					<v-icon>mdi-chevron-left</v-icon>
				</v-btn>
			</v-list-item>

			<v-divider></v-divider>

			<v-list dense>
				<v-list-item-group v-model="itemdefault">
				<v-list-item v-for="(item,i) in items" :key="item.title" link @click.native="switchTab(i)" >
					<v-list-item-icon>
						<v-icon>{{ item.icon }}</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>{{ item.title }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				</v-list-item-group>
			</v-list>
		</v-navigation-drawer>

		
		<v-app-bar app color="primary" dark clipped-left>
			<div class="d-flex align-center">
				<v-img alt="Vuetify Name" class="shrink mt-1 hidden-sm-and-down" contain min-width="100" src="../assets/img/logo.png"
				 width="160" />
			</div>

			<v-spacer>后台管理</v-spacer>

			<v-btn text @click='exitAccounts'>
				<span class="mr-2">退出</span>
				<v-icon>mdi-logout</v-icon>
			</v-btn>
		</v-app-bar>
			
		<v-content>
			<component :is="template"></component>
		</v-content>
		
		
	</v-app>
</template>
<script>
	import classify from '@/components/classify.vue'
	import articles from '@/components/articles.vue'
	import configuration from '@/components/configuration.vue'
	export default {
		name: 'login',

		components: {
			classify,
			articles,
			configuration
		},

		data() {
			return {
				mini: false,
				template: 'classify',
				itemdefault:0,
				items: [{
						title: '分类',
						icon: 'mdi-server',
						template: classify
					},
					{
						title: '文章',
						icon: 'mdi-book-open',
						template: articles
					},
					{
						title: '设置',
						icon: ' mdi-brightness-7',
						template: configuration
					},
				]
			}
		},
		methods: {
			switchTab(item) {
				this.template = this.items[item]['template']
			},
			exitAccounts(){
				this.$toast('已退出');
				window.localStorage.removeItem('token');
				this.$router.push('/login');
			}
		},
		mounted() {
			// console.log(this.$refs.user.focus())
			
		},
		created() {
			if(this.$route.query && this.$route.query.option){
				this.itemdefault = (+this.$route.query.option);
				this.template = this.items[this.itemdefault]['template']
			}
		}
	};
</script>
<style lang="less">
	.addclasstitle{
		font-size: 14px;
	}
</style>
