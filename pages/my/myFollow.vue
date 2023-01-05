<template>
	<view class="content">
		<!-- 个人信息 -->
		<view class="userInfo-view" v-for="(item, index) in userList" :key="index">
			<view class="headImg-view" @click="toUser(item.id)">
				<image mode="aspectFill" :src="item.headUrl"></image>
			</view>
			<view class="phone-view" @click="toUser(item.id)">
				<view class="phone">{{item.username}}</view>
			</view>
			<view class="follow-view" @click="follow(item)" v-if="!item.isFocus">关注</view>
			<view class="follow-view" @click="follow(item)" v-if="item.isFocus">已关注</view>
		</view>
		
		<view class="no-data-view" v-if="userList == null || userList.length == 0">暂无内容</view>
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
				userList: [],
				isFocus: true
			}
		},
		onShow() {
	
		},
		onLoad() {
			this.queryMyUserPage(1, 10)
		},
		onReachBottom() {
			if(this.pageNum * 10 < this.total) {
				this.pageNum++;
				this.queryMyUserPage(this.pageNum, this.pageSize)
			}
		},
		onPullDownRefresh () {
			this.userList = []
			this.pageNum = 1
			this.pageSize = 10
			this.queryMyUserPage(1, 10)
			uni.stopPullDownRefresh()
		},
		methods: {
			// 我的关注
			queryMyUserPage(page, limit) {
				http.queryMyUserPage({page: page, limit: limit}).then((res) => {
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
					this.userList = this.userList.concat(res.data.list)
					this.total = res.data.total
				})
			},
			// 跳转个人中心
			toUser(userId) {
				uni.navigateTo({url: `/pages/my/user?userId=${userId}`});
			},
			// 取消关注
			follow(item) {
				// 关注
				if(!item.isFocus) {
					http.updateMyLink({sourceId: item.id, category: '3', status: '0'}).then((res)=>{
						if(res.code != 0) {
							uni.showToast({title: res.msg, icon: 'error'});
							return;
						}
						item.isFocus = true
					})
				} else {
					// 取消关注
					http.updateMyLink({sourceId: item.id, category: '3', status: '1'}).then((res)=>{
						if(res.code != 0) {
							uni.showToast({title: res.msg, icon: 'error'});
							return;
						}
						item.isFocus = false
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.content {
		padding-left: 10px;
		padding-right: 10px;
	}
	
	.userInfo-view {
		height: 42px;
		margin-top: 10px;
		border-bottom: 1px solid $uni-border-color;
		padding-bottom: 10px;
		
		.headImg-view {
			float: left;
			
			image {
				width: 40px;
				height: 40px;
				border-radius: 50px;
			}
		}
		
		.phone-view {
			float: left;
			margin-left: 8px;
			padding-top: 8px;
			padding-bottom: 10px;
			width: 66%;
			height: 22px;
			
			.phone {
				font-size: 16px;
				
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
		
		.follow-view {
			float: right;
			font-size: 12px;
			color: #555555;
			padding-left: 6px;
			padding-right: 6px;
			padding-top: 2px;
			padding-bottom: 2px;
			border-radius: 4px;
			border: 1px solid $uni-border-color;
			background-color: $uni-border-color;
			margin-top: 10px;
			width: 36px;
			text-align: center;
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