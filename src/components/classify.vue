<template>
	<div class="classify">
		<v-container>
			<v-list>
				<v-btn class="mx-2" dark color="cyan" @click.navtive="addClassModel">
					<v-icon left>mdi-plus</v-icon> 新增分类
				</v-btn>

				<v-row justify="space-around" style="padding: 10px;">
					<v-col v-for="(item,index) in arr" cols="12" md="4" :key="index" :class="{ displayVisble:item.isnull}">

						<v-sheet class="pa-12" color=" lighten-3" style="border: 1px solid #eee;text-align: center;">
							<div>
								<v-badge color="blue" content="分类">

								</v-badge>

								<strong style="font-size: 18px;padding: 38px;"> {{item.tabname}}</strong>
							</div>
							<div>
								<small style="padding: 3px;"> 共 {{item.count}} 篇文章</small>

							</div>
							<p style="color: #666;overflow: hidden;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" :title="item.remarks">


								<small style="padding: 3px;" class="nodark"> 简介： {{item.remarks}}</small>

							</p>
							<p style="">
								<v-btn class="mx-2" fab outlined small color="blue" title="编辑" @click="showdialogEvent(item.uuid,0,item.tabname,item.remarks)">
									<v-icon dark>mdi-rename-box</v-icon>
								</v-btn>
								<v-btn class="mx-2" fab outlined small color="cyan" title="写文章" @click="toWriteArticles(item.uuid)">
									<v-icon dark>mdi-pencil</v-icon>
								</v-btn>
								<v-btn class="mx-2" fab outlined small color="pink" title="删除" @click="showdialogEvent(item.uuid,1)">
									<v-icon dark>mdi-delete</v-icon>
								</v-btn>
							</p>
						</v-sheet>

					</v-col>
				</v-row>
			</v-list>
			<v-dialog v-model="modelShow" persistent max-width="440px">

				<v-card>
					<v-card-title>
						<span class="headline">{{modelLabel}}</span>
					</v-card-title>
					<v-card-text>
						<v-container>

							<v-col cols="12">
							</v-col>
							<v-col cols="12">
								<v-text-field label="分类/标签" type="text" dense required outlined clearable v-model="className"></v-text-field>
								<v-text-field label="备注" type="text" required dense outlined clearable v-model="classRemark"></v-text-field>
							</v-col>
							<small>*均必填</small>
							</v-row>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color=" darken-1" text @click="modelShow = false">关闭</v-btn>
						<v-btn color="blue darken-1" text @click="save(modelLabel)">保存</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>

			<v-dialog v-model="dialogShow" persistent max-width="290">

				<v-card>
					<v-card-title class="headline">提示</v-card-title>
					<v-card-text>是否确认删除？</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color=" darken-1" text @click="deleteClass">删除</v-btn>
						<v-btn color="green darken-1" text @click="dialogShow = false">取消</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-container>
	</div>
</template>

<script>
	export default {
		name: 'classify',

		data: () => ({
			arr: [],
			dialogShow: false,
			modelShow: false,
			modelType: 'add',
			className: '',
			classRemark: '',
			Uuid: '',
			modelLabel: '新增分类'
		}),
		mounted() {
			this.class_get_init();
		},
		methods: {
			toWriteArticles(uuid) {
				// uuid  分类 uuid
				this.$router.push({
					path: '/edit?type=edit&classifyUuid=' + uuid
				})
			},
			showdialogEvent(uuid, type, name, remarks) {
				this.modelLabel = !!type ? '新增分类' : '编辑分类'
				if (type) {
					this.dialogShow = true;
				} else {
					this.className = name;
					this.classRemark = remarks;
					this.modelShow = true;
				}
				this.Uuid = uuid;
			},
			addClassModel() {
				this.modelShow = true;
				this.className = '';
				this.classRemark = '';
				this.modelLabel = '新增分类';
			},
			deleteClass() {
				this.request.API_classification_del(this.Uuid, () => {
					this.$toast('删除成功');
					this.class_get_init();
					this.dialogShow = false;
				})
			},

			class_get_init() {
				this.request.API_classification_select((res) => {
					let data = [],
						len = 0;
					if (res.data.doc && res.data.doc.length > 0) {
						if (res.data.doc.length < 3) {
							len = 3 - res.data.doc.length;
						} else {
							len = 3 - (res.data.doc.length % 3);

						}
						data = res.data.doc;
						for (var i = 0; i <= len; i++) {
							data.push({
								isnull: true,
								count: 0
							})
						}
						this.arr = data
					} else {
						this.arr = [];
					}

				})
			},
			save(type) {
				if (type == '新增分类') {
					if (this.className && this.classRemark) {
						this.request.API_classification_add({
							remarks: this.classRemark,
							name: this.className
						}, (res) => {
							this.modelShow = false;
							this.$toast('新增成功');

							this.class_get_init();
						})
					} else {
						this.$toast('请填写完整');
					}
				} else {
					if (this.className && this.classRemark) {
						this.request.API_classification_update({
							remarks: this.classRemark,
							name: this.className,
							uuid: this.Uuid
						}, (res) => {
							this.modelShow = false;
							this.$toast('更新成功');

							this.class_get_init();
						})
					}
				}
			}

		}
	}
</script>
<style lang="less">
	.v-application .pa-12 {
		padding: 20px !important;
	}

	.v-application .headline {
		font-size: 1rem !important;
	}

	.displayVisble {
		visibility: hidden
	}

	.list_content {
		display: flex;
		justify-content: left;
		height: 130px;
		padding: 10px 0;

		.list_right {
			width: 114px;
			flex: unset;
			margin-left: auto;

			.v-btn--fab.v-size--small {
				width: 31px;
				height: 31px;
			}
		}

		.list_left {
			flex: unset;
		}
	}
</style>
