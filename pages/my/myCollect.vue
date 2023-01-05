<template>
	<view class="content">
		<view class="article-top-title">我收藏的文章</view>
		<view class="article-view" v-for="(item, index) in articleList" :key="index" @click="toArticleDetail(item.id)">
			<view class="article-left">
				<view class="title">{{item.title}}</view>
				<view class="topic-name" v-if="item.topicName !== null">{{item.topicName}}️</view>
				<view style="height: 16px;" v-if="item.topicName === null"></view>
				<view class="desc">{{item.remark}}</view>
				<view class="time">{{item.createDate}}</view>
			</view>
			<view class="article-right">
				<image mode="aspectFit" :src="item.coverImg"></image>
			</view>
		</view>
		
		<view class="no-data-view" v-if="articleList == null || articleList.length == 0">暂无内容</view>
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
				articleList: []
			}
		},
		onLoad() {
			this.queryMyCollectArticlePage(1, 10)
		},
		onReachBottom() {
			if(this.pageNum * 10 < this.total) {
				this.pageNum++;
				this.queryMyCollectArticlePage(this.pageNum, this.pageSize)
			}
		},
		onPullDownRefresh () {
			this.articleList = []
			this.pageNum = 1
			this.pageSize = 10
			this.queryMyCollectArticlePage(1, 10)
			uni.stopPullDownRefresh()
		},
		methods: {
			// 我收藏的文章
			queryMyCollectArticlePage(page, limit) {
				http.queryMyCollectArticlePage({page: page, limit: limit, orderField: 'create_date', order: 'desc'}).then((res) => {
					if(res.code == 10020 || res.code == 10021) {
						uni.showToast({title: '未登录', icon: 'error'});
						setTimeout(() => {
							uni.navigateBack({delta: 1})
						}, 1000)
						return;
					}
					if(res.code != 0) {
						uni.showToast({title: res.msg, icon: 'error'});
						return;
					}
					if(res.data.list == null) {
						return;
					}
					this.articleList = this.articleList.concat(res.data.list)
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
		padding-left: 10px;
		padding-right: 10px;
	}
	
	.article-top-title {
		font-size: 14px;
		font-weight: bold;
		margin-top: 10px;
	}
	
	.article-view {
		height: 105px;
		padding-top: 10px;
		padding-bottom: 10px;
		margin-top: 10px;
		border-bottom: 1px solid $uni-text-color-disable;
		
		.article-left {
			float: left;
			width: 70%;
			
			.title {
				font-size: 14px;
				color: #000000;
				font-weight: bold;
			}
			
			.desc {
				font-size: 12px;
				color: $uni-text-color-grey;
				clear: both;
				// 文字超出 ...
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				line-clamp: 1;
				-webkit-box-orient: vertical;
			}
			
			.time {
				font-size: 12px;
				color: $uni-text-color-grey;
				margin-top: 6px;
			}
			
			.topic-name {
				min-width: auto;
				max-width: 70%;
				float: left;
				height: 16px;
				line-height: 16px;
				text-align: center;
				font-size: 10px;
				padding-left: 6px;
				padding-right: 6px;
				background-color: rgb(233, 241, 255);
				border-radius: 4px;
				color: #008fd6;
				margin-top: 6px;
				margin-bottom: 6px;
				// 文字超出 ...
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				line-clamp: 1;
				-webkit-box-orient: vertical;
			}
		}
		
		.article-right {
			float: right;
			width: 30%;
			
			image {
				width: 80px;
				height: 96px;
				float: right;
			}
		}
	}
	
	// 无数据
	.no-data-view {
		font-size: 16px;
		margin-top: 20px;
		color: $uni-text-color-grey;
		text-align: center;
	}
</style>