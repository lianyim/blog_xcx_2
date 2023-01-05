<template>
	<view class="content">
		<!-- 评论框 -->
		<view class="send-comment-view">
			<input type="text" placeholder="爱评论的人运气不会差哦" class="comment-input" v-model="content" />
			<button @click="submit(null, content)" class="send-btn">发送</button>
		</view>
		
		<!-- 评论 -->
		<view class="comment-title">{{title}}</view>
		
		<view class="comment-view" v-for="(item, index) in commentList" :key="index">
			<!-- 父评论 -->
			<view class="parent-view">
				<image class="head-img" mode="aspectFill" :src="item.headUrl"></image>
				<view class="username-view">
					<view class="username">{{item.userName}}</view>
					<view class="trends-content">{{item.content}}</view>
				</view>
				<view class="like-view" v-if="false">
					<view class="like-num">{{item.likeNum}}</view>
					<image v-if="!item.like" class="like-img" mode="aspectFill" src="../static/imgs/trends/like.png" @click="like(item)"></image>
					<image v-if="item.like" class="like-img" mode="aspectFill" src="../static/imgs/trends/like_selected.png" @click="like(item)"></image>
				</view>
				<view class="time">{{item.timeDesc}}</view>
				<view class="apply-title" @click="replyComment(item)">回复</view>
				<!-- <view class="comment-unfold" v-if="item.childComments.length > 0 && !isUnfold" @click="commentUnfold(item)">展开更多回复 > </view> -->
				<!-- <view class="comment-unfold" v-if="item.childComments.length > 0 && isUnfold" @click="commentPackUp(item)">收起</view> -->
			</view>
			<!-- 子评论 -->
			<view class="child-view" v-for="(e, i) in item.childComments" :key="i">
				<image class="head-img" mode="aspectFill" :src="e.headUrl"></image>
				<view class="username-view">
					<view class="username">{{e.userName}}</view>
					<view class="trends-content">{{e.content}}</view>
				</view>
				<view class="like-view" v-if="false">
					<view class="like-num">{{e.likeNum}}</view>
					<image v-if="!e.like" class="like-img" mode="aspectFill" src="../static/imgs/trends/like.png" @click="like(e)"></image>
					<image v-if="e.like" class="like-img" mode="aspectFill" src="../static/imgs/trends/like_selected.png" @click="like(e)"></image>
				</view>
				<view class="time">{{e.timeDesc}}</view>
				<view class="apply-title" @click="replyComment(e)">回复</view>
				
				<!-- 三级回复 -->
				<view class="child-reply-view" v-for="(p, x) in e.childComments" :key="x">
					<image class="head-img" mode="aspectFill" :src="p.headUrl"></image>
					<view class="username-view">
						<view class="username">{{p.userName}}</view>
						<view class="reply-desc">@{{p.parentUserName}} </view>
						<view class="trends-content">{{p.content}}</view>
					</view>
					<view class="like-view" v-if="false">
						<view class="like-num">{{p.likeNum}}</view>
						<image v-if="!p.like" class="like-img" mode="aspectFill" src="../static/imgs/trends/like.png" @click="like(e)"></image>
						<image v-if="p.like" class="like-img" mode="aspectFill" src="../static/imgs/trends/like_selected.png" @click="like(e)"></image>
					</view>
					<view class="time">{{p.timeDesc}}</view>
					<view class="apply-title" @click="replyComment(p)">回复</view>
				</view>
			</view>
		</view>
		<view style="height: 40px;"></view>
	</view>
</template>

