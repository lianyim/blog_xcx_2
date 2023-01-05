<template>
	<view class="content">
		<view class="text-area-view">
			<textarea v-model="content" placeholder="写下这一刻的想法..."></textarea>
		</view>

		<view class="imgView" @click="choseImg()" v-if="pictures.length === 0">
			<image src="../../static/imgs/common/upload.png"></image>
		</view>
		<view style="font-size: 26rpx;color: #999999;margin-top: 20rpx;">单张图片大小不能超过10M</view>
		<!-- 预览图片 -->
		<view class="preImage" v-if="pictures.length !== 0">
			<view v-for="(item, index) in pictures" :key="index" style="float: left;margin-left: 20rpx;">
				<image mode="aspectFill" :src='item' @click="previewImg(item)"></image>
				<image @click="deleteImg(item)"
					style="width: 30rpx;height: 30rpx;margin-bottom: 130rpx;margin-left: -6rpx;"
					src="../../static/imgs/common/x.png"></image>
			</view>
			<view></view>
		</view>
		
		<view class="btn-view" v-if="Object.keys(this.pictures).length > 0">
			<button class="confirm-btn" @click="submit">发表</button>
		</view>
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
				imgArr: [],
				content: '',
				pictures: [],
				circleId: ''
			}
		},
		onLoad(e) {
			this.circleId = e.circleId
		},
		methods: {
			choseImg() {
				uni.chooseImage({
					count: 8,
					sizeType: ['original', 'compressed'],
					success: function(res) {
						_self.pictures = res.tempFiles
						let arr = res.tempFiles
						console.log('res', _self.pictures)
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
							_self.pictures = picRes
							uni.hideLoading()
							uni.showToast({title: "上传成功", icon: 'success'});
						})
					}
				});
			},
			previewImg(item) {
				uni.previewImage({
					current: item,
					urls: this.pictures
				})
			},
			deleteImg(item) {
				http.deletePic({url: item}).then(res => {
					if(res.data) {
						let arr = this.pictures
						this.pictures = arr.filter(function(i) {
						    return i != item
						});
						return;
					}
					this.error()
				})
			},
			// 发表
			submit() {
				if(!this.paramCheck()) {
					return;
				}
				http.addTrends({circleId: this.circleId, content: this.content, pictureList: this.pictures}).then(res => {
					if(res.code == 10020) {
						uni.showToast({title: '未登录', icon: 'error'});
						return;
					}
					if(res.code != 0) {
						uni.showToast({title: res.msg, icon: 'error'});
						return;
					}
					uni.showToast({title: '发布成功', icon: 'success'});
					setTimeout(() => {
						uni.navigateBack({delta: 1})
					}, 1000)
				})
			},
			error() {
				uni.showToast({
					title: '接口请求异常',
					icon: 'error',
					duration: 2000
				})
			},
			paramCheck() {
				if(this.content == null || this.content == "") {
					uni.showToast({title: '请填写您的想法',icon: 'none'});
					return false
				}
				if(this.pictures == null || this.pictures == "") {
					uni.showToast({title: '请选择照片',icon: 'none'});
					return false
				}
				return true
			}
		}
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 30rpx;
	}
	
	.text-area-view {
		
		textarea {
			width: 100%;
			height: 200rpx;
			font-size: 28rpx;
		}
	}

	.imgView {
		width: 240rpx;
		height: 240rpx;
		background-color: #f1f1f1;
		display: flex;
		border-radius: 10rpx;
		margin-top: 20rpx;

		image {
			width: 80rpx;
			height: 80rpx;
			align-self: center;
			margin: 0 auto;
		}
	}

	.preImage {
		margin-left: -20rpx;
		margin-top: 20rpx;

		image {
			width: 160rpx;
			height: 160rpx;
			border-radius: 16rpx;

		}

		.addView {
			width: 160rpx;
			height: 160rpx;
			// background-color: #f1f1f1;
			display: flex;
			margin-left: 20rpx;

			image {
				width: 80rpx;
				height: 80rpx;
				align-self: center;
				margin: 0 auto;
			}
		}
	}
	.btn-view {
		width: 100%;
		height: 100rpx;
		margin-top: 100rpx;
	
		.confirm-btn {
			float: left;
			border-radius: 20rpx;
			background-color: #fea724;
			width: 20%;
			height: 60rpx;
			line-height: 60rpx;
			color: #FFFFFF;
			font-size: 30rpx;
		}
	}
</style>
