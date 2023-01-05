<template>
	<view class="content">
		<view class="open-view" v-if="!commentShow">
			<!-- <view class="title">留下您的意见或需求</view> -->
			<view class="click-view" @click="openComment(true)">点这里反馈</view>
			<!-- <button @click="openComment(true)">留言</button> -->
		</view>
		
		<view class="textarea" v-if="commentShow">
			<textarea placeholder="在这里留下您的反馈内容" v-model="content"></textarea>
		</view>
		
		<view class="btn-exterior" v-if="commentShow">
			<button @click="addFeedback">发表</button>
			<button class="close-btn" @click="openComment(false)">关闭</button>
		</view>
		
		<view class="msg-view" v-for="(item, index) in dataList" :key="index" :style="{'height': item.height}">
			<image mode="aspectFill" :src="item.headUrl" @click="toRecord(item.userId)"></image>
			<view class="msg-text">
				<view style="color: #FFFFFF;float: left;" class="owner-text" v-if="item.userId == -1">作者</view>
				<view class="nickname-view">{{item.userName}}</view>
				<view class="open-msg-view" @click="clickOpen(item)" v-if="!item.open && item.remark != '' && item.remark != null"> 展开 </view>
				<view class="close-msg-view" @click="clickClose(item)" v-if="item.open && item.remark != '' && item.remark != null"> 收起 </view>
				<!-- <view class="owner-text" @click="clickOpen(item)" v-if="!item.open && item.remark != '' && item.remark != null">作者回复</view> -->
				<!-- <view class="owner-text" @click="clickClose(item)" v-if="item.open && item.remark != '' && item.remark != null">作者回复</view> -->
				<view class="content-view">{{item.content}} <text>{{item.timeDesc}}</text></view>
			</view>
			
			<!-- 回复 -->
			<view class="comment-child" v-if="item.remark != '' && item.remark != null">
				<image mode="aspectFill" :src="boxImg" @click="toRecord(item.userId)"></image>
				<view style="float: left;width: 100%;">
					<view style="color: #666666;font-size: 28rpx;">
						<text style="color: #FFFFFF;" class="owner-text">作者</text>
						<text>{{boxName}}</text>
					</view>
					<view class="content-text">{{item.remark}}</view>
					<!-- <view class="update-view">{{item.createTime}}</view> -->
				</view>
			</view>
		</view>
		
		<view class="cue-words" v-if="dataList.length == 0 && !commentShow">暂无留言</view>
		
	</view>
</template>

