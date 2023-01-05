<template>
	<view class="content">
		<view class="top-background">
			<view class="integral-view">
				<view class="integral-left">
					<view class="integral">{{userInfo.integralNum}}</view>
					<view style="font-size: 28upx;float: left;">当前积分</view>
				</view>
				<view class="integral-right">
					<view style="font-size: 28upx;margin-right: 20upx;" @click="openRule">规则 > </view>
					<view class="exchange" @click="toShop">去兑换</view>
				</view>
			</view>
		</view>
		
		<view class="list-view">
			<view class="box-warp">
				<view class="type-item-spec">
					<view class="" v-for="(item, index) in items" :key="index" :class="{btna:count == index}" @click="change(index)">
						<view class="type-name">{{item}}</view>
					</view>
				</view>
			</view>
			
			<view class="data-view" v-for="(item, index) in dataList" :key="index">
				<view class="data-left">
					<view class="title">{{item.sourceName}}</view>
					<view class="time">{{item.createDate}}</view>
				</view>
				<view class="data-right">
					{{item.type == '1' ? '+' : '-'}}{{item.updateNum}}
				</view>
			</view>
			<view class="cue-words" v-if="dataList.length == 0">没有更多数据</view>
		</view>
		
		<uni-popup ref="popup" type="center" background-color="#fff">
			<view class="popup-title">积分规则</view>
			<view class="x" @click="closeRule">x</view>
			<view class="popup-content">{{ruleContent}}</view>
			<view class="btn-view"></view>
		</uni-popup>
		
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
				ruleContent: '暂未开放',
				dataList: [],
				pageNum: 1,
				pageSize: 10,
				total: 0,
				userInfo: {
					integralNum: 0
				},
				items: ['获取记录', '消费记录'],
				btnnum: 0,
				count: '',
				// 当前积分
				integralNum: 0
			}
		},
		onShow() {
			
		},
		onReachBottom() {
			if(this.pageNum * 10 < this.total) {
				this.pageNum++;
				this.queryList(this.pageNum, this.pageSize, this.btnnum == '0' ? '1' : '2')
			}
		},
		onLoad() {
			this.getUserInfo()
			// this.getCredits()
			this.queryList(this.pageNum, this.pageSize, this.btnnum == '0' ? '1' : '2')
		},
		onPullDownRefresh() {
			this.dataList = []
			this.pageNum = 1
			this.pageSize = 10
			this.queryList(1, 10, this.btnnum == '0' ? '1' : '2')
			uni.stopPullDownRefresh()
		},
		methods: {
			change(e) {
				this.count = e
				this.btnnum = e
				this.pageNum = 1
				this.total = 0
				this.dataList = []
				this.queryList(1, 10, e == '0' ? '1' : '2')
			},
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
					if(res.data != undefined) {
						this.integralNum = res.data.creditsNum
					}
				})
			},
			// 积分变动记录
			queryList(page, limit, type) {
				http.queryIntegralRecord({page: page, limit: limit, type: type, orderField: 'create_date', order: 'desc'}).then((res)=>{
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
					this.dataList = this.dataList.concat(res.data.list)
					this.total = res.data.total
				})
			},
			// 当前用户
			getUserInfo() {
				http.userInfo({}).then((res)=>{
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
					this.userInfo = res.data
				})
			},
			// 积分规则弹窗
			openRule() {
				this.$refs.popup.open('center')
			},
			closeRule() {
				this.$refs.popup.close()
			},
			// 跳转商城
			toShop() {
				// uni.navigateTo({url: '/pages/integral/shopIndex'});
				uni.showToast({title: '暂未开放', icon: 'none'});
			},
			// 获取激励广告
			getJlgg() {
				uni.showModal({
				    title: '提示',
				    content: '观看广告后，可获得积分',
				    success: function (res) {
				        if (res.confirm) {
							http.limitCreditsByAds({userId: _self.userInfo.id}).then(res => {
								if (res.code != 200) {
									uni.showToast({title: res.msg,icon: 'error'});
									return
								}
								let videoAd = null
								// 在页面onLoad回调事件中创建激励视频广告实例
								if (wx.createRewardedVideoAd) {
								  videoAd = wx.createRewardedVideoAd({
								    adUnitId: 'adunit-83c345d405a7bb74'
								  })
								  videoAd.onLoad(() => {
								  })
								  videoAd.onError((err) => {
								  })
								  videoAd.onClose((res) => {
									  // 防止多次回调
									  if(!videoAd) return
									  videoAd.offClose()
									  
									  if (res && res.isEnded) {
										// 正常播放结束，可以下发游戏奖励
										console.log('看完关闭')
										_self.updateIntegralByAds()
									  } else {
										// 播放中途退出，不下发游戏奖励
										console.log('未看完关闭')
									  }
									  
								  })
								}
								
								// 用户触发广告后，显示激励视频广告
								if (videoAd) {
								  videoAd.show().catch(() => {
								    // 失败重试
								    videoAd.load()
								      .then(() => {
										  // 加载成功
										  videoAd.show()
									  })
								      .catch(err => {
										uni.showToast({title: '加载失败', icon: 'error'});
								      })
								  })
								}
							})
				        }
				    }
				});
			},
			// 观看广告获取积分
			updateIntegralByAds() {
				http.updateCreditsByAds({userId: _self.userInfo.id}).then(res => {
					if (res.code != 200) {
						uni.showToast({title: res.msg,icon: 'error'});
						return
					}
					uni.showToast({title: '成功获取积分',icon: 'none'});
					setTimeout(function() {
						_self.getCredits()
						_self.dataList = []
						_self.pageNum = 1
						_self.pageSize = 10
						_self.queryList(_self.pageNum, _self.pageSize, _self.btnnum == '0' ? '1' : '2')
					}, 1000)
				})
			}
		}
	}
