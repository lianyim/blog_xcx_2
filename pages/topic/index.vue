<template>
	<view class="content">
		<!-- 切换图标 -->
		<view class="change-view" @click="changeCardType">
			<image src="../../static/imgs/topic/change.png" mode="aspectFit"></image>
		</view>
		
		<!-- 专题列表（样式一） -->
		<view class="card-view" v-if="cardType" :style="{backgroundImage: 'url(' + item.coverImg + ')'}"
			v-for="(item, index) in topicList" :key="index" @click="toArticleIndex(item.id)">
			<view class="title">{{item.name}}</view>
			<view class="desc">{{item.desc}}</view>
			<view class="remark">{{item.specialty}}</view>
			<view></view>
			<view class="num">{{item.articleNum}}篇文章</view>
		</view>
		
		<!-- 专题列表（样式二） -->
		<view class="topic-outside-view" v-if="!cardType">
			<view class="topic-view" :style="{backgroundImage: 'url(' + item.coverImg + ')'}"
				 v-for="(item, index) in topicList" :key="index" @click="toArticleIndex(item.id)">
				<view class="title">{{item.name}}</view>
				<view class="desc">{{item.desc}}</view>
				<view class="num">{{item.articleNum}}篇文章</view>
			</view>
		</view>
		
		<view style="height: 20px;"></view>
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
				// 卡片类型（true、一行一个，false、一行两个）
				cardType: true,
				topicList: []
			}
		},
		onLoad() {
			this.queryTopic(1, 10)
		},
		onReachBottom() {
			if(this.pageNum * 10 < this.total) {
				this.pageNum++;
				this.topicList(this.pageNum, this.pageSize)
			}
		},
		methods: {
			// 查询专题列表
			queryTopic(page, limit) {
				http.queryHotTopic({page: page, limit: limit}).then((res)=>{
					this.topicList = this.topicList.concat(res.data.list)
					this.total = res.data.total
				})
			},
			// 切换卡片样式
			changeCardType() {
				this.cardType = !this.cardType
			},
			// 跳转专题详情（文章列表）
			toArticleIndex(id) {
				uni.navigateTo({url: `/pages/topic/detail?id=${id}`});
			}
		}
	}
</script>

<style lang="scss">
	.content {
		padding-left: 10px;
		padding-right: 10px;
	}
	
	.change-view {
		height: 24px;
		margin-top: 10px;
		
		image {
			width: 24px;
			height: 24px;
			float: right;
		}
	}
	
	.card-view {
		height: 110px;
		border-radius: 6px;
		padding-left: 20px;
		padding-right: 10px;
		padding-top: 16px;
		padding-bottom: 16px;
		color: #FFFFFF;
		margin-top: 10px;
		
		.title {
			font-size: 16px;
			margin-top: 10px;
		}
		.desc {
			font-size: 12px;
			margin-top: 6px;
			height: 30px;
		}
		.remark {
			font-size: 12px;
			margin-top: 10px;
			padding-left: 8px;
			padding-right: 8px;
			padding-top: 4px;
			padding-bottom: 4px;
			background-color: #FFFFFF;
			color: #0037a7;
			display: inline-block;
		}
		.num {
			background-color: rgba(0, 0, 0, 0.4);
			float: right;
			font-size: 12px;
			border-radius: 50px;
			padding-left: 8px;
			padding-right: 8px;
			padding-top: 4px;
			padding-bottom: 4px;
			margin-top: -10px;
		}
	}
	
	.topic-outside-view {
		height: 190px;
		margin-left: -9px;
		
		.topic-view {
			width: 40%;
			height: 70px;
			margin-left: 12px;
			color: #FFFFFF;
			padding-left: 10px;
			padding-top: 10px;
			padding-bottom: 10px;
			padding-right: 6px;
			border-radius: 6px;
			float: left;
			margin-top: 10px;
			
			.title {
				font-size: 14px;
				margin-top: 6px;
				margin-left: 6px;
			}
			
			.desc {
				font-size: 12px;
				margin-top: $uni-spacing-col-sm;
				margin-left: 6px;
				height: 30px;
				
				// 文字超出...
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				line-clamp: 2;
				-webkit-box-orient: vertical;
			}
			.num {
				background-color: rgba(0, 0, 0, 0.4);
				float: right;
				font-size: 10px;
				border-radius: 50px;
				padding-left: 6px;
				padding-right: 6px;
				padding-top: 4px;
				padding-bottom: 4px;
				margin-top: -58px;
			}
		}
	}
</style>