<template>
	<view class="content">
		<!-- <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
		   <image class="avatar" mode="aspectFit" :src="userInfo.headUrl"></image>
		</button> -->
		<button class="avatar-wrapper" @click="uploadHeadUrl">
		   <image class="avatar" mode="aspectFit" :src="headUrl"></image>
		</button>
		
		<view class="info-view">
			<view class="title">手机号：</view>
			<input class="info-input" type="number" disabled placeholder="请输入手机号" v-model="phone"/>
		</view>
		
		<view class="info-view">
			<view class="title">昵称：</view>
			<input class="info-input" type="nickname" placeholder="请输入昵称" v-model="userInfo.username"/>
		</view>
		
		<view class="info-view">
			<view class="title">性别：</view>
			<input class="info-input" disabled placeholder="请选择性别" v-model="sex" @click="chooseSex"/>
		</view>
		
		<view class="info-view">
			<view class="title">邮箱：</view>
			<input class="info-input" placeholder="请输入邮箱" v-model="userInfo.email"/>
		</view>
		
		<button class="add-btn" @click="save">保存</button>
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
				phone: '',
				sex: '',
				headUrl: '',
				userInfo: {},
				sexList: [
					'男', '女'
				]
			}
		},
		onLoad(e) {
			this.getUserInfo()
			this.phone = e.phone
		},
		onShow() {
		},
		methods: {
			// 选择头像
			// #ifdef H5
					choseImg() {
						uni.chooseImage({
							count: 1,
							sizeType: ['original', 'compressed'],
							success: function(res) {
								
							}
						});
					},
			// #endif
			// #ifdef APP-PLUS
					choseImg() {
						uni.chooseImage({
							count: 1,
							sizeType: ['original', 'compressed'],
							success: function(res) {
								
							}
						});
					},
			// #endif
			// #ifdef MP
			   uploadHeadUrl() {
				   uni.chooseImage({
				   	count: 1,
				   	sizeType: ['original', 'compressed'],
				   	success: function(res) {
						console.log(res)
				   		let arr = res.tempFiles
				   		for(let i = 0; i < arr.length; i++) {
				   			if(arr[i].size > 10458760) {
				   				uni.showToast({
				   					title: "图片过大",
				   					icon: 'error'
				   				});
				   				return
				   			}
				   		}
				   		uni.showLoading({title: "上传中"});
				   		http.uploadPic(res.tempFilePaths).then(picRes => {
							console.log(picRes)
				   			_self.headUrl = picRes[0]
				   			uni.hideLoading()
				   			uni.showToast({title: "上传成功", icon: 'success'});
				   		})
				   	}
				   })
			   },
			// #endif
			
			// 选择性别
			chooseSex() {
				uni.showActionSheet({
					itemList: this.sexList,
					success: function (res) {
						_self.sex = res.tapIndex === 0 ? '男' : '女'
					},
					fail: function (res) {
						console.log(res.errMsg);
					}
				});
			},
			// 保存
			save() {
				this.userInfo.mobile = this.phone
				this.userInfo.sex = this.sex
				this.userInfo.headUrl = this.headUrl
				http.editUserInfo(this.userInfo).then((res) => {
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
					uni.showToast({title: '保存成功', icon: 'success'});
					setTimeout(() => {
						uni.navigateBack({delta: 1})
					}, 1000)
				})
			},
			// 当前用户
			getUserInfo() {
				http.userInfo({}).then((res)=>{
					if(res.code == 10020 || res.code == 10021) {
						return;
					}
					if(res.code != 0) {
						uni.showToast({title: res.msg, icon: 'error'});
						return;
					}
					this.userInfo = res.data
					this.headUrl = res.data.headUrl
					this.sex = res.data.sex
				})
			}
		}
	}
</script>

<style lang="less">
	.content {
		padding: 20upx;
	}
	
	.avatar-wrapper {
		width: 110upx;
		height: 110upx;
		margin-top: 30upx;
		margin-bottom: 70upx;
		
		image {
			width: 110upx;
			height: 110upx;
			margin-left: -30upx;
		}
	}
	
	.info-view {
		height: 36px;
		
		.title {
			float: left;
			width: 20%;
		}
		
		.info-input {
			float: left;
			text-align: right;
			width: 80%;
		}
		
	}
	
	.add-btn {
		width: 160upx;
		height: 60upx;
		background-color: #64ADFF;
		color: #ffffff;
		line-height: 60upx;
		font-size: 30upx;
		margin-top: 40px;
	}
</style>