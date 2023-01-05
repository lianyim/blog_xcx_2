<template>
	<view class="content">
		<!-- 个人信息 -->
		<view class="userInfo-view">
			<view class="headImg-view" @click="toUser(userInfo.id)">
				<image mode="aspectFill" :src="userInfo.headUrl" v-if="isLogin"></image>
				<image mode="aspectFill" src="../../static/imgs/tabber/my.png" v-if="!isLogin"></image>
			</view>
			<view class="phone-view">
				<view class="phone" v-if="isLogin">{{userInfo.username}}</view>
				<view class="phone" v-if="!isLogin" @click="openPhone">请登录</view>
				<view class="integral" v-if="isLogin">
					积分 {{userInfo.integralNum}}
					<text style="margin-left: 20px;" @click="logout">登出</text>
				</view>
			</view>
			<view class="edit" @click="toEditInfo" v-if="isLogin">编辑></view>
		</view>
		
		<!-- 我的应用 -->
		<view class="my-app-view" v-if="myAppList.length > 0">
			<view class="my-app" v-for="(item, index) in myAppList" :key="index" @click="toAppDetail(item)" v-if="!item.hidden">
				<image mode="aspectFill" :src="item.imgUrl"></image>
				<view class="app-name">{{item.name}}</view>
			</view>
		</view>
		
		<!-- 轮播图 -->
		<view class="swiper-view">
			<swiper class="swiper" indicator-dots autoplay interval="3000" duration="800">
				<swiper-item class="swiper-item" v-for="(item, index) in carouselList" :key="index" @click="toAdvert(item)">
					<view class="image-wrapper">
						<image :src="item.url" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<!-- 常用功能 -->
		<view class="app-outside-view">
			<view class="app-view" v-for="(item, index) in appList" :key="index" @click="toAppDetail(item)">
				<image mode="aspectFill" :src="item.url"></image>
				<view class="app-name">{{item.name}}</view>
				<view class="more"> > </view>
			</view>
		</view>
		
		<view class="app-outside-view">
			<view class="app-view" v-for="(item, index) in otherAppList" :key="index" @click="toAppDetail(item)">
				<image mode="aspectFill" :src="item.url"></image>
				<view class="app-name">{{item.name}}</view>
				<view class="more"> > </view>
			</view>
		</view>
		
		<!-- 手机号弹框 -->
		<uni-popup ref="popup" type="center" background-color="#fff">
			<view style="height: 40px;width: 54px;float: left;"></view>
			<view class="popup-title-code" @click="changeCodeLogin" :style="{'color': codeLoginCss}">验证码登录</view>
			<view class="popup-title-password" @click="changePwdLogin" :style="{'color': pwdLoginCss}">密码登录</view>
			<view class="x" @click="closePhone">x</view>
			<view class="popup-content">
				<view class="phone-view">
					<text>手机号</text>
					<input maxlength="11" type="number" v-model="phone" placeholder="请输入手机号码"/>
				</view>
				<view class="password-view" v-if="isPassword">
					<text>密码</text>
					<input password v-model="password" placeholder="请输入密码"/>
				</view>
				<view class="code-view" v-if="!isPassword">
					<view>验证码	</view>
					<input maxlength="6" type="number" v-model="code" placeholder="请输入验证码"/>
					<view class="send-code" v-if="!isSend" @click="sendCodeBtn">发送验证码</view>
					<view class="send-code" v-if="isSend">{{second}}后重试</view>
				</view>
			</view>
			<view class="btn-view">
				<view class="confirm-btn" @tap="confirm()">确认</view>
				<view class="cancel-btn" @tap="closePhone()">取消</view>
			</view>
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
				isLogin: false,
				phone: '',
				timestamp: '',
				phone: '',
				code: '',
				password: '',
				// 验证码倒计时
				second: 59,
				isSend: false,
				// 是否是密码登录
				isPassword: false,
				// 登录选中样式
				codeLoginCss: '#50a0f0',
				pwdLoginCss: {
					'color': '',
					'font-weight': ''
				},
				// 个人信息
				userInfo: {},
				// 轮播图
				carouselList: [],
				// 我的应用
				myAppList: [],
				// 常用应用
				appList: [
					{
						url: '../../static/imgs/my/integral.png',
						name: '积分中心',
						pageUrl: '/pages/integral/index'
					},
					{
						url: '../../static/imgs/my/issue.png',
						name: '问题反馈',
						pageUrl: '/pages/other/message'
					},
					{
						url: '../../static/imgs/my/contactAuthor.png',
						name: '联系作者',
						pageUrl: '/pages/other/author'
					},
					{
						url: '../../static/imgs/my/set.png',
						name: '设置',
						pageUrl: '/pages/my/set'
					}
				],
				// 其它应用
				otherAppList: [
					{
						url: "../../static/imgs/home/webside.png",
						name: "网站推荐",
						pageUrl: '/pages/article/detail?id=2'
					},
					{
						url: "../../static/imgs/my/box.png",
						name: "实用工具",
						pageUrl: 'wx678dafe70a79518a'
					}
				],
				// 广告
				toAdvert(item) {
					uni.showModal({
						title: '标题',
						content: item.title,
						showCancel: false,
						success() {
							
						}
					})
				}
			}
		},
		onShow() {
			this.getUserInfo()
		},
		onLoad() {
			this.queryCarouselData(1, 1)
		},
		methods: {
			// 查询我的应用
			queryMyApp() {
				http.queryMyApp({}).then((res) => {
					this.myAppList = res.data
					if(res.data.length > 1) {
						this.myAppList[1].pageUrl = `/pages/my/myTrends?userId=${this.userInfo.id}`
					}
				})
			},
			// 查询轮播图
			queryCarouselData(page, limit) {
				http.queryCarousel({page: page, limit: limit, type: '3'}).then((res)=>{
					this.carouselList = res.data.list
				})
			},
			// 当前用户
			getUserInfo() {
				http.userInfo({}).then((res)=>{
					if(res.code == 10020 || res.code == 10021) {
						this.isLogin = false
						return;
					}
					if(res.code != 0) {
						uni.showToast({title: res.msg, icon: 'error'});
						this.isLogin = false
						return;
					}
					this.userInfo = res.data
					uni.setStorageSync('userInfo', res.data);
					this.isLogin = true
					this.queryMyApp()
				})
			},
			// 登录
			loginByPwd(mobile, password) {
				http.loginByPwd({mobile: mobile, password: password}).then((res)=>{
					if(res.code != 0) {
						uni.showToast({title: res.msg, icon: 'none'});
						return;
					}
					uni.setStorageSync('token', res.data.token);
					uni.setStorageSync('userInfo', res.data);
					uni.showToast({title:'登录成功', icon:'none'})
					this.userInfo = res.data
					this.isLogin = true
					this.getUserInfo()
					this.closePhone()
				})
			},
			loginByCode(mobile, code, timestamp) {
				http.loginByCode({phone: mobile, timestamp: timestamp, code: code}).then((res)=>{
					if(res.code != 0) {
						uni.showToast({title: res.msg, icon: 'error'});
						return;
					}
					uni.setStorageSync('token', res.data.token);
					uni.setStorageSync('userInfo', res.data);
					uni.showToast({title:'登录成功', icon:'none'})
					this.userInfo = res.data
					this.isLogin = true
					this.getUserInfo()
					this.closePhone()
				})
			},
			// 跳转应用页面
			toAppDetail(e) {
				if(e.pageUrl == '') {
					uni.showToast({title: '功能完善中', icon: 'none'});
					return;
				}
				// 跳转其它小程序
				if(e.pageUrl.indexOf('wx') == 0) {
					// #ifdef APP-PLUS
					    uni.showToast({title: '请在微信小程序中使用此功能', icon: 'none'});
					// #endif
					
					// #ifdef MP
					   uni.navigateToMiniProgram({
					   	appId: e.pageUrl,
					   	success: res => {
					   	},
					   	fail: err => {
					   	}
					   });
					// #endif
					return;
				}
				uni.navigateTo({url: `${e.pageUrl}`});
			},
			// 跳转编辑信息页面
			toEditInfo() {
				uni.navigateTo({url: `/pages/my/editInfo?phone=${this.userInfo.mobile}`});
			},
			// 打开手机号弹框
			openPhone() {
				this.$refs.popup.open('center')
			},
			// 关闭弹框
			closePhone() {
				this.$refs.popup.close()
			},
			// 验证码按钮
			sendCodeBtn() {
				if(this.phone == '') {
					uni.showToast({title:'请填写手机号', icon:'none'})
					return;
				}
				this.sendCode()
			},
			// 发送验证码
			sendCode() {
				let timestamp = Date.now()
				this.timestamp = timestamp
				http.sendCode({phone: this.phone, timestamp: timestamp}).then(res => {
					if(res.code != 0) {
						uni.showToast({title: res.msg, icon: 'error'});
						return;
					}
					// 验证码倒计时
					this.isSend = true
					var interval = setInterval(function() {
						let i = _self.second--
						if(i <= 1) {
							_self.isSend = false
							_self.second = 59
							clearInterval(interval);
						}
					}, 1000)
				})
			},
			// 手机号登录
			confirm() {
				if(this.phone == '') {
					uni.showToast({title:'请填写手机号', icon:'none'})
					return;
				}
				if(!this.isPassword && this.code == '') {
					uni.showToast({title:'请输入验证码', icon:'none'})
					return;
				}
				if(this.isPassword && this.password == '') {
					uni.showToast({title:'请输入密码', icon:'none'})
					return;
				}
				if(this.isPassword) {
					this.loginByPwd(this.phone, this.password)
				} else {
					this.loginByCode(this.phone, this.code, this.timestamp)
				}
			},
			// 切换验证码登录
			changeCodeLogin() {
				this.codeLoginCss = '#50a0f0'
				this.pwdLoginCss = ''
				this.isPassword = false
				this.password = ''
			},
			// 切换密码登录
			changePwdLogin() {
				this.codeLoginCss = ''
				this.pwdLoginCss = '#50a0f0'
				this.isPassword = true
				this.code = ''
			},
			// 跳转个人中心
			toUser(userId) {
				uni.navigateTo({url: `/pages/my/user?userId=${userId}`});
			},
			// 登出
			logout() {
				http.logout({}).then(res => {
					if(res.code != 0) {
						uni.showToast({title: res.msg, icon: 'error'});
						return;
					}
					this.userInfo = {}
					this.isLogin = false
					uni.removeStorageSync('token');
					uni.removeStorageSync('userInfo');
					uni.showToast({title: '登出成功', icon: 'none'});
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		padding: 20px;
		background-color: $uni-bg-color-grey;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		overflow-y: auto;
	}
	
	// 个人信息
	.userInfo-view {
		height: 62px;
		
		.headImg-view {
			float: left;
			
			image {
				width: 60px;
				height: 60px;
				border-radius: 50px;
			}
		}
		
		.phone-view {
			float: left;
			margin-left: 8px;
			padding-top: 8px;
			padding-bottom: 10px;
			width: 60%;
			
			.phone {
				font-size: 16px;
				font-weight: bold;
				
				// 文字超出...
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				line-clamp: 1;
				-webkit-box-orient: vertical;
			}
			.integral {
				margin-top: 6px;
				font-size: 13px;
				color: #ffaa00;
				font-weight: bold;
			}
		}
		
		.edit {
			float: right;
			font-size: 14px;
			color: $uni-text-color-grey;
			line-height: 62px;
		}
	}
	
	// 我的应用
	.my-app-view {
		height: 62px;
		background-color: #ffffff;
		border-radius: 10px;
		margin-top: 20px;
		padding-top: 12px;
		padding-bottom: 12px;
		
		.my-app {
			float: left;
			margin-left: 19px;
			text-align: center;
			width: 18%;
			
			image {
				width: 30px;
				height: 30px;
			}
			.app-name {
				margin-top: 8px;
				font-size: 14px;
			}
		}
	}
	
	// 轮播图
	.swiper-view {
		width: 100%;
		margin-top: 20upx;
		
		.swiper {
			height: 160upx;
			
			.swiper-item {
				border-radius: 8px;
				
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
	
	// 常用功能
	.app-outside-view {
		margin-top: 10px;
		height: auto;
		background-color: #ffffff;
		padding-left: 20px;
		padding-right: 20px;
		padding-top: 1px;
		padding-bottom: 21px;
		font-size: 14px;
		
		.app-view {
			height: 30px;
			line-height: 30px;
			margin-top: 20px;
			
			image {
				width: 30px;
				height: 30px;
				float: left;
			}
			.app-name {
				float: left;
				margin-left: 20px;
			}
			.more {
				float: right;
			}
		}
	}
	
	// 弹窗start
	.popup-title-code {
		text-align: center;
		margin-bottom: 20upx;
		margin-top: 20upx;
		float: left;
		margin-left: 6px;
		width: 90px;
	}
	
	.popup-title-password {
		text-align: center;
		margin-bottom: 20upx;
		margin-top: 20upx;
		float: left;
		margin-left: 6px;
		width: 90px;
	}
	
	.popup-content {
		clear: both;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 15px;
		width: 300px;
		background-color: #f1f1f1;
		font-size: 28upx;
		letter-spacing: 2upx;
		color: #50a0f0;
		
		
		
		.phone-view {
			font-size: 28upx;
			
			input {
				width: 70%;
				border-bottom: 2upx solid #8BC34A;
				margin-top: 6upx;
			}
		}
		
		.password-view {
			font-size: 28upx;
			margin-top: 20upx;
			
			input {
				width: 70%;
				border-bottom: 2upx solid #8BC34A;
				margin-top: 6upx;
			}
		}
		
		.code-view {
			font-size: 28upx;
			margin-top: 20upx;
			
			input {
				width: 230upx;
				border-bottom: 2upx solid #8BC34A;
				margin-top: 6upx;
			}
			
			.send-code {
				float: right;
				margin-top: -39upx;
			}
		}
	}
	
	.x {
		position: absolute;
		right: 32rpx;
		top: 8rpx;
		color: #fa0000;
		font-size: 40upx;
	}
	
	.btn-view {
		padding: 15px;
		padding-bottom: 70upx;
		text-align: center;
		
		.confirm-btn {
			float: right;
			width: 120upx;
			height: 40upx;
			line-height: 40upx;
			background-color: #64ADFF;
			color: #FFFFFF;
			font-size: 26upx;
			border-radius: 10upx;
			margin-left: 20upx;
			border: 1upx solid #64ADFF;
		}
		
		.cancel-btn {
			float: right;
			width: 120upx;
			height: 40upx;
			line-height: 40upx;
			font-size: 26upx;
			border: 1upx solid #64ADFF;
			color: #64ADFF;
			border-radius: 10upx;
		}
	}
	// 弹窗end
</style>