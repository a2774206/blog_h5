<template>
	<div class="articles">
		<div class="articlesfloat">
			<v-col>
				<v-select :items="classItems" item-text='tabname' item-value="uuid" label="全部"   @change="selectChange" style="margin-right: 15px;max-width: 120px;"></v-select>

				 <v-text-field
						append-icon="mdi-magnify"
				        light
				        label="关键字" @click:append="searchFilter" v-model="searchText">
				</v-text-field>
			</v-col>
		</div>
		
		
		<v-simple-table style="clear: both;">
			<template v-slot:default>
				<thead>
					<tr>
						<th class="text-left ">标题</th>
						<th class="text-left phoneNone">内容</th>
						<th class="text-left"> 所属分类</th>
						<th class="text-left phoneNone">创建时间</th>
						<th class="text-left">操作</th>

					</tr>
				</thead>
				<tbody>
					<v-tooltip top v-for="(item,i) in artclesArr" :key="i">
						<template v-slot:activator="{ on }">
							<tr v-on="on">
								<td style="min-width: 80px;max-width: 150px;padding: 10px;">{{ item.title | numlimit(0)}}</td>
								<td class="phoneNone alittle_dark" style="max-width: 440px;max-height: 66px;padding: 10px;">{{ item.content|numlimit(1) }}</td>
								<td class="alittle_dark">{{item.tag.tabname}}</td>
								<td class="phoneNone nodark">{{item.created_time|timeFilter(1)}}</td>
								<td> <a href="javascript:void(0)" @click="toWriteArticles(item.uuid)">编辑</a> / <a href="javascript:void(0)" @click="artcledel(item.uuid)">删除</a></td>
							</tr>
						 </template>
							<span> 上次更新时间：{{item.updated_time|timeFilter(1)}}</span>
					   </v-tooltip>
				</tbody>
			</template>
		</v-simple-table>
		<div class="text-center" style="margin-top: 10px;">
			<v-pagination
		        v-model="pageNum"
		        :length="allPageNum"
		        :total-visible="allPageNum"
				@input="pageChange"
		      ></v-pagination>
		</div>
		<v-dialog v-model="dialogShow" persistent max-width="290">
		  
		  <v-card>
			<v-card-title class="headline">提示</v-card-title>
			<v-card-text>是否确认删除？</v-card-text>
			<v-card-actions>
			  <v-spacer></v-spacer>
			  <v-btn color="darken-1" text @click="deleteConfirm">删除</v-btn>
			  <v-btn color="green darken-1" text @click="dialogShow = false">取消</v-btn>
			</v-card-actions>
		  </v-card>
		</v-dialog>
	</div>
</template>

<script>
	export default {
		name: 'articles',

		data: () => ({
			allPageNum:0,
			classItems: [],
			artclesArr: [],
			pageSize:'10',
			pageNum:1,
			keywords:'',
			searchText:'',
			classUuid:'',
			dialogShow:false,
			artcleUuid:''
		}),
		mounted() {
			// alert()
			this.class_get_init();

		},
		filters:{
			timeFilter(value,type){
				var date = new Date(+value);
				var YY = date.getFullYear() + '-';
				var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
				var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
				var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
				var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
				var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
				if(type){
					return YY + MM + DD +" "+hh + mm + ss;
				}else{
					return YY + MM + DD ;
				}
				
			},numlimit(value,type){
				if(type){
					if(value.length > 140){
						return value.toString().slice(0,140) + '...'
					}else{
						return value;
					}
				}else{
					if(value.length > 30){
						return value.toString().slice(0,30) + '...'
					}else{
						return value;
					}
				}
			}
		},
		methods: {
			searchFilter(){
				this.pageNum = 1;
				this.keywords = this.searchText;
				this.articles_get_init();
			},
			pageChange(p){
				this.pageNum = p;
				this.articles_get_init();
			},
			deleteConfirm(){
				this.request.API_articles_del(this.artcleUuid,(res) => {
					this.$toast('删除成功');
					this.dialogShow = false;
					this.class_get_init();
				})
			},
			toWriteArticles(uuid){
				// uuid  分类 uuid
				this.$router.push({
					path:'/edit?type=modiyfy&articleUuid=' + uuid
				})
			},
			artcledel(uuid){
				//删除文章
				this.artcleUuid = uuid;
				this.dialogShow = true;
				
			},
			selectChange(classUuid) {
				this.classUuid = classUuid;
				this.pageNum = 1;
				this.articles_get_init()
			},
			class_get_init() {
				this.request.API_classification_select((res) => {
					let data = [{
						uuid: '',
						tabname: '全部'
					}];
					if (res.data.doc && res.data.doc.length > 0) {
						data = data.concat(res.data.doc);
						console.log(data, 33)
						this.classItems = data;
						// console.log(this.classItems)
					} else {
						this.classItems = [];
					}
					this.articles_get_init()
				})
			},
			articles_get_init() {
				this.request.API_articles_find({
					pageSize:this.pageSize,
					pageNum:this.pageNum,
					keywords:this.keywords,
					classUuid:this.classUuid
				}, (res) => {
					this.artclesArr = res.data;
					this.allPageNum = Math.ceil(res.count / this.pageSize);
					console.log(this.artclesArr)
				})
			}
		}
	}
</script>
<style lang="less">
	
	@media screen and (min-width:320px) and (max-width:913px){
	   .phoneNone{
		   display: none;
	   }
	}
	.articlesfloat .col div.v-input{
		float: left !important;
	}
	.alittle_dark{
		color: #666;
	}
	.nodark{
		color: #999;
	}
</style>
