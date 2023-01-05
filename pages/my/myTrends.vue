<template>
	<view class="content">
		<view class="trends-outside-view">
			<view class="trends-top-title">我发布的动态</view>
			<view class="trends-view" v-for="(item, index) in trendsList" :key="index">
				<view class="user-view">
					<image :src="item.headUrl" mode="aspectFill"></image>
					<view class="username-view">
						<view class="username">{{item.userName}}</view>
						<view class="time">{{item.createDate}}</view>
					</view>
					<!-- <image class="more" mode="aspectFill" src="../../static/imgs/trends/more_vertical.png"></image> -->
				</view>
				<view class="trends-content" @click="toTrendsDetail(item.id)">{{item.content}}</view>
				<view class="img-view">
					<image mode="aspectFill" class="trends-img" :src="e"
						v-for="(e, i) in item.pictureList" :key="i" @click="previewImage(item.pictureList, i)"></image>
				</view>
			</view>
		</view>
		
		<view class="no-data-view" v-if="trendsList == null || trendsList.length == 0">暂无内容</view>
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
				userId: '',
				// 动态列表
				trendsList: []
			}
		},
		onLoad(e) {
			this.userId = e.userId
			this.queryTrends(1, 10, e.userId)
		},
		onReachBottom() {
			if(this.pageNum * 10 < this.total) {
				this.pageNum++;
				this.queryTrends(this.pageNum, this.pageSize, this.userId)
			}
		},
		onPullDownRefresh () {
			this.trendsList = []
			this.pageNum = 1
			this.pageSize = 10
			this.queryTrends(1, 10, this.userId)
			uni.stopPullDownRefresh()
		},
		methods: {
			// 我的动态
			queryTrends(page, limit, creator) {
				http.queryTrends({page: page, limit: limit, creator: creator}).then((res)=>{
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
					this.trendsList = this.trendsList.concat(res.data.list)
					this.total = res.data.total
				})
			},
			// 跳转动态详情
			toTrendsDetail(id) {
				uni.navigateTo({url: `/pages/trends/detail?id=${id}`});
			},
			// 图片预览
			previewImage(arr, i) {
				uni.previewImage({
					current: arr[i],
					urls: arr
				})
			}
		}
	}
</script>

<style lang="scss">
	.trends-outside-view {
		border-radius: 4px 4px 0 0;
		background-color: #FFFFFF;
		padding-top: 14px;
		padding-left: 10px;
		padding-right: 10px;
		
		.trends-top-title {
			font-size: 14px;
			font-weight: bold;
		}
		
		.trends-view {
			margin-top: 28px;
			padding-bottom: 20px;
			border-bottom: 1px solid $uni-border-color;
			
			.user-view {
				height: 40px;
				margin-bottom: 10px;
				
				image {
					width: 40px;
					height: 40px;
					border-radius: 50px;
					float: left;
				}
				.username-view {
					float: left;
					margin-left: 8px;
					
					.username {
						font-size: 14px;
					}
					.time {
						font-size: 12px;
						color: $uni-text-color-grey;
						margin-top: 4px;
					}
				}
				.more {
					float: right;
					width: 20px;
					height: 20px;
					margin-top: 10px;
				}
			}
			
			.trends-content {
				
			}
			
			.img-view {
				margin-left: -10px;
				
				.trends-img {
					margin-top: 10px;
					width: 160px;
					height: 200px;
					border-radius: 4px;
					margin-left: 10px;
				}
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