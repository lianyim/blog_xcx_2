<template>
	<view class="content">
		<view class="info-view">
			<view class="title">新密码：</view>
			<input class="info-input" password placeholder="请输入新密码" v-model="password"/>
		</view>
		<view class="info-view">
			<view class="title">确认密码：</view>
			<input class="info-input" password placeholder="确认密码" v-model="password2"/>
		</view>
		
		<button class="add-btn" @click="save">保存</button>
	</view>
</template>

<script>
	import http from "@/api/backend.js"
	export default {
		data() {
			return {
				password: '',
				password2: ''
			}
		},
		onLoad() {
		},
		onShow() {
		},
		methods: {
			save() {
				if(this.password == '') {
					uni.showToast({title: '请输入新密码', icon: 'none'});
					return;
				}
				if(this.password != this.password2) {
					uni.showToast({title: '两次密码不一致', icon: 'error'});
					return;
				}
				http.editUserInfo({password: this.password}).then((res) => {
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
					uni.showToast({title: '修改成功，请重新登录', icon: 'success'});
					uni.removeStorageSync('token');
					uni.removeStorageSync('userInfo');
					setTimeout(() => {
						uni.navigateBack({delta: 2})
					}, 1000)
				})
				
			}
		}
	}
</script>

<style lang="scss">
	.content {
		padding-top: 20px;
		padding-left: 10px;
		padding-right: 10px;
	}
	
	.info-view {
		height: 36px;
		
		.title {
			float: left;
			width: 30%;
		}
		
		.info-input {
			float: left;
			text-align: right;
			width: 70%;
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