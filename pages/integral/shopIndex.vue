<template>
	<view class="content">
		<view style="background-color: #FFFFFF;padding: 20upx;height: 102upx;">
			<view style="float: left;">
				<view class="integral-view">
					<text style="font-weight: bold;">当前积分：</text>
					<text class="integral">{{integralNum}}</text>
				</view>
				<view style="font-size: 28upx;color: #6d6d6d;" @click="toIntegral">积分明细 > </view>
			</view>
			<view style="float: right;color: #6d6d6d;font-size: 28upx;margin-top: 64upx;" @click="toOrder">我的订单 > </view>
		</view>
		
		<view class="list-view">
			<view class="data-view" v-for="(item, index) in dataList" :key="index" @click="toDetail(item.id)">
				<image mode="aspectFill" :src="item.imgUrls[0]"></image>
				<view class="name">{{item.goodsName}}</view>
				<view class="data-integral">{{item.integralValue}}积分</view>
			</view>
		</view>
		
		<view class="cue-words" v-if="dataList.length == 0">没有更多数据</view>
	</view>
</template>

<script>
	import http from '@/api/backend.js'
	import {mapMutations, mapState} from 'vuex';
	var _self;
	export default {
		created() {
			_self = this
		},
		data() {
			return {
				dataList: [],
				pageNum: 1,
				pageSize: 10,
				total: 0,
				userInfo: {},
				// 当前积分
				integralNum: 0
			}
		},
		onShow() {
			
		},
		onReachBottom() {
			if(this.pageNum * 10 < this.total) {
				this.pageNum++;
				this.queryList(this.pageNum, this.pageSize)
			}
		},
		onLoad() {
			this.getCredits()
			this.queryList(this.pageNum, this.pageSize)
		},
		onPullDownRefresh() {
			this.dataList = []
			this.getCredits()
			this.queryList(this.pageNum, this.pageSize)
			uni.stopPullDownRefresh()
		},
		methods: {
			...mapMutations(['login', 'logout']),
			// 查询积分
			getCredits() {
				const userInfo = uni.getStorageSync('userInfo');
				if (userInfo == '') {
					return
				}
				this.userInfo = userInfo
				http.queryCredits({
					userId: userInfo.id
				}).then(res => {
					if (res.code != 200) {
						uni.showToast({
							title: res.msg,
							icon: 'error'
						});
						return
					}
					if(res.data != undefined) {
						this.integralNum = res.data.creditsNum
					}
				})
			},
			// 跳转积分中心
			toIntegral() {
				uni.navigateBack({delta: 1});
			},
			// 商品列表
			queryList(pageNum, pageSize) {
				http.queryIntegralGoods({
					pageNum: pageNum,
					pageSize: pageSize
				}).then(res => {
					if (res.code != 200) {
						uni.showToast({
							title: res.msg,
							icon: 'error'
						});
						return
					}
					this.dataList = this.dataList.concat(res.rows)
					this.total = res.total
				})
			},
			// 跳转详情
			toDetail(id) {
				uni.navigateTo({url: `/pages/integral/shopDetail?id=${id}`});
			},
			// 跳转订单列表
			toOrder() {
				uni.navigateTo({url: `/pages/order/index`});
			}
		}
	}
</script>

<style lang="scss">
	body {
		background-color: #f3f3f3;
	}
	
	.content {
	}
	
	.integral-view {
		margin-bottom: 20upx;
		
		.integral {
			font-size: 32upx;
			font-weight: bold;
		}
	}
	
	.list-view {
		padding: 20upx;
		
		.data-view {
			width: 45%;
			height: 452upx;
			float: left;
			margin-left: 20upx;
			margin-top: 20upx;
			background-color: #FFFFFF;
			border-radius: 10% 10% 0 0;
			
			image {
				width: 100%;
				height: 280upx;
				border-radius: 10% 10% 0 0;
			}
			
			.name {
				padding: 15upx;
			}
			
			.data-integral {
				padding: 15upx;
				color: #ff0000;
			}
		}
	}
	
	.cue-words {
		text-align: center;
		font-size: 28rpx;
		color: #778288;
		margin-top: 12rpx;
	}
	
</style>
