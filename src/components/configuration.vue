<template>
	<v-container style="padding: 10px 40px;">

		<v-row>
			<h4 style="padding: 20px 0;">设置</h4>
			<v-expansion-panels>
				<v-expansion-panel>
					<v-expansion-panel-header>
						密码修改
					</v-expansion-panel-header>
					<v-expansion-panel-content>
						<v-col cols="12" sm="12" style="padding: 10px 10px;">
							<v-text-field v-model="username" label="用户名" clearable dense outlined style="max-width: 300px;"></v-text-field>
							<v-text-field v-model="pwd" label="原密码" clearable dense outlined style="max-width: 300px;"></v-text-field>
							<v-text-field v-model="modifyPwd" label="新密码" clearable dense outlined style="max-width: 300px;"></v-text-field>
							<v-btn depressed color="primary" @click='editPwd'>修改</v-btn>
						</v-col>
					</v-expansion-panel-content>
				</v-expansion-panel>

			</v-expansion-panels>



		</v-row>
	</v-container>
</template>

<script>
	export default {
		name: 'configuration',

		data: () => ({
			username: '',
			pwd: '',
			modifyPwd: ''
		}),
		methods: {
			editPwd() {
				// let { username,pwd,modifyPwd } = {this};
				this.request.API_pwdEdit({
					username: this.username,
					pwd: this.pwd,
					modifyPwd: this.modifyPwd
				}, (res) => {
					this.$toast('修改成功');
					this.pwd = '';
					this.modifyPwd = ''
				})
			}
		}
	}
</script>
