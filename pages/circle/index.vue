<template>
	<view class="content">
		<!-- 轮播图 -->
		<view class="swiper-view">
			<swiper class="swiper" indicator-dots autoplay interval="3000" duration="800">
				<swiper-item class="swiper-item" v-for="(item, index) in carouselList" :key="index">
					<view class="image-wrapper">
						<image :src="item.url" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<!-- 热门圈子 -->
		<view class="circle-title">热门圈子</view>
		<view class="more-circle" @click="toCircleAll">查看更多 ></view>
		<scroll-view scroll-x="true" class="circle-scroll-view">
			<view class="circle-outside-view">
				<view class="circle-view" v-for="(item, index) in circleList" :key="index"
						:style="{backgroundImage: 'url(' + item.imgUrl + ')'}" @click="toCircleDetail(item.id)">
						
					<view class="top-view" v-if="item.timeDesc != null">{{item.timeDesc}}有人发言</view>
					<view class="title">{{item.title}}</view>
					<view class="desc">已有{{item.joinUserNum}}人参与，{{item.trendsNum}}条动态</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 热门动态 -->
		<view class="list-title">热门动态</view>
		<view class="list-outside-view">
			<view class="list-view" v-for="(item, index) in trendsList" :key="index" @click="toTrendsDetail(item.id)">
				<image mode="aspectFill" :src="item.pictureList[0]"></image>
				<view class="title">{{item.content}}</view>
				<!-- 发布者信息 -->
				<view class="user-view">
					<image mode="aspectFill" :src="item.headUrl"></image>
					<view class="username">{{item.userName}}</view>
				</view>
			</view>
		</view>
		
		<view class="no-data-view" v-if="trendsList.length == 0">暂无讨论</view>
		
		<view style="height: 20px;clear: both;"></view>
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
				// 轮播图
				carouselList: [],
				// 热门圈子（最多展示两个）
				circleList: [],
				// 热门动态
				trendsList: []
			}
		},
		onLoad() {
			this.queryCarouselData(1, 10)
			this.queryCircle(1, 2)
			this.queryTrends(1, 10, "")
		},
		onReachBottom() {
			if(this.pageNum * 10 < this.total) {
				this.pageNum++;
				this.queryTrends(this.pageNum, this.pageSize, "")
			}
		},
		onPullDownRefresh () {
			this.trendsList = []
			this.pageNum = 1
			this.pageSize = 10
			this.queryCircle(1, 2)
			this.queryTrends(1, 10, "")
			uni.stopPullDownRefresh()
		},
		methods: {
			// 查询圈子列表
			queryCircle(page, limit) {
				http.queryCircle({page: page, limit: limit}).then((res)=>{
					this.circleList = res.data.list
				})
			},
			// 查询动态列表
			queryTrends(page, limit, circleId) {
				http.queryTrends({page: page, limit: limit, circleId: circleId}).then((res)=>{
					this.trendsList = this.trendsList.concat(res.data.list)
					this.total = res.data.total
				})
			},
			// 跳转圈子详情
			toCircleDetail(id) {
				uni.navigateTo({url: `/pages/circle/circleDetail?id=${id}`});
			},
			// 跳转动态详情
			toTrendsDetail(id) {
				uni.navigateTo({url: `/pages/trends/detail?id=${id}`});
			},
			// 跳转圈子列表
			toCircleAll() {
				uni.navigateTo({url: '/pages/circle/circleAll'});
			},
			// 查询轮播图
			queryCarouselData(page, limit) {
				http.queryCarousel({page: page, limit: limit, type: '2'}).then((res)=>{
					this.carouselList = res.data.list
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		padding-left: 10px;
		padding-right: 10px;
		background-color: $uni-bg-color-grey;
		// position: fixed;
		// top: 0;
		// left: 0;
		// right: 0;
		// bottom: 0;
		// overflow-y: auto;
	}
	
	// 轮播图
	.swiper-view {
		width: 100%;
		margin-bottom: 30upx;
		
		.swiper {
			height: 220upx;
			
			.swiper-item {
				border-radius: 8px;
				
				.image-wrapper {
					height: 100%;
				}
				
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	
	// 热门圈子
	.circle-title {
		padding-left: 8px;
		border-left: 4px solid #0079FF;
		font-size: 14px;
		font-weight: bold;
	}
	
	.more-circle {
		float: right;
		color: $uni-text-color-grey;
		font-size: $uni-font-size-base;
		margin-bottom: 10px;
		margin-top: -20px;
	}
	
	// 横向滚动
	.circle-scroll-view{
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
	}
	
	.circle-outside-view {
		width: 160%;
		margin-left: -20px;
		// 横向滚动
		display: flex;
		flex-wrap: nowrap;
	
		.circle-view {
			width: 100%;
			height: 120px;
			border-radius: 10px;
			float: left;
			margin-left: 16px;
			padding: 10px;
			color: #FFFFFF;
			
			.top-view {
				background-color: rgba(0, 0, 0, 0.4);
				border-radius: 30px;
				padding-left: 6px;
				padding-right: 6px;
				padding-top: 2px;
				padding-bottom: 2px;
				font-size: 12px;
				width: 56%;
				text-align: center;
			}
			
			.title {
				font-size: 16px;
				font-weight: bold;
				margin-top: 50px;
			}
			
			.desc {
				font-size: 12px;
				margin-top: 10px;
			}
		}
	}
	
	// 热门动态
	.list-title {
		margin-top: 20px;
		padding-left: 8px;
		border-left: 4px solid #0079FF;
		font-size: 14px;
		font-weight: bold;
	}
	.list-outside-view {
		margin-left: -14px;
		
		.list-view {
			width: 45%;
			float: left;
			margin-left: 14px;
			margin-top: 14px;
			background-color: #FFFFFF;
			border-radius: 10px 10px 0 0;
			
			image {
				width: 100%;
				height: 160px;
				border-radius: 10px 10px 0 0;
			}
			
			.title {
				margin-top: 10px;
				font-size: 14px;
				padding-left: 10px;
				padding-right: 10px;
				
				// 文字超出...
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				line-clamp: 1;
				-webkit-box-orient: vertical;
			}
			
			// 发布者信息
			.user-view {
				margin-top: 12px;
				padding-left: 10px;
				padding-right: 10px;
				height: 30px;
				
				image {
					width: 20px;
					height: 20px;
					border-radius: 50px;
					float: left;
				}
				
				.username {
					font-size: 12px;
					color: $uni-text-color-grey;
					margin-left: 6px;
					float: left;
					line-height: 23px;
					width: 78%;
					
					// 文字超出...
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					line-clamp: 1;
					-webkit-box-orient: vertical;
				}
			}
		}
	}
	
	// 无数据
	.no-data-view {
		font-size: 16px;
		margin-top: 30px;
		color: $uni-text-color-grey;
		text-align: center;
	}
	
</style>