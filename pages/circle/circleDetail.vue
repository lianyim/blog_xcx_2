<template>
	<view class="content">
		<!-- 圈子介绍 -->
		<view class="circle-outside-view">
			<image class="circle-img" mode="aspectFill" :src="circle.imgUrl"></image>
			<view class="circle-desc-view">
				<view class="title">{{circle.title}}</view>
				<view class="trendsTotal">{{circle.trendsNum}}条动态</view>
				<view class="joinNum">{{circle.joinUserNum}}成员</view>
			</view>
			<view class="btn-view" v-if="!isJoin" @click="joinIn(circle.id)">加入</view>
			<view class="btn-view" v-if="isJoin" @click="joinOut(circle.id)">已加入</view>
		</view>
		<!-- 公告 -->
		<view class="notice">公告：{{circle.notice}}</view>
		
		<!-- 动态 -->
		<view class="trends-outside-view">
			<view class="trends-top-title">讨论列表</view>
			<view class="trends-view" v-for="(item, index) in trendsList" :key="index">
				<view class="user-view">
					<image :src="item.headUrl" mode="aspectFill" @click="toUser(item.creator)"></image>
					<view class="username-view">
						<view class="username">{{item.userName}}</view>
						<view class="time">{{item.createDate}}</view>
					</view>
					<image class="more" mode="aspectFill" src="../../static/imgs/trends/more_vertical.png" @click="share"></image>
				</view>
				<view class="trends-content" @click="toTrendsDetail(item)">{{item.content}}</view>
				<view class="img-view">
					<image mode="aspectFill" class="trends-img" :src="e"
						v-for="(e, i) in item.pictureList" :key="i" @click="previewImage(item.pictureList, i)"></image>
				</view>
			</view>
			
			<view class="no-data-view" v-if="trendsList.length == 0">暂无讨论</view>
		</view>
		<view class="publish-discuss" @click="toAddTrends">#参与讨论</view>
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
				isJoin: false,
				circle: {},
				// 动态列表
				trendsList: []
			}
		},
		onShow() {
			
		},
		onLoad(e) {
			this.getCircle(e.id)
			this.queryTrends(1, 10, e.id)
		},
		onReachBottom() {
			console.log('1')
			if(this.pageNum * 10 < this.total) {
				this.pageNum++;
				this.queryTrends(this.pageNum, this.pageSize, this.circle.id)
			}
		},
		onPullDownRefresh () {
			this.trendsList = []
			this.pageNum = 1
			this.pageSize = 10
			this.total = 0
			this.getCircle(this.circle.id)
			this.queryTrends(1, 10, this.circle.id)
			uni.stopPullDownRefresh()
		},
		methods: {
			// 查询圈子详情
			getCircle(id) {
				http.getCircle({id: id}).then((res) => {
					if(res.code != 0) {
						uni.showToast({title: res.msg, icon: 'error'});
						return;
					}
					this.circle = res.data
					this.isLink(res.data.id)
				})
			},
			// 查询动态列表
			queryTrends(page, limit, circleId) {
				http.queryTrends({page: page, limit: limit, circleId: circleId, orderField: 'create_date', order: 'desc'}).then((res)=>{
					this.trendsList = this.trendsList.concat(res.data.list)
					this.total = res.data.total
				})
			},
			// 跳转动态详情
			toTrendsDetail(item) {
				uni.navigateTo({url: `/pages/trends/detail?id=${item.id}`});
			},
			// 跳转个人中心
			toUser(userId) {
				uni.navigateTo({url: `/pages/my/user?userId=${userId}`});
			},
			// 图片预览
			previewImage(arr, i) {
				uni.previewImage({
					current: arr[i],
					urls: arr
				})
			},
			// 分享
			share() {
				uni.showToast({title: '功能完善中', icon: 'none'});
			},
			// 跳转页面
			toPageByUrl(url) {
				uni.navigateTo({url: `${url}`});
			},
			// 跳转发表动态页面
			toAddTrends() {
				if(!this.isJoin) {
					uni.showToast({title: '请先加入圈子', icon: 'none'});
					return;
				}
				uni.navigateTo({url: `/pages/trends/add?circleId=${this.circle.id}`});
			},
			// 加入圈子
			joinIn(id) {
				http.addMyLink({sourceId: id, category: '2', status: '0'}).then((res)=>{
					if(res.code == 10020 || res.code == 10021) {
						uni.showToast({title: '未登录', icon: 'error'});
						return;
					}
					if(res.code != 0) {
						uni.showToast({title: res.msg, icon: 'error'});
						return;
					}
					this.isLink(this.circle.id)
					this.isJoin = true
				})
			},
			// 退出圈子
			joinOut(id) {
				http.updateMyLink({sourceId: id, category: '2', status: '1'}).then((res)=>{
					if(res.code == 10020 || res.code == 10021) {
						uni.showToast({title: '未登录', icon: 'error'});
						return;
					}
					if(res.code != 0) {
						uni.showToast({title: res.msg, icon: 'error'});
						return;
					}
					this.isLink(this.circle.id)
					this.isJoin = false
				})
			},
			// 是否关联（加入圈子）
			isLink(id) {
				http.isLink({sourceId: id, category: '2'}).then((res)=>{
					if(res.code != 0) {
						return;
					}
					this.isJoin = res.data
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
	}
	
	// 圈子介绍
	.circle-outside-view {
		height: 140px;
		background-color: rgba(0, 0, 0, 0.7);
		padding-left: 10px;
		padding-right: 10px;
		padding-top: 30px;
		
		.circle-img {
			width: 80px;
			height: 80px;
			border-radius: 10px;
			float: left;
		}
		
		.circle-desc-view {
			float: left;
			margin-left: 10px;
			width: 52%;
			color: #FFFFFF;
			padding-top: 4px;
			
			.title {
				font-size: 16px;
			}
			.trendsTotal {
				font-size: 12px;
				margin-top: 10px;
			}
			.joinNum {
				font-size: 12px;
				margin-top: 6px;
			}
		}
		
		.btn-view {
			width: 50px;
			border-radius: 40px;
			font-size: 14px;
			padding-left: 6px;
			padding-right: 6px;
			padding-top: 4px;
			padding-bottom: 4px;
			float: right;
			background-color: #ffaa00;
			text-align: center;
			margin-top: 22px;
		}
	}
	
	// 公告
	.notice {
		margin-top: -36px;
		font-size: 14px;
		padding-left: 10px;
		padding-right: 10px;
		color: #FFFFFF;
	}
	
	// 动态列表
	.trends-outside-view {
		// margin-top: -22px;
		margin-top: 10px;
		border-radius: 4px 4px 0 0;
		background-color: #FFFFFF;
		// position: fixed;
		// top: 185px;
		// left: 0;
		// right: 0;
		// bottom: 0;
		overflow-y: auto;
		padding-top: 14px;
		padding-left: 10px;
		padding-right: 10px;
		
		.trends-top-title {
			font-size: 16px;
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
					width: 76%;
					
					.username {
						font-size: 14px;
						
						// 文字超出...
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
				clear: both;
			}
			
			.img-view {
				margin-left: -10px;
				
				.trends-img {
					margin-top: 10px;
					width: 46%;
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
		margin-top: 30px;
		color: $uni-text-color-grey;
		text-align: center;
	}
	
	// 参与讨论
	.publish-discuss {
		background-color: #ffaa00;
		width: 86px;
		height: 20px;
		line-height: 20px;
		border-radius: 50px;
		position: fixed;
		bottom: 40px;
		left: 40%;
		color: #FFFFFF;
		font-size: 14px;
		text-align: center;
		padding-top: 4px;
		padding-bottom: 4px;
	}
</style>