<script>
	import http from "@/api/backend.js"
	var _self;
	export default {
		created() {
			_self = this
		},
		// type评论类型 4-动态
		props: ['commentList', 'title', 'type', 'sourceId'],
		data() {
			return {
				content: ''
			}
		},
		methods: {
			// 点赞
			like(e) {
				console.log(e.like)
				e.like = !e.like
			},
			// 回复评论
			replyComment(item) {
				console.log(item)
				let userName = item.userName.length > 8 ? item.userName.substring(0, 8) + '...' : item.userName
				uni.showModal({
				    title: '评论',
					confirmText: '回复',
					editable: true,
					placeholderText: '回复@' + userName,
				    success: function (res) {
				        if (res.confirm) {
							if(res.content == '') {
								uni.showToast({title: '请输入内容', icon: 'none'});
								return;
							}
							_self.submit(item.id, res.content)
				        }
				    }
				});
			},
			// 发表评论
			submit(parentId, content) {
				if(content == '') {
					uni.showToast({title: '请输入内容', icon: 'none'});
					return;
				}
				http.addComment({sourceType: this.type, sourceId: this.sourceId, parentId: parentId, content: content}).then((res) => {
					if(res.code == 10020 || res.code == 10021) {
						uni.showToast({title: '未登录', icon: 'error'});
						return;
					}
					if(res.code != 0) {
						uni.showToast({title: res.msg, icon: 'error'});
						return;
					}
					uni.showToast({title: '发布成功', icon: 'success'});
					this.content = ''
					this.$emit("backHome")
				})
			},
			// 展开评论
			commentUnfold(item) {
				this.commentHeight = 'auto'
				this.isUnfold = true
			},
			// 收起评论
			commentPackUp(item) {
				this.commentHeight = '240px'
				this.isUnfold = false
			}
		}
	}
</script>

<style lang="scss">
	.send-comment-view {
		
		.comment-input {
			background-color: #f1f1f1;
			padding: 10rpx;
			font-size: 26rpx;
			border-radius: 10rpx;
			padding-left: 20rpx;
			float: left;
			width: 72%;
			margin-right: 14px;
		}
		
		.send-btn {
			background-color: #0079FF;
			color: #FFFFFF;
			line-height: 60rpx;
			font-size: 28rpx;
			width: 120rpx;
		}
	}
	
	// 评论
	.comment-title {
		font-size: 16px;
		font-weight: bold;
		margin-top: 16px;
	}
	
	.comment-view {
		margin-top: 16px;
		border-bottom: 1px solid $uni-border-color;
		padding-bottom: 10px;
		overflow-y: hidden;
		
		.parent-view {
			overflow: hidden;
			margin-bottom: 10px;
			
			.like-view {
				padding-right: 10px;
			}
		}
		
		// 二级回复
		.child-view {
			min-height: 80px;
			margin-left: 45px;
			background-color: #ebebeb;
			padding-left: 10px;
			padding-right: 10px;
			padding-top: 10px;
			overflow: hidden;
			border-radius: 4px;
			
			// 三级回复
			.child-reply-view {
				min-height: 80px;
				background-color: #ebebeb;
				padding-right: 10px;
				padding-top: 10px;
				overflow: hidden;
				border-radius: 4px;
				float: left;
				clear: both;
			}
		}
		
		.head-img {
			width: 40px;
			height: 40px;
			border-radius: 50px;
			float: left;
		}
		.username-view {
			float: left;
			margin-left: 6px;
			width: 76%;
			
			.username {
				font-size: 12px;
				// 文字超出...
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				line-clamp: 1;
				-webkit-box-orient: vertical;
			}
			.reply-desc {
				float: left;
				margin-right: 6px;
				font-size: 13px;
				margin-top: 4px;
				max-width: 100px;
				
				// 文字超出...
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				line-clamp: 1;
				-webkit-box-orient: vertical;
			}
			.trends-content {
				margin-top: 4px;
				font-size: 13px;
				float: left;
				letter-spacing: 1px;
			}
		}
		
		.like-view {
			float: right;
			
			.like-num {
				font-size: 10px;
				margin-left: 8px;
			}
			
			.like-img {
				width: 20px;
				height: 20px;
				margin-top: 2px;
			}
		}
		
		.time {
			clear: both;
			float: left;
			margin-top: 10px;
			font-size: 12px;
			color: $uni-text-color-grey;
			margin-left: 46px;
			max-width: 60%;
		}
		.apply-title {
			float: left;
			margin-left: 10px;
			margin-top: 10px;
			font-size: 12px;
		}
		
		// 评论展开更多
		.comment-unfold {
			font-size: 11px;
			float: right;
			position: relative;
			top: 10px;
			right: 10px;
		}
	}
</style>