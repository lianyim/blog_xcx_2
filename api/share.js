export default {
	data() {
		return {
			// 设置默认的分享参数
			share: {
				title: '不二博客圈子',
				path: '/pages/home/index',
				imageUrl: '',
				desc: '分享项目开发的技术知识',
				content: ''
			}
		}
	},
	onShareAppMessage(res) {
		return {
			title: this.share.title,
			path: this.share.path,
			imageUrl: this.share.imageUrl,
			desc: this.share.desc,
			content: this.share.content,
			success(res) {
				uni.showToast({
					title: '分享成功'
				})
			},
			fail(res) {
				uni.showToast({
					title: '分享失败',
					icon: 'none'
				})
			}
		}
	},
	// 分享到朋友圈
	onShareTimeline() {
		return {
			title: this.share.title,
			path: this.share.path,
			imageUrl: this.share.imageUrl
		};
	}
}
