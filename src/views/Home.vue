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
			<div class="container_warp">
				<div class="container_left">
					<v-text-field append-icon="mdi-magnify" label="搜索关键字" @click:append="searchFilter" v-model="searchText" :suffix="tab">
					</v-text-field>
					<div class="artcle">
						<v-skeleton-loader class="mx-auto" type="heading, table-cell@1,text,sentences,actions" v-for="(items,index) in pageSize" :key='index' v-if="artclesArr.length == 0 && loadend"></v-skeleton-loader>

						<div class="artcleList" v-for="items in artclesArr">
							<router-link tag="h4" :to="{path:'artcle',query:{id:items.uuid}}">{{items.title}}</router-link>
							<p class="small_text"><small>{{items.created_time|timeFilter}} | {{items.tag.tabname}}</small></p>
							<div class="artcle_content">{{items.content|numlimit(1)}}</div>
							<p class="redAllText">
								<v-icon></v-icon>
								<router-link tag="span" :to="{path:'artcle',query:{id:items.uuid}}">
									<v-btn class="ma-2" color="cyan" dark>
										阅读全文
										<v-icon dark right>mdi-book-open</v-icon>
									</v-btn>
								</router-link>
							</p>
						</div>
						<div class="text-center" style="margin-top: 10px;">
							<v-pagination v-if="artclesArr.length > 0" color="cyan" v-model="pageNum" :length="allPageNum" :total-visible="allPageNum"
							 @input="pageChange"></v-pagination>
						</div>
					</div>

				</div>
				<v-divider vertical class="line_s"></v-divider>
				<div class="container_right">
					<v-card class="mx-auto"  tile>
						<v-list shaped>
							<v-subheader>分类</v-subheader>
							<v-skeleton-loader class="mx-auto" type="list-item@6"  v-if="artclesArr.length == 0 && loadend"></v-skeleton-loader>
							<v-list-item-group v-model="item" color="primary" v-else>
								<v-list-item v-for="(items, i) in classItems" :key="i" @click="selectClass(items)">

									<v-list-item-content>
										<v-list-item-title>{{items.tabname}}（{{items.count||'0'}}）</v-list-item-title>
									</v-list-item-content>
								</v-list-item>
							</v-list-item-group>
						</v-list>
					</v-card>
				</div>
			</div>


		</v-content>
		<v-btn class="mx-2 totop" fab dark large color="cyan" ref="top" @click="topEvent">
			<v-icon dark>mdi-chevron-up</v-icon>
		</v-btn>
	</v-app>

</template>

<script>
	// @ is an alias to /src

	export default {
		name: 'Home',
		data: () => ({
			searchText: '',
			pageSize: 10,
			pageNum: 1,
			keywords: '',
			classUuid: '',
			classItems: [],
			allPageNum: 0,
			artclesArr: [],
			loadend: false,
			tab: '全部',
			item: 0
		}),
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

			},
			numlimit(value, type) {
				if (type) {
					if (value.length > 300) {
						return value.toString().slice(0, 300) + '...'
					} else {
						return value;
					}
				} else {
					if (value.length > 30) {
						return value.toString().slice(0, 30) + '...'
					} else {
						return value;
					}
				}
			}
		},
		components: {

		},
		mounted() {
			this.loadend = true;
			this.articles_get_init()
			this.class_get_init();
			
		},
		methods: {
			selectClass(o) {
				this.pageNum = 1;
				this.searchText = '';
				this.keywords = '';
				this.classUuid = o.uuid;
				this.tab = o.tabname;
				this.articles_get_init();
			},
			pageChange(p) {
				this.pageNum = p;
				this.articles_get_init();
			},
			topEvent() {
				window.scrollTo(0, 0)
			},
			navToLink() {
				window.location.href = 'https://lipengpeng.com'
			},
			searchFilter() {
				this.pageNum = 1;
				this.keywords = this.searchText;
				this.articles_get_init();
			},
			class_get_init() {
				this.request.API_classification_select((res) => {

					if (res.data.doc && res.data.doc.length > 0) {
						let count = 0;
						res.data.doc.forEach((items) => {
							count += items.count;
						})
						let data = [{
							uuid: '',
							tabname: '全部',
							count
						}];
						data = data.concat(res.data.doc);
						this.classItems = data;
						// console.log(this.classItems)
					} else {
						this.classItems = [];
					}
					
					
				})
			},
			articles_get_init() {
				
				this.request.API_articles_find({
					pageSize: this.pageSize,
					pageNum: this.pageNum,
					keywords: this.keywords,
					classUuid: this.classUuid
				}, (res) => {
					this.loadend = false;
					this.artclesArr = res.data;
					this.allPageNum = Math.ceil(res.count / this.pageSize);
					console.log(this.artclesArr)
				})
			}
		}
	}
</script>
<style scoped lang="less">
	@media screen and (min-width:320px) and (max-width:913px) {
		.line_s {
			display: none;
		}

		.v-application .align-center .v-responsive {
			width: 110px !important;
		}

		.v-application .hidden-sm-and-down {
			display: block !important;
		}

		.container-max {
			min-width: 100% !important;
		}

		.container_warp {
			display: flex;

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

		.artcle {
			clear: both;
			padding-bottom: 80px;

			.artcleList {
				margin: 26px 2px;
				padding-bottom: 12px;
				border-bottom: 1px dashed #dedbdb;

				h4 {
					font-size: 20px;
					color: #333;
					cursor: pointer;
				}

				.small_text {
					color: #999;
					font-size: 19px;
				}

				.redAllText {
					text-align: right;
					font-size: 16px;
				}

				.artcle_content {
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
		margin: 0 auto;
		margin-top: 40px;
		width: 1366px;

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
			width: 18%;
			text-align: center;
			margin-left: auto;
			.class_warp {
				div {
					font-size: 16px;
					margin: 28px 0;
				}
			}
		}

	}
</style>
