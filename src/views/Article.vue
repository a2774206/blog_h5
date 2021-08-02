<template>

	<v-app class="home">
		<v-app-bar app color="cyan" clipped-left class="app-bar">
			<div class="d-flex align-center">
				<v-img alt="Vuetify Name" class="shrink mt-1 hidden-sm-and-down" contain min-width="100" src="../assets/img/logo.png"
				 width="160" />
			</div>

			<v-spacer class="spacer-text"><strong>博客</strong></v-spacer>

			<v-btn text class="bar_text" @click='navToLink'>
				<span class="mr-2">我的导航</span>
				<v-icon>mdi-send</v-icon>
			</v-btn>
		</v-app-bar>

		<v-content class="container-max">
			<div class="article_left">
				
				<div v-if="showarticle">
					<center>
						<h2 style="padding: 0 20px;">{{article.title}}</h2>
					</center>
					<center class="small-line"><router-link to='/' tag='span'><v-btn x-small color="secondary" icon dark><v-icon>mdi-home</v-icon></v-btn></router-link><small> 上次修改时间：{{article.updated_time|timeFilter}}| {{article.author}} | 分类：{{article && article.tag && article.tag.tabname}}</small></center>
					<div class="article-content">
						<mavon-editor v-model="article.content"  :editable="false" :ishljs="true" :subfield="false" :toolbars="toolbars" :boxShadow="false" defaultOpen="preview" :toolbarsFlag="false" />
						<!-- <pre class="post-content" v-highlight v-html="article.content"></pre> -->
					</div>
				</div>
			</div>
			
			<div class="article_right">
				 <v-card class="mx-auto"  tile>
				 	<v-list rounded>
				 		<v-subheader>文章推荐</v-subheader>
				 		<v-list-item-group v-model="item" color="primary">
				 			<v-list-item v-for="(items, i) in articleList" :key="i" @click="clickarticle(items.uuid)">
				 				<v-list-item-content>
				 					<v-list-item-title>{{items.title}}</v-list-item-title>
				 				</v-list-item-content>
				 			</v-list-item>
				 		</v-list-item-group>
				 	</v-list>
				 </v-card>
			</div>
		</v-content>
		<v-btn class="mx-2 totop" fab dark large color="cyan" ref="top" @click="topEvent">
			<v-icon dark>mdi-chevron-up</v-icon>
		</v-btn>
	</v-app>


</template>

<script>
	import 'highlight.js/styles/googlecode.css'
	import hljs from 'highlight.js' //导入代码高亮文件
	export default {
		name: 'Home',
		data: () => ({
			item:-1,
			article: {},
			articleList:[],
			showarticle:false,
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
			        fullscreen: true, // 全屏编辑
			        readmodel: true, // 沉浸式阅读
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
			        preview: true // 预览
			}
		}),

		components: {

		},
		filters: {
			timeFilter(value, type) {
				var date = new Date(+value);
				var YY = date.getFullYear() + '年';
				var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
				var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + '日';
				var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
				var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
				var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
				return YY + MM + DD;

			}
		},
		mounted() {
			this.getarticleInfo();
			this.getarticleList();
		},
		directives:{
			highlight:(el)=>{
				let highlight = el.querySelectorAll('code,pre');
				highlight.forEach((block)=>{
				    hljs.highlightBlock(block);
				})
			}
		},
		methods: {
			clickarticle(uuid){
				this.$router.replace('/article?id='+uuid);
				this.getarticleInfo();
			},
			getarticleInfo() {
				this.showarticle = false;
				this.request.API_articles_detail(this.$route.query.id, (res) => {
					this.showarticle = true;
					this.article = res.data[0];
					let Timer,_this = this;
					
					async function highlighthandle(){
						await hljs;
						console.log(hljs)
						let highlight = document.querySelectorAll('code,pre');
						highlight.forEach((block)=>{
						   hljs.highlightBlock(block);
						})
					}
					highlighthandle();
					
				})
			},
			getarticleList(){
				this.request.API_articles_find({
					pageSize: 8,
					pageNum: 1,
					keywords: ''
				}, (res) => {
					this.articleList = res.data;
				})
			},
			topEvent() {
				window.scrollTo(0, 0)
			},
			navToLink() {
				window.location.href = 'https://lipengpeng.com'
			},
		}
	}
</script>
<style scoped lang="less">
	@media screen and (min-width:320px) and (max-width:913px) {

		.v-application .align-center .v-responsive {
			width: 110px !important;
		}

		.v-application .hidden-sm-and-down {
			display: block !important;
		}
		.home{
			.container-max {
				width: 100% !important;
				padding-left: 0 !important;
				padding-right: 0 !important;
			}
			.article_right{
				width: 100% !important;
			}
		}
		

		.container_warp {
			display: flex;
			width: 100%;
			.container_left {
				width: 100% !important;
				margin: 0 auto;
			}

			.container_right {
				width: 0;
				display: none;
				text-align: center;
			}

		}
		.home .small-line{
			padding: 16px !important;
		}
		.container-max{
			.article-content{
				padding: 10px 19px !important;
			}
		}
		.article_left{
			width: 100% !important;
		}
	}

	.home {
		.bar_text {
			color: #fff;
		}
		
		.app-bar {
			// position: relative;
			max-height: 70px;
		}

		.totop {
			position: fixed;
			right: 20px;
			bottom: 100px;
		}
		.small-line {
			padding: 12px 0 8px 0;
			color: #999;
		}
		
		.article {
			clear: both;
			padding-bottom: 80px;
			
			.articleList {
				margin: 26px 2px;
				padding-bottom: 12px;
				border-bottom: 1px dashed #dedbdb;

				h4 {
					font-size: 20px;
					color: #333;
				}

				.small_text {
					color: #999;
					font-size: 19px;
				}

				.redAllText {
					text-align: right;
					font-size: 16px;
				}

				.article_content {
					font-size: 16px;
					color: #666;
					letter-spacing: 1px;
				}
			}
		}
	}

	.spacer-text {
		color: #fff;
	}

	.container-max {
		z-index: 0;
		margin-top: 40px;
		padding: 64px 30px 20px 30px !important;
		.article-content {
			padding: 30px 20px !important;
		}
		.article_left{
			width: 70%;
			float: left;
		}
		.article_right{
			width: 25%;
			float: right;
		}
	}

	.container_warp {
		display: flex;

		.container_left {
			width: 80%;
			padding: 0 14px;
			
			#input-14 .v-application--is-ltr .v-text-field__suffix {
				font-size: 12px !important;
				color: darkcyan;
			}
		}

		.container_right {
			width: 20%;
			text-align: center;

			.class_warp {
				div {
					font-size: 16px;
					margin: 28px 0;
				}
			}
		}

	}
</style>
