<template>
	<view class="content">
		<!-- 动态 -->
		<view class="trends-outside-view">
			<view class="trends-view">
				<view class="user-view">
					<image :src="trends.headUrl" mode="aspectFill" @click="toUser(trends.creator)"></image>
					<view class="username-view">
						<view class="username">{{trends.userName}}</view>
						<view class="time">{{trends.createDate}}</view>
					</view>
					<image class="more" mode="aspectFill" src="../../static/imgs/trends/more_vertical.png" @click="more"></image>
					<view v-if="isShowBtn && !followed" class="follow-view" @click="follow(trends.id)">关注</view>
					<view v-if="isShowBtn && followed" class="follow-view" @click="follow(trends.id)">已关注</view>
				</view>
				<view class="trends-content">{{trends.content}}</view>
				<view class="img-view">
					<image mode="aspectFill" class="trends-img" :src="item"
						v-for="(item, index) in trends.pictureList" :key="index" @click="previewImage(trends.pictureList, index)"></image>
				</view>
				<view class="read-num">{{trends.readNum}} 浏览</view>
				<view class="circle-view" @click="toCircleDetail(trends.circleId)">
					<text>{{trends.circleName}}🏷</text>
					<!-- <image src="../../static/imgs/trends/quan.png" mode="aspectFill"></image> -->
				</view>
			</view>
		</view>
		
		<!-- 评论 -->
		<comment-comp title="全部回复" :commentList="commentList" type="4" :sourceId="trends.id" @backHome="reloadComment()"></comment-comp>
		
		<view class="no-data-view" v-if="commentList == null || commentList.length == 0">暂无评论</view>
	</view>
</template>

<script>
	import http from "@/api/backend.js"
	// 评论组件
	import commentComp from "@/components/comment.vue"
	export default {
		components: {
			commentComp
		},
		data() {
			return {
				pageNum: 1,
				pageSize: 10,
				total: 0,
				// 动态
				trends: {},
				// 是否关注
				followed: false,
				// 评论数据
				commentList: [],
				// 是否展示关注按钮
				isShowBtn: false
			}
		},
		onLoad(e) {
			this.getTrends(e.id)
			this.queryComment(1, 10, e.id, 4)
		},
		onReachBottom() {
			if(this.pageNum * 10 < this.total) {
				this.pageNum++;
				this.queryComment(this.pageNum, this.pageSize, this.trends.id, 4)
			}
		},
		methods: {
			// 动态详情
			getTrends(id) {
				http.getTrends({id: id}).then((res)=>{
					// if(res.code != 0) {
					// 	uni.showToast({title: res.msg, icon: 'error'});
					// 	return;
					// }
					this.followed = res.data.isFocus
					this.trends = res.data
					this.isLink(res.data.creator)
					let userInfo = uni.getStorageSync('userInfo');
					// 非本人时显示关注按钮
					if(res.data.creator != userInfo.id) {
						this.isShowBtn = true
					}
				})
			},
			// 评论列表
			queryComment(page, limit, sourceId, sourceType) {
				http.queryComment({page: page, limit: limit, sourceType: sourceType, sourceId: sourceId, orderField: 'create_date', order: 'desc'}).then((res)=>{
					if(res.code != 0) {
						uni.showToast({title: res.msg, icon: 'error'});
						return;
					}
					res.data.list.forEach(e => {
						e.isUnfold = false
					})
					this.commentList = this.commentList.concat(res.data.list)
					this.total = res.data.total
				})
			},
			// 图片预览
			previewImage(arr, i) {
				uni.previewImage({
					current: arr[i],
					urls: arr
				})
			},
			// 跳转圈子详情
			toCircleDetail(circleId) {
				uni.navigateTo({url: `/pages/circle/circleDetail?id=${circleId}`});
			},
			// 跳转个人中心
			toUser(userId) {
				uni.navigateTo({url: `/pages/my/user?userId=${userId}`});
			},
			// 关注
			follow(sourceId) {
				// 关注
				if(!this.followed) {
					http.addMyLink({sourceId: this.trends.creator, category: '3', status: '0'}).then((res)=>{
						if(res.code == 10020 || res.code == 10021) {
							uni.showToast({title: '未登录', icon: 'error'});
							return;
						}
						if(res.code != 0) {
							uni.showToast({title: res.msg, icon: 'error'});
							return;
						}
						this.isLink(this.trends.creator)
						this.followed = true
					})
				} else {
					// 取消关注
					http.updateMyLink({sourceId: this.trends.creator, category: '3', status: '1'}).then((res)=>{
						if(res.code == 10020 || res.code == 10021) {
							uni.showToast({title: '未登录', icon: 'error'});
							return;
						}
						if(res.code != 0) {
							uni.showToast({title: res.msg, icon: 'error'});
							return;
						}
						this.isLink(this.trends.creator)
						this.followed = false
					})
				}
			},
			// 更多
			more() {
				uni.showToast({title: '功能完善中', icon: 'none'});
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
			// 评论组件刷新
			reloadComment() {
				this.pageNum = 1
				this.pageSize = 10
				this.commentList = []
				this.queryComment(1, 10, this.trends.id, '4')
			}
		}
	}
</script>

<style lang="scss">
	.content {
		padding-left: 10px;
		padding-right: 10px;
	}
	
	// 动态列表
	.trends-outside-view {
		border-radius: 4px 4px 0 0;
		background-color: #FFFFFF;
		padding-top: 14px;
		
		.trends-view {
			padding-bottom: 20px;
			
			.user-view {
				margin-bottom: 10px;
				overflow: hidden;
				
				image {
					width: 40px;
					height: 40px;
					border-radius: 50px;
					float: left;
				}
				.username-view {
					float: left;
					margin-left: 8px;
					width: 60%;
					
					.username {
						font-size: 14px;
					}
					.time {
						font-size: 12px;
						color: $uni-text-color-grey;
						margin-top: 4px;
					}
				}
				.follow-view {
					width: 42px;
					border-radius: 40px;
					font-size: 12px;
					padding-left: 4px;
					padding-right: 4px;
					padding-top: 2px;
					padding-bottom: 2px;
					float: right;
					background-color: #ffaa00;
					text-align: center;
					margin-top: 9px;
					color: #FFFFFF;
					margin-right: 10px;
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
					width: 46%;
					height: 200px;
					border-radius: 4px;
					margin-left: 10px;
				}
			}
			
			.read-num {
				font-size: 12px;
				color: $uni-text-color-grey;
				margin-top: 12px;
			}
			
			.circle-view {
				float: right;
				min-width: auto;
				max-width: 80%;
				padding-left: 8px;
				padding-right: 8px;
				border-radius: 4px;
				background-color: rgb(233, 241, 255);
				color: #008fd6;
				margin-top: -20px;
				font-size: 14px;
				// 文字超出 ...
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				line-clamp: 1;
				-webkit-box-orient: vertical;
				
				text {
					font-size: 14px;
				}
				
				image {
					width: 26px;
					height: 26px;
					border-radius: 50px;
					margin-left: 4px;
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