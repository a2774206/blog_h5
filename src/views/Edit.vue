<template>

	<v-app id="inspire">



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
		
		<v-content class="articlesContent">
			 <div style="padding: 12px 0;">
				 
				 <v-chip-group active-class="primary--text">
				   <v-chip >
					 分类： {{type == 'edit' ? tag.tabname : details && details.tag && details.tag.tabname}}
				   </v-chip>
				 </v-chip-group>
			 </div>
			<v-text-field placeholder="请输入标题" clearable v-model="title"></v-text-field>
			<mavon-editor v-model="content" ref="md" @change="change" @imgAdd="imgAdd" style="min-height: 600px" :toolbars= 'toolbars'/>

			<p>
				<br>
				<v-btn color="primary" @click="submit" v-if="type == 'edit'"> 发布文章 </v-btn>
				<v-btn color="primary" @click="modiyfy" v-if="type == 'modiyfy'"> 修改文章 </v-btn>
				
			</p>
		</v-content>

		<!-- <v-footer app>
			<span>&copy; 2020</span>
		</v-footer>
 -->
	</v-app>
</template>

<script>
	export default {
		name: 'edit',
		data() {
			return {
				title: '',
				content: '',
				type: '',
				classifyUuid:'',
				articleUuid:'',
				details:{},
				tag:{},
				toolbars: {
				        bold: true, // 粗体
				        italic: true, // 斜体
				        header: true, // 标题
				        underline: true, // 下划线
				        strikethrough: true, // 中划线
				        mark: true, // 标记
				        superscript: true, // 上角标
				        subscript: true, // 下角标
				        quote: true, // 引用
				        ol: true, // 有序列表
				        ul: true, // 无序列表
				        link: true, // 链接
				        imagelink: true, // 图片链接
				        code: true, // code
				        table: true, // 表格
				        fullscreen: false, // 全屏编辑
				        readmodel: false, // 沉浸式阅读
				        htmlcode: true, // 展示html源码
				        help: true, // 帮助
				        /* 1.3.5 */
				        undo: true, // 上一步
				        redo: true, // 下一步
				        trash: true, // 清空
				        save: false, // 保存（触发events中的save事件）
				        /* 1.4.2 */
				        navigation: true, // 导航目录
				        /* 2.1.8 */
				        alignleft: true, // 左对齐
				        aligncenter: true, // 居中
				        alignright: true, // 右对齐
				        /* 2.2.1 */
				        subfield: true, // 单双栏模式
				        preview: false // 预览
				      }

			}
		},
		methods: {
			imgAdd (pos, file) {
			  var formData = new FormData();
			  formData.append('file', file);
			  this.request.API_Image_upload(formData,(res)=>{
				  this.$refs.md.$img2Url(pos, this.request.baseURL.api_host +'/'+res.Imageurl);
			  })
			 },
			modiyfy(){
				this.request.API_articles_update({
					title: this.title,
					uuid: this.articleUuid,
					content: this.content
				},(res)=>{
					this.$toast('文章修改完成');
					setTimeout(()=>{
						this.$router.push('/admin?option=1')
					},600)
				})
			},
			submit() {
				this.request.API_articles_edit({
					title: this.title,
					classUuid: this.classifyUuid,
					content: this.content,
					author: 'admin'
				},(res)=>{
					this.$toast('文章已发布');
					setTimeout(()=>{
						this.$router.push('/admin?option=1')
					},600)
				})
			},
			change() {

			},
			exitAccounts() {
				this.$toast('已退出')
				window.localStorage.removeItem('token');
				this.$router.push('/login')
			}
		},
		mounted() {
			
			this.type = this.$route.query.type;
			if(this.type == 'modiyfy'){
				//  编辑修改
				this.articleUuid = this.$route.query.articleUuid;
				
				this.request.API_articles_detail(this.articleUuid,(data)=>{
					if(data.data && data.data[0]){
						this.details = data.data[0];
						this.title = data.data[0].title;
						this.content = data.data[0].content;
					}else{
						this.$toast('文章不存在！');
					}
				})
			}else{
				//  编辑创建
				this.classifyUuid = this.$route.query.classifyUuid;
				this.request.API_classification_select((data)=>{
					console.log(data);
					data.data.doc.map((item)=>{
						console.log(item)
						if(item.uuid == this.classifyUuid){
							this.tag = item;
						}
					})
					
				})
			}
		}
	};
</script>
<style>
	.articlesContent {
		padding: 10px 20px !important;
		margin-top: 56px;
		z-index: 0 !important;
	}
</style>
