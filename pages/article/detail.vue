<template>
	<view class="content">
		<view class="title">{{title}}</view>
		<view v-for="(content, index) in contentArr" :key="index">
			<rich-text :nodes="content"></rich-text>
		</view>
		<video v-if="video" :src="video" controls></video>
		
		<view v-if="isShowPop">
			<uni-fab
				:pattern="pattern"
				:content="content"
				horizontal="right"
				vertical="bottom"
				direction="horizontal"
				:popMenu="true"
				@trigger="trigger"
				@fabClick="fabClick" />
		</view>
		
		<view style="height: 40upx;"></view>
	</view>
</template>

<script>
	import http from "@/api/backend.js"
	export default {
		data() {
			return {
				isCollect: false,
				// 是否展示悬浮块
				isShowPop: false,
				article: {},
				title: '加载中',
				contentArr: [],
				video: '',
				// 悬浮块 start
				pattern: {
					color: 'gray',
					backgroundColor: '#FFFFFF',
					selectedColor: '#007AFF',
					buttonColor:'orange'
				},
				content: [
					{
						// iconPath: '',
						// selectedIconPath: '/static/componentHL.png',
						text: '收藏',
						active: false,
						type: '1'
					},
					// {
					// 	text: '分享',
					// 	active: false,
					// 	type: '2'
					// },
					{
						// iconPath: '/static/api.png',
						// selectedIconPath: '/static/apiHL.png',
						text: '复制链接',
						active: false,
						type: '3'
					}
				],
				// 悬浮块 end
				share: {
					title: '不二博客圈子',
					path: '/pages/home/index',
					imageUrl: '',
					desc: '分享项目开发的技术知识',
					content: ''
				}
			}
		},
		onShow() {
	
		},
		onLoad(e) {
			uni.showLoading({title: "加载中"});
			this.getArticle(e.id)
			uni.hideLoading()
		},
		methods: {
			// 查询文章详情
			getArticle(id) {
				http.getArticle({id: id}).then((res)=>{
					this.title = res.data.title
					
					// 处理内容节点和视频
					let content = res.data.content
					if (typeof content != 'string') {
						// 不是HTML字符串格式的暂不处理
						this.contentArr[0] = content;
						this.videoArr[0] = null;
						return false;
					}
						
					// 同步解决如果图片太大超出手机显示界面的问题
					let nodes = content.replace(/\<img/g, '<img style="max-width:98%!important;height:auto;"');
					let arr = nodes.split('</video>');
					let reg = /<video([\s\S]*)/g;
						
					for (let i in arr) {
						var item = arr[i];
						this.contentArr[i] = item.replace(reg, '');
					}
					
					this.article = res.data
					
					// 是文章时展示悬浮块
					this.isShowPop = res.data.category == '0'
					
					// 无三方链接时，悬浮块不展示复制链接
					if(res.data.thirdUrl == null || res.data.thirdUrl == "") {
						this.content.splice(1, 2)
					}
					
					this.isLink(res.data.id)
					
					this.setShareParam(res.data)
				})
			},
			// 悬浮块 start
			trigger(e) {
				// 收藏
				if(e.item.type == '1') {
					if(this.isCollect) {
						this.updateMyLink(this.article.id)
					} else {
						this.addMyLink(this.article.id)
					}
				// 复制文章地址
				} else if(e.item.type == '2') {
					uni.showToast({title: '分享', icon: 'none'});
				} else if(e.item.type == '3') {
					this.copy(this.article.thirdUrl)
				}
				
			},
			fabClick() {
				// uni.showToast({
				// 	title: '点击了悬浮按钮',
				// 	icon: 'none'
				// });
			},
			// 悬浮块 end
			// 收藏
			addMyLink(id) {
				http.addMyLink({sourceId: id, category: '1', status: '0'}).then((res)=>{
					if(res.code == 10020 || res.code == 10021) {
						uni.showToast({title: '未登录', icon: 'error'});
						return;
					}
					if(res.code != 0) {
						uni.showToast({title: res.msg, icon: 'error'});
						return;
					}
					this.isLink(this.article.id)
					uni.showToast({title: '收藏成功', icon: 'none'});
				})
			},
			// 取消收藏
			updateMyLink(id) {
				http.updateMyLink({sourceId: id, category: '1', status: '1'}).then((res)=>{
					if(res.code == 10020 || res.code == 10021) {
						uni.showToast({title: '未登录', icon: 'error'});
						return;
					}
					if(res.code != 0) {
						uni.showToast({title: res.msg, icon: 'error'});
						return;
					}
					this.isLink(this.article.id)
					uni.showToast({title: '取消收藏', icon: 'none'});
				})
			},
			// 是否关联（收藏）
			isLink(id) {
				http.isLink({sourceId: id, category: '1'}).then((res)=>{
					if(res.code != 0) {
						return;
					}
					// 是否收藏
					this.content[0].text = res.data ? '已收藏' : '收藏'
					if(res.data) {
						this.content[0].active = true
					} else {
						this.content[0].active = false
					}
					this.isCollect = res.data
				})
			},
			// 复制内容
			copy(item) {
				uni.setClipboardData({
					data: item,
					success: () => {
						uni.showToast({title: '复制成功'})
					}
				});
			},
			// 设置分享参数
			setShareParam(data) {
				this.share.title = data.title
				this.share.desc = data.remark
				// this.share.content = data.remark
				this.share.path = 'pages/article/detail?id=' + data.id
				this.share.imageUrl = data.coverImg
			}
		}
	}
</script>

<style lang="scss">
	.content {
		padding-top: 20px;
	}
	
	.title {
		font-size: 18px;
		font-weight: bold;
		text-align: center;
	}
</style>