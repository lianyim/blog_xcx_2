<template>
	<view class="content">
		<view class="data-view" v-for="(item, index) in circleList" :key="index" @click="toCircleDetail(item.id)">
			<image mode="aspectFill" :src="item.imgUrl"></image>
			<view class="desc-view">
				<view class="title">{{item.title}}</view>
				<view class="num-view">
					<text>成员：{{item.joinUserNum}}</text>
					<text>动态：{{item.trendsNum}}</text>
				</view>
			</view>
			<view class="more"> > </view>
		</view>
		
		<view class="no-data-view" v-if="circleList == null || circleList.length == 0">暂无内容</view>
	</view>
</template>

<script>
	import http from "@/api/backend.js"
	export default {
		data() {
			return {
				circleList: []
			}
		},
		onLoad() {
			this.queryCircle(1, 10)
		},
		onReachBottom() {
			if(this.pageNum * 10 < this.total) {
				this.pageNum++;
				this.queryCircle(this.pageNum, this.pageSize)
			}
		},
		onPullDownRefresh () {
			this.circleList = []
			this.pageNum = 1
			this.pageSize = 10
			this.queryCircle(1, 10)
			uni.stopPullDownRefresh()
		},
		methods: {
			// 查询圈子列表
			queryCircle(page, limit) {
				http.queryMyCirclePage({page: page, limit: limit}).then((res)=>{
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
					this.circleList = this.circleList.concat(res.data.list)
					this.total = res.data.total
				})
			},
			// 跳转圈子详情
			toCircleDetail(id) {
				uni.navigateTo({url: `/pages/circle/circleDetail?id=${id}`});
			}
		}
	}
</script>

<style lang="scss">
	.content {
		padding-left: 10px;
		padding-right: 10px;
	}
	
	.data-view {
		height: 64px;
		margin-top: 10px;
		border-bottom: 1px solid $uni-text-color-disable;
		
		image {
			width: 52px;
			height: 52px;
			border-radius: 4px;
			float: left;
		}
		
		.desc-view {
			float: left;
			margin-left: 10px;
			padding-top: 3px;
			
			.title {
				font-size: 14px;
			}
			.num-view {
				margin-left: -10px;
				margin-top: 6px;
				
				text {
					font-size: 12px;
					color: $uni-text-color-grey;
					margin-left: 10px;
				}
			}
		}
		
		.more {
			line-height: 52px;
			float: right;
			font-size: 14px;
			color: $uni-text-color-grey;
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