</script>

<style lang="scss">
	body {
		background-color: #f3f3f3;
	}
	
	.content {
		padding-bottom: 40upx;
	}
	
	.top-background {
		height: 300upx;
		background-color: #00a5f7;
		text-align: center;
		padding-left: 40upx;
		padding-top: 50upx;
		
		.integral-view {
			height: 170upx;
			color: #FFFFFF;
			
			.integral-left {
				float: left;
				
				.integral {
					font-size: 60upx;
					margin-bottom: 10upx;
					font-weight: bold;
					text-align: left;
				}
				
				.get-integral {
					width: 42upx;
					height: 42upx;
					float: left;
					margin-left: 35upx;
					margin-top: -7upx;
				}
			}
			
			.integral-right {
				float: right;
				
				.exchange {
					color: #ffaa00;
					background-color: #ffffff;
					border-radius: 30% 0 0 30%;
					margin-top: 40upx;
					font-size: 28upx;
					padding-left: 16upx;
					padding-right: 16upx;
					padding-top: 6upx;
					padding-bottom: 6upx;
				}
			}
		}
	}
	
	.list-view {
		width: 78%;
		min-height: 100vh;
		margin: 0 auto;
		margin-top: -100upx;
		background-color: #ffffff;
		box-shadow: 0 0 2upx 2upx #fdfdfd;
		border-radius: 10upx;
		padding-top: 20upx;
		padding-left: 40upx;
		padding-right: 40upx;
		padding-bottom: 20upx;
		
		.data-view {
			height: 110upx;
			margin-top: 20upx;
			border-bottom: 2upx solid #c1c1c1;
			
			.data-left {
				float: left;
				
				.title {
					font-size: 30upx;
				}
				
				.time {
					margin-top: 20upx;
					font-size: 24rpx;
					color: #778288;
					float: left;
				}
			}
			
			.data-right {
				float: right;
				color: #ff0000;
			}
		}
	}
	
	.box-warp {
		background: #fff;
		color: #909090;
		margin-bottom: 36upx;
		
		.orderbox > view:nth-child(1) {
			margin-top: 20upx;
		}
		
		.type-item-spec {
			padding: 15upx;
			display: flex;
			margin-left: -60upx;
			
			.dis {
				display: block;
			}
			.btna {
				color: #FFFFFF;
				font-weight: normal;
				
				// 选中样式
				.type-name{
					border-bottom: 4upx solid #0079FF;
					height: 46upx;
					color: #000000;
					font-weight: bold;
					margin-left: 130upx;
				}
			}
		}
		
		// 未选中样式
		.type-name{
			height: 46upx;
			color: #000000;
			margin-left: 130upx;
		}
	}
	
	.cue-words {
		text-align: center;
		font-size: 28rpx;
		color: #778288;
		margin-top: 12rpx;
	}
	
	uni-popup {
		.x {
			position: absolute;
			right: 32rpx;
			top: 8rpx;
			color: #fa0000;
			font-size: 40upx;
		}
		
		.popup-title {
			text-align: center;
			margin-bottom: 20upx;
			margin-top: 20upx;
		}
		
		.popup-content {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			padding: 15px;
			width: 300px;
			background-color: #f1f1f1;
			font-size: 28upx;
			letter-spacing: 2upx;
		}
		
		.btn-view {
			height: 30upx;
		}
	}
	
</style>
