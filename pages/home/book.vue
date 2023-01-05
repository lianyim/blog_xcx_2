<template>
	<view class="content">
		<view class="book-outside-view">
			<view class="book-view" v-for="(item, index) in bookList" :key="index" @click="toArticleDetail(item.id)">
				<image mode="aspectFill" :src="item.coverImg"></image>
				<view class="desc-view">
					<view class="book-desc">{{item.title}}</view>
					<view class="price">
						<text style="font-size: 13px;color: #ffaa00;">推荐价格 </text>
						￥{{item.remark}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import http from "@/api/backend.js"
	export default {
		data() {
			return {
				pageNum: 1,
				pageSize: 10,
				total: 0,
				bookList: []
			}
		},
		onLoad() {
			this.queryBook(1, 10, 1)
		},
		onReachBottom() {
			if(this.pageNum * 10 < this.total) {
				this.pageNum++;
				this.queryBook(this.pageNum, this.pageSize, 1)
			}
		},
		onPullDownRefresh () {
			this.bookList = []
			this.pageNum = 1
			this.pageSize = 10
			this.queryBook(1, 10, 1)
			uni.stopPullDownRefresh()
		},
		methods: {
			// 查询书籍列表
			queryBook(page, limit, category) {
				http.queryArticle({page: page, limit: limit, category}).then((res)=>{
					this.bookList = this.bookList.concat(res.data.list)
					this.total = res.data.total
				})
			},
			// 跳转文章详情
			toArticleDetail(id) {
				uni.navigateTo({url: `/pages/article/detail?id=${id}`});
			}
		}
	}
</script>

<style lang="scss">
	.content {
		background-color: #f0f0f0;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		overflow-y: auto;
	}
	
	.book-outside-view {
		border-radius: 10px;
		padding-left: 10px;
		padding-right: 10px;
		padding-bottom: 12px;
		min-height: 164px;
		max-height: auto;
		overflow-y: hidden;
		
		.book-view {
			height: 80px;
			border-radius: 10px;
			padding-left: 10px;
			padding-right: 10px;
			padding-top: 10px;
			padding-bottom: 10px;
			background-color: #FFFFFF;
			margin-top: 10px;
			
			image {
				width: 30%;
				height: 80px;
				border-radius: 10px;
				float: left;
			}
			
			.desc-view {
				float: left;
				margin-left: 10px;
				width: 66%;
				
				.book-desc {
					height: 40px;
					font-size: 14px;
					color: $uni-text-color;
					margin-top: 4px;
					
					// 文字超出...
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				.price {
					color: #ff0000;
					font-size: 16px;
					margin-top: 10px;
				}
			}
		}
	}
</style>