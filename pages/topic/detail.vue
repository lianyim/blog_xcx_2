<template>
	<view class="content">
		<!-- 专题图片 -->
		<view class="topic-img-view">
			<image :src="topic.coverImg" mode="aspectFill"></image>
			<view class="title">{{topic.name}}</view>
		</view>
		
		<!-- 文章列表 -->
		<view class="article-view" v-for="(item, index) in articleList" :key="index" @click="toArticleDetail(item.id)">
			<view class="article-left">
				<view class="title">{{item.title}}</view>
				<view class="desc">{{item.remark}}</view>
				<view class="time">{{item.createDate}}</view>
			</view>
			<view class="article-right">
				<image mode="aspectFit" :src="item.coverImg"></image>
			</view>
		</view>
		
		<view class="no-data-view" v-if="articleList == null || articleList.length == 0">暂无文章</view>
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
				topic: {},
				articleList: []
			}
		},
		onLoad(e) {
			this.getTopic(e.id)
			this.queryArticle(1, 10, 0, e.id)
		},
		onReachBottom() {
			if(this.pageNum * 10 < this.total) {
				this.pageNum++;
				this.queryArticle(this.pageNum, this.pageSize, 0, this.topic.id)
			}
		},
		onPullDownRefresh () {
			this.articleList = []
			this.pageNum = 1
			this.pageSize = 10
			this.getTopic(this.topic.id)
			this.queryArticle(this.pageNum, this.pageSize, 0, this.topic.id)
			uni.stopPullDownRefresh()
		},
		methods: {
			// 查询专题详情
			getTopic(id) {
				http.getTopic({id: id}).then((res) => {
					this.topic = res.data
				})
			},
			/**
			 * 查询文章列表
			 * @param {Object} category 分类 0-文章 1-书籍
			 * @param {Object} topicId 专题ID
			 */
			queryArticle(page, limit, category, topicId) {
				http.queryArticle({page: page, limit: limit, category, topicId: topicId, order: 'desc'}).then((res)=>{
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
	
	.topic-img-view {
		height: 200px;
		
		image {
			height: 200px;
			width: 100%;
		}
		
		.title {
			height: 30px;
			margin-top: -50px;
			font-size: 14px;
			color: #ffffff;
			font-weight: bold;
			padding: 10px;
		}
	}
	
	// 文章列表
	.article-view {
		height: 90px;
		padding: 10px;
		margin-top: 10px;
		border-bottom: 1px solid $uni-text-color-disable;
		
		.article-left {
			float: left;
			width: 65%;
			
			.title {
				font-size: 14px;
				color: #000000;
				font-weight: bold;
			}
			
			.desc {
				font-size: 12px;
				color: $uni-text-color-grey;
				margin-top: 4px;
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
		}
		
		.article-right {
			float: right;
			width: 30%;
			
			image {
				width: 80px;
				height: 90px;
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