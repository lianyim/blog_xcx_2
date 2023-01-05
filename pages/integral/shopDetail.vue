<template>
	<view class="content">
		<view class="swiper-view">
			<swiper class="swiper" indicator-dots autoplay interval="3000" duration="800">
				<swiper-item class="swiper-item" v-for="(item, index) in goods.imgUrls" :key="index">
					<view class="image-wrapper">
						<image :src="item" mode="aspectFill" @tap="previewImage(index)"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="title">{{goods.goodsName}}</view>
		<view class="integral">{{goods.integralValue}}积分</view>
		<view class="data-content">{{goods.goodsContent}}</view>

		<button type="" v-if="goods.id != undefined" @click="exchangeConfirm">兑换</button>
		<button type="" disabled v-if="goods.id == undefined">兑换</button>
		
	</view>
</template>

<script>
	import http from '@/api/backend.js'
	import {
		mapMutations,
		mapState
	} from 'vuex';
	var _self;
	export default {
		created() {
			_self = this
		},
		data() {
			return {
				userInfo: {},
				goods: {integralValue: 0},
				integralNum: 0,
				share: {
					title: '',
					path: '',
					imageUrl: '',
					desc: '',
					content: ''
				}
			}
		},
		onShow() {

		},
		onReachBottom() {

		},
		onLoad(e) {
			const userInfo = uni.getStorageSync('userInfo');
			this.userInfo = userInfo
			this.queryGoods(e.id)
			this.getCredits()
		},
		onPullDownRefresh() {

		},
		methods: {
			...mapMutations(['login', 'logout']),
			queryGoods(id) {
				http.getGoodsById({id: id}).then(res => {
					if (res.code != 200) {
						uni.showToast({
							title: res.msg,
							icon: 'error'
						});
						return
					}
					if(res.data == undefined) {
						uni.showToast({title: '商品不存在',icon: 'error'});
						setTimeout(function() {
							// 返回上一页
							uni.navigateBack({delta: 1})
						}, 1000)
					}
					this.goods = res.data
					
					this.share.title = res.data.goodsName
					this.share.imageUrl = res.data.imgUrls[0]
					this.share.path = '/pages/integral/shopDetail?id=' + id
				})
			},
			// 图片预览
			previewImage(index) {
				uni.previewImage({
					current: this.goods.imgUrls[index],
					urls: this.goods.imgUrls
				})
			},
			// 查询积分
			getCredits() {
				http.queryCredits({
					userId: this.userInfo.id
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
			// 兑换确认框
			exchangeConfirm() {
				uni.showModal({
				    title: '提示',
				    content: '确认兑换?',
				    success: function (res) {
				        if (res.confirm) {
				            if(_self.integralNum < _self.goods.integralValue) {
								uni.showToast({title: '积分不足',icon: 'error'});
								return;
							}
							uni.showLoading({title: "兑换中"});
							// 新增订单
							http.addGoodsOrder({userId: _self.userInfo.id,goodsId: _self.goods.id}).then(res => {
								if (res.code != 200) {
									uni.showToast({title: res.msg == null ? '兑换失败' : res.msg,icon: 'error'});
									return
								}
								uni.hideLoading()
								uni.showToast({title: '兑换成功',icon: 'none'});
								// 跳转订单页
								setTimeout(function() {
									uni.navigateTo({url: `/pages/order/detail?goodsId=${_self.goods.id}&orderId=${res.data}`});
								}, 1000)
							})
				        }
				    }
				});
			}
		}
	}
</script>

<style lang="scss">
	.content {
		padding-left: 20upx;
		padding-right: 20upx;
	}

	.swiper-view {
		width: 106%;
		margin-left: -20upx;
		margin-bottom: 30upx;

		.swiper {
			height: 550upx;

			.swiper-item {

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

	.title {
		font-weight: bold;
		font-size: 32upx;
		margin-top: 20upx;
	}

	.integral {
		color: #ff0000;
		margin-top: 20upx;
		font-weight: bold;
	}

	.data-content {
		margin-top: 60upx;
	}

	button {
		margin-top: 200upx;
		background-color: #0079FF;
		color: #FFFFFF;
	}
</style>
