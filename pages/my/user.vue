<template>
	<view class="content">
		<!-- 个人信息 -->
		<view class="top-user-view">
			<image class="user-bgImg" mode="aspectFill" :src="userInfo.headUrl"></image>
			<view class="username">{{userInfo.username}}</view>
			<view class="num-view">
				<text>发布 {{userInfo.trendsNum}} 条动态</text>
				<!-- <text>登录 {{userInfo.time}} 天</text> -->
			</view>
			<view v-if="isShowBtn && !followed" class="follow-view" @click="follow">关注</view>
			<view v-if="isShowBtn && followed" class="follow-view" @click="follow">已关注</view>
		</view>
		
		<!-- 动态 -->
		<view class="trends-outside-view">
			<view class="trends-view" v-for="(item, index) in trendsList" :key="index">
				<view class="user-view">
					<image :src="item.headUrl" mode="aspectFill"></image>
					<view class="username-view">
						<view class="username">{{item.userName}}</view>
						<view class="time">{{item.timeDesc}}</view>
					</view>
					<!-- <image class="more" mode="aspectFill" src="../../static/imgs/trends/more_vertical.png"></image> -->
				</view>
				<view class="trends-content" @click="toTrendsDetail(item.id)">{{item.content}}</view>
				<view class="circle-view" @click="toCircleDetail(item.circleId)">{{item.circleName}}</view>
				<view class="trends-img-view">
					<image mode="aspectFill" class="trends-img" :src="e"
						v-for="(e, index) in item.pictureList" :key="index" @click="previewImage(item.pictureList)"></image>
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
				// 动态列表
				trendsList: [],
				userInfo: {},
				// 是否展示关注按钮
				isShowBtn: false,
				followed: false
			}
		},
		onLoad(e) {
			this.getUserInfo(e.userId)
			this.queryTrends(1, 10, e.userId)
		},
		methods: {
			// 跳转动态详情
			toTrendsDetail(trendsId) {
				uni.navigateTo({url: `/pages/trends/detail?id=${trendsId}`});
			},
			// 跳转圈子详情
			toCircleDetail(circleId) {
				uni.navigateTo({url: `/pages/circle/circleDetail?id=${circleId}`});
			},
			// 图片预览
			previewImage(arr) {
				uni.previewImage({
					current: arr[0],
					urls: arr
				})
			},
			// 关注
			follow() {
				// 关注
				if(!this.followed) {
					http.addMyLink({sourceId: this.userInfo.id, category: '3', status: '0'}).then((res)=>{
						if(res.code == 10020 || res.code == 10021) {
							uni.showToast({title: '未登录', icon: 'error'});
							return;
						}
						if(res.code != 0) {
							uni.showToast({title: res.msg, icon: 'error'});
							return;
						}
						this.isLink(this.userInfo.id)
						this.followed = true
					})
				} else {
					// 取消关注
					http.updateMyLink({sourceId: this.userInfo.id, category: '3', status: '1'}).then((res)=>{
						if(res.code == 10020 || res.code == 10021) {
							uni.showToast({title: '未登录', icon: 'error'});
							return;
						}
						if(res.code != 0) {
							uni.showToast({title: res.msg, icon: 'error'});
							return;
						}
						this.isLink(this.userInfo.id)
						this.followed = false
					})
				}
			},
			// 是否关联（关注用户）
			isLink(id) {
				http.isLink({sourceId: id, category: '3'}).then((res)=>{
					if(res.code != 0) {
						return;
					}
					this.followed = res.data
				})
			},
			// 用户信息
			getUserInfo(userId) {
				http.getUserInfo({userId, userId}).then((res)=>{
					if(res.code != 0) {
						uni.showToast({title: res.msg, icon: 'error'});
						return;
					}
					this.userInfo = res.data
					this.isLink(res.data.id)
					let userInfo = uni.getStorageSync('userInfo');
					// 非本人时显示关注按钮
					if(res.data.id != userInfo.id) {
						this.isShowBtn = true
					}
				})
			},
			// 查询动态列表
			queryTrends(page, limit, userId) {
				http.queryTrends({page: page, limit: limit, creator: userId}).then((res)=>{
					if(res.code != 0) {
						uni.showToast({title: res.msg, icon: 'error'});
						return;
					}
					this.trendsList = res.data.list
				})
			}
		}
	}
</script>

<style lang="scss">
	.top-user-view {
		background-image: url(https://lian-blog.oss-cn-hangzhou.aliyuncs.com/images/2022/12/10/beijing.png);
		padding-left: 20px;
		padding-right: 20px;
		padding-top: 20px;
		padding-bottom: 20px;
	
		.user-bgImg {
			width: 80px;
			height: 80px;
			border-radius: 50px;
		}
		
		.username {
			margin-top: 10px;
			font-size: 16px;
			color: #FFFFFF;
			
			// 文字超出...
			text-overflow: -o-ellipsis-lastline;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
		}
		
		.num-view {
			margin-top: 10px;
			margin-left: -10px;
			
			text {
				font-size: 14px;
				color: #FFFFFF;
				margin-left: 10px;
			}
		}
		
		.follow-view {
			width: 50px;
			border-radius: 40px;
			font-size: 14px;
			padding-left: 4px;
			padding-right: 4px;
			padding-top: 4px;
			padding-bottom: 4px;
			float: right;
			background-color: rgba(144, 148, 178, 0.6);
			text-align: center;
			color: #FFFFFF;
			margin-top: -130px;
			margin-right: 20px;
		}
	}
	
	.trends-outside-view {
		border-radius: 4px 4px 0 0;
		background-color: #FFFFFF;
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
					width: 66%;
					margin-left: 8px;
					
					.username {
						font-size: 14px;
						
						// 文字超出 ...
						text-overflow: -o-ellipsis-lastline;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						line-clamp: 2;
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
				margin-top: 20px;
				width: 82%;
			}
			
			.trends-img-view {
				margin-top: 10px;
				margin-left: -10px;
				overflow: hidden;
				
				.trends-img {
					width: 160px;
					height: 200px;
					border-radius: 4px;
					margin-left: 10px;
					margin-top: 10px;
					float: left;
				}
			}
			
			.circle-view {
				font-size: 14px;
				float: right;
				min-width: auto;
				max-width: 40%;
				padding-left: 8px;
				padding-right: 8px;
				border-radius: 4px;
				background-color: rgb(233, 241, 255);
				color: #008fd6;
				margin-top: -26px;
				
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
	}
</style>