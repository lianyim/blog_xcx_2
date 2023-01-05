<template>
	<view class="content">
		<view class="title-view">
			微信：<text class="content" @tap="copy(url)">{{wx}}</text>
		</view>
		<view class="title-view">
			QQ：<text class="content" @tap="copy(url)">{{qq}}</text>
		</view>
		<view class="title-view">
			公众号：
			<image :src="gzh[0]" @tap="previewImage(gzh2)"></image>
		</view>
		
		<view style="height: 40upx;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				wx: 'TL07061030',
				qq: '2236370700',
				gzh: ['https://lian-pictures.oss-cn-beijing.aliyuncs.com/smart-box/gzh.png'],
				gzh2: ['https://lian-pictures.oss-cn-beijing.aliyuncs.com/smart-box/gzh.jpg'],
				url: 'https://www.lianlian.space'
			}
		},
		onLoad() {
			
		},
		onShow() {
		},
		methods: {
			// 复制内容
			copy(item) {
				uni.setClipboardData({
					data: item,
					success: () => {
						uni.showToast({title: '复制成功'})
					}
				});
			},
			// 图片预览
			previewImage(arr) {
				uni.previewImage({
					current: arr[0],
					urls: arr
				})
			}
		}
	}
</script>

<style lang="less">
	.content {
		padding: 20upx;
	}
	
	.title-view {
		margin-top: 20upx;
		margin-bottom: 20rpx;
		padding: 20upx;
		border-bottom: 2upx solid #9f9f9f;
		
		.content {
			color: #868686;
		}
		
		image {
			width: 100%;
			height: 260upx;
			margin-top: 20upx;
			border-radius: 15upx;
		}
	}
</style>