<script>
	import http from "@/api/backend.js"
	var _self;
	export default {
		created() {
			_self = this
		},
		data() {
			return {
				pageNum: 1,
				pageSize: 10,
				userInfo: {},
				content: "",
				commentShow: false,
				dataList: [],
				total: 0,
				boxName: '不二博客',
				boxImg: 'https://lian-pictures.oss-cn-beijing.aliyuncs.com/smart-box/jnh.png'
			}
		},
		onLoad() {
			this.queryMessages(1, 10, 'create_date', 'desc')
		},
		onShow() {
			
		},
		onReachBottom() {
			if(this.pageNum * 10 < this.total) {
				this.pageNum++;
				this.queryMessages(this.pageNum, this.pageSize, 'create_date', 'desc')
			}
		},
		onPullDownRefresh () {
			this.dataList = []
			this.pageNum = 1
			this.pageSize = 10
			this.queryMessages(1, 10, 'create_date', 'desc')
			uni.stopPullDownRefresh()
		},
		methods: {
			// 打开发表框
			openComment(status) {
				this.commentShow = status
				this.content = ''
			},
			queryMessages(page, limit, orderField, order) {
				uni.showLoading({title: "加载中"});
				http.queryFeedback({page: page, limit: limit, orderField: orderField, order: order}).then(res => {
					if(res.code != 0) {
						uni.showToast({title: '接口异常', icon: 'error'});
						return;
					}
					for(let i = 0; i < res.data.list.length; i++) {
						res.data.list[i].height = '124rpx'
						res.data.list[i].open = false
						// res.rows[i].height = 'auto'
						// res.rows[i].open = true
					}
					this.dataList = this.dataList.concat(res.data.list)
					this.total = res.data.total
					uni.hideLoading()
				})
			},
			// 发表反馈
			addFeedback() {
				http.addFeedback({content: this.content}).then((res)=>{
					if(res.code == 10020) {
						uni.showToast({title: '未登录', icon: 'error'});
						return;
					}
					if(res.code != 0) {
						uni.showToast({title: res.msg, icon: 'error'});
						return;
					}
					this.content = ''
					this.dataList = []
					this.queryMessages(1, 10, 'create_date', 'desc')
				})
			},
			toRecord(userId) {
				if(this.userInfo.id == 1) {
					uni.navigateTo({
						url: `/pages/my/useRecord?userId=${userId}`
					});
					return
				}
				uni.showToast({title: '未开启查阅权限', icon: 'none'});
			},
			// 作者采纳
			author(item) {
				uni.showToast({title: item.remark, icon: 'none'});
			},
			clickOpen(item) {
				item.height = 'auto'
				item.open = true
			},
			clickClose(item) {
				item.height = '124rpx'
				item.open = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	body {
		background-color: #ebebeb;
	}
	.content {
		padding: 20upx;
		min-height: 100vh;
		background-color: #ebebeb;
		padding-bottom: 100upx;
	}
	
	.open-view {
		margin-top: 20upx;
		margin-bottom: 80upx;
		
		.title {
			float: left;
		}
		
		.click-view {
			color: darkcyan;
			font-weight: bold;
			float: left;
			margin-left: 20upx;
		}
	}
	
	.textarea {
		margin-bottom: 40upx;
		
		textarea {
			margin: 0 auto;
			width: 90%;
			height: 200upx;
			padding: 20upx;
			background-color: #f8f8f8;
		}
	}
	
	.btn-exterior {
		width: 100%;
		
		.close-btn {
			background-color: #dfdfdf;
			color: #000000;
		}
		
		button {
			width: 20%;
			height: 70upx;
			line-height: 70upx;
			margin-left: 20upx;
			border-radius: 10upx;
			background-color: #0079FF;
			text-align: center;
			float: left;
			font-size: 27upx;
			color: #FFFFFF;
			float: right;
			margin-right: 20rpx;
		}
	}
	
	.msg-view {
		clear: both;
		margin-top: 30rpx;
		padding: 20rpx;
		border-bottom: 2upx solid #8d8d8d;
		overflow: hidden;
		
		image {
			width: 60rpx;
			height: 60rpx;
			border-radius: 100rpx;
			float: left;
			margin-right: 20rpx;
		}
		
		.msg-text {
			
			.nickname-view {
				color: #666666;
				word-wrap: break-word;
				float: left;
				width: 58%;
				height: 40upx;
				margin-bottom: 38upx;
				
				// 文字超出 ...
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				line-clamp: 1;
				-webkit-box-orient: vertical;
			}
			
			.open-msg-view, .close-msg-view {
				float: right;
				margin-left: 5px;
				text-align: right;
				height: 42upx;
				width: 188upx;
				color: #55aa00;
				font-size: 26upx;
			}
			
			.content-view {
				clear: both;
				
				text {
					margin-top: 10px;
				}
			}
			
			view {
				font-size: 28rpx;
				letter-spacing: 2upx;
			}
			text {
				font-size: 24rpx;
				color: #666;
				float: right;
			}
			
			.owner-text {
				float: right;
				margin-right: 16rpx;
				margin-top: 6upx;
				color: #FFFFFF;
				font-size: 24rpx;
				background-color: #ffaa00;
				padding-left: 6rpx;
				padding-right: 6rpx;
				border-radius: 10rpx;
			}
		}
		
		.comment-child {
			display: flex;
			margin-left: 32rpx;
			margin-top: 30rpx;
			
			image {
				// margin-top: 10upx;
			}
			
			.owner-text {
				margin-right: 16rpx;
				color: #FFFFFF;
				font-size: 24rpx;
				background-color: #ffaa00;
				padding-left: 6rpx;
				padding-right: 6rpx;
				border-radius: 10rpx;
			}
		
			.content-text {
				float: left;
				font-size: 26rpx;
				margin-top: 10upx;
			}
		
			.update-view {
				float: right;
				font-size: 24rpx;
				color: #7a7a7a;
				margin-top: 15upx;
			}
		}
		
	}
	
	.cue-words {
		text-align: center;
		font-size: 28rpx;
		color: #778288;
		margin-top: 110rpx;
	}
	
</style>
