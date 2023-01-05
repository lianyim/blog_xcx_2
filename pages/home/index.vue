<template>
	<view class="content">
		<!-- 轮播图 -->
		<view class="swiper-view">
			<swiper class="swiper" indicator-dots autoplay interval="3000" duration="800">
				<swiper-item class="swiper-item" v-for="(item, index) in carouselList" :key="index" @click="carouselClick(item.pageUrl)">
					<view class="image-wrapper">
						<image :src="item.url" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<official-account></official-account>
		
		<!-- 标签 -->
		<view class="label-view" v-if="false">
			<view class="label" v-for="(item, index) in labelList" :key="index" @click="toLabelDetail(item)">
				<image mode="aspectFill" :src="item.pic"></image>
				<view>{{item.title}}</view>
			</view>
		</view>
		
		<!-- 专题 -->
		<view class="hot-topic">热门专题</view>
		<view class="topic-title" @click="toTopicIndex" v-if="false">查看更多 ></view>
		<view class="topic-outside-view">
			<view class="topic-view" :style="{backgroundImage: 'url(' + item.coverImg + ')'}"
				 v-for="(item, index) in topicList" :key="index" @click="toArticleIndex(item.id)">
				<view class="title">{{item.name}}</view>
				<view class="desc">{{item.desc}}</view>
			</view>
		</view>
		
		<!-- 书籍 -->
		<view class="hot-book">书籍推荐</view>
		<view class="book-title" @click="toBookIndex">查看更多 ></view>
		<view class="book-outside-view">
			<view class="label">作者力荐好书</view>
			<view class="desc">只要功夫深，铁杵磨成针！</view>
			<view class="book-view" v-for="(item, index) in bookList" :key="index" @click="toArticleDetail(item.id)">
				<image mode="aspectFill" :src="item.coverImg"></image>
				<view class="desc-view">
					<view class="book-desc">{{item.title}}</view>
					<view class="price">
						<text style="font-size: 13px;color: #ffaa00;">推荐价格 </text>
						￥{{item.remark}}
					</view>
				</view>
			</view>
		</view>
		
		<!-- 文章类别 -->
		<view class="type-item-spec">
			<view v-for="(item, index) in typeItems" :key="index" :class="{btna:typeCount == index}" @click="">
				<view class="type-name">{{item}}</view>
			</view>
		</view>
		
		<!-- 文章列表 -->
		<view class="article-view" v-for="(item, index) in articleList" :key="index" @click="toArticleDetail(item.id)">
			<view class="article-left">
				<view class="title">{{item.title}}</view>
				<view class="topic-name" v-if="item.topicName !== null">{{item.topicName}}️</view>
				<view style="height: 16px;" v-if="item.topicName === null"></view>
				<view class="desc">{{item.remark}}</view>
				<view class="time">{{item.createDate}}</view>
			</view>
			<view class="article-right">
				<image mode="aspectFit" :src="item.coverImg"></image>
			</view>
		</view>
		
		<view style="height: 20px;"></view>
	</view>
</template>

<script>
	import http from "@/api/backend.js"
	export default {
		data() {
			return {
				pageNum: 1,
				pageSize: 10,
				total: 0,
				carouselList: [],
				labelList: [{
						title: "每日打卡",
						pic: "https://lian-pictures.oss-cn-beijing.aliyuncs.com/smart-box/signIn.png",
						pageUrl: ''
					},
					{
						title: "网站推荐",
						pic: "../../static/imgs/home/webside.png",
						pageUrl: '/pages/topic/articleDetail'
					},
					{
						title: "问题反馈",
						pic: "https://lian-pictures.oss-cn-beijing.aliyuncs.com/smart-box/help.png",
						pageUrl: '/pages/my/message'
					},
					{
						title: "联系作者",
						pic: "https://lian-pictures.oss-cn-beijing.aliyuncs.com/smart-box/kefu.png",
						pageUrl: '/pages/my/author'
					},
					{
						title: "实用工具",
						pic: "../../static/imgs/home/more.png",
						pageUrl: 'wx678dafe70a79518a'
					}
				],
				topicList: [],
				bookList: [],
				typeItems: ['最新文章'],
				btnnum: 0,
				typeCount: '',
				articleList: []
			}
		},
		onShow() {
			uni.hideTabBar()
			this.hiddenTabBar()
		},
		onLoad() {
			this.queryCarouselData(1, 10)
			this.queryHotTopic(1, 4)
			this.queryBook(1, 6, 1)
			this.queryArticle(1, 10, 0, 'create_date')
		},
		onReachBottom() {
			if(this.pageNum * 10 < this.total) {
				this.pageNum++;
				this.queryArticle(this.pageNum, this.pageSize, 0, 'create_date')
			}
		},
		onPullDownRefresh () {
			this.articleList = []
			this.pageNum = 1
			this.pageSize = 10
			this.queryCarouselData(1, 10)
			this.queryHotTopic(1, 4)
			this.queryBook(1, 6, 1)
			this.queryArticle(1, 10, 0, 'create_date')
			uni.stopPullDownRefresh()
		},
		methods: {
			hiddenTabBar(page, limit) {
				http.hiddenTabBar({}).then((res)=>{
					if(!res.data) {
						uni.showTabBar()
					}
				})
			},
			// 查询轮播图
			queryCarouselData(page, limit) {
				http.queryCarousel({page: page, limit: limit, type: '1'}).then((res)=>{
					this.carouselList = res.data.list
				})
			},
			// 查询热门专题
			queryHotTopic(page, limit) {
				http.queryHotTopic({page: page, limit: limit}).then((res)=>{
					this.topicList = res.data.list
				})
			},
			// 查询推荐书籍
			queryBook(page, limit, category) {
				http.queryArticle({page: page, limit: limit, category}).then((res)=>{
					this.bookList = res.data.list
				})
			},
			/**
			 * 查询文章列表
			 * @param {Object} category 分类 0-文章 1-书籍
			 * @param {Object} orderField 排序字段
			 */
			queryArticle(page, limit, category, orderField) {
				http.queryArticle({page: page, limit: limit, category, orderField: orderField, order: 'desc'}).then((res)=>{
					this.articleList = this.articleList.concat(res.data.list)
					this.total = res.data.total
				})
			},
			// 轮播图跳转
			carouselClick(url) {
				if(url.concat('id')) {
					uni.navigateTo({url: `${url}`});
				} else {
					this.goToPage(url)
				}
			},
			goToPage(url) {
				if(url !== "") {
					uni.switchTab({url: `${url}`});
				}
			},
			// 切换分类
			changeType(e) {
				this.typeCount = e
				this.btnnum = e
				this.articleList = []
				this.pageNum = 0
				if(e == 0) {
					this.queryArticle(1, 10, 0, 'create_date')
				} else if(e == 1) {
					this.queryArticle(1, 10, 0, 'read_num')
				}
			},
			// 跳转专题页
			toTopicIndex() {
				uni.switchTab({url: '/pages/topic/index'});
			},
			// 跳转专题详情（文章列表）
			toArticleIndex(id) {
				uni.navigateTo({url: `/pages/topic/detail?id=${id}`});
			},
			// 跳转文章详情
			toArticleDetail(id) {
				uni.navigateTo({url: `/pages/article/detail?id=${id}`});
			},
			// 跳转书籍列表
			toBookIndex() {
				uni.navigateTo({url: '/pages/home/book'});
			},
			// 标签详情跳转
			toLabelDetail(item) {
				if(item.pageUrl === '') {
					uni.showToast({title: '功能完善中', icon: 'none'});
					return;
				}
				// 跳转其它小程序
				if(item.pageUrl.indexOf('wx') == 0) {
					uni.navigateToMiniProgram({
						appId: item.pageUrl,
						success: res => {
						},
						fail: err => {
						}
					});
					return
				}
				uni.navigateTo({url: `${item.pageUrl}`});
			}
		}
	}
</script>

<style lang="scss">
	.content {
		padding-left: 10px;
		padding-right: 10px;
		overflow-x: hidden;
	}
	
	// 轮播图
	.swiper-view {
		width: 106%;
		margin-left: -20upx;
		margin-bottom: 30upx;
		
		.swiper {
			height: 420upx;
			
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
	
	// 标签
	.label-view {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40rpx;
	
		.label {
			text-align: center;
			font-size: $uni-font-size-base;
		}
	
		image {
			width: 80rpx;
			height: 80rpx;
			border-radius: 20rpx;
		}
	}
	
	// 专题
	.hot-topic {
		margin-top: 20px;
		padding-left: 8px;
		border-left: 4px solid #0079FF;
		font-size: 14px;
		font-weight: bold;
	}
	
	.topic-title {
		float: right;
		color: $uni-text-color-grey;
		font-size: $uni-font-size-base;
		margin-top: -20px
	}
	
	.topic-outside-view {
		clear: both;
		height: 190px;
		margin-left: -8px;
		
		.topic-view {
			width: 40%;
			height: 60px;
			margin-left: 10px;
			color: #FFFFFF;
			padding: $uni-spacing-row-base;
			border-radius: 6px;
			float: left;
			margin-top: 10px;
			
			.title {
				font-size: 14px;
				margin-top: 4px;
				margin-left: 6px;
				height: 22px;
			}
			
			.desc {
				font-size: 12px;
				margin-top: $uni-spacing-col-sm;
				margin-left: 6px;
				
				// 文字超出...
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				line-clamp: 2;
				-webkit-box-orient: vertical;
			}
		}
	}
	
	// 书籍推荐
	.hot-book {
		margin-top: 10px;
		padding-left: 8px;
		border-left: 4px solid #0079FF;
		font-size: 14px;
		font-weight: bold;
	}
	
	.book-title {
		float: right;
		color: $uni-text-color-grey;
		font-size: $uni-font-size-base;
		margin-top: -20px;
	}
	
	.book-outside-view {
		margin-top: 10px;
		border-radius: 10px;
		padding-left: 10px;
		padding-right: 10px;
		padding-bottom: 12px;
		min-height: 164px;
		max-height: auto;
		background-color: rgba(238,207,160,0.8);
		padding-top: 20px;
		overflow-y: hidden;
		
		.label {
			width: 80px;
			text-align: center;
			padding-left: 6px;
			padding-right: 6px;
			padding-top: 2px;
			padding-bottom: 2px;
			background-color: #FFFFFF;
			border-radius: 20px;
			font-size: 12px;
			color: #ffaa00;
			margin-left: 10px;
		}
		
		.desc {
			font-size: 16px;
			letter-spacing: 2px;
			color: #ffaa00;
			font-weight: bold;
			margin-top: 10px;
			margin-left: 10px;
		}
		
		.book-view {
			height: 80px;
			border-radius: 10px;
			padding-left: 10px;
			padding-right: 10px;
			padding-top: 10px;
			padding-bottom: 10px;
			background-color: #FFFFFF;
			margin-top: 10px;
			
			image {
				width: 30%;
				height: 80px;
				border-radius: 10px;
				float: left;
			}
			
			.desc-view {
				float: left;
				margin-left: 10px;
				width: 66%;
				
				.book-desc {
					height: 40px;
					font-size: 14px;
					color: $uni-text-color;
					margin-top: 4px;
					
					// 文字超出...
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				.price {
					color: #ff0000;
					font-size: 16px;
					margin-top: 10px;
				}
			}
		}
	}
	
	// 文章类别
	// 未选中样式
	.type-name{
		margin-top: 20px;
		height: 46upx;
		width: 100%;
		color: #000000;
		margin-left: 2px;
		text-align: center;
		margin-left: 20px;
	}
	.type-item-spec {
		display: flex;
		margin-top: 10px;
		margin-left: -20px;
		
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
				width: 100%;
				text-align: center;
				color: #000000;
				font-weight: bold;
				padding-bottom: 4px;
				margin-left: 20px;
			}
		}
	}
	
	// 文章列表
	.article-view {
		height: 90px;
		padding-top: 10px;
		padding-bottom: 20px;
		margin-top: 10px;
		border-bottom: 1px solid $uni-text-color-disable;
		
		.article-left {
			float: left;
			width: 70%;
			
			.title {
				font-size: 14px;
				color: #000000;
				font-weight: bold;
			}
			
			.desc {
				font-size: 12px;
				color: $uni-text-color-grey;
				height: 18px;
				clear: both;
				// 文字超出 ...
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				line-clamp: 1;
				-webkit-box-orient: vertical;
			}
			
			.time {
				font-size: 12px;
				color: $uni-text-color-grey;
				margin-top: 6px;
			}
			
			.topic-name {
				min-width: auto;
				max-width: 70%;
				float: left;
				height: 16px;
				line-height: 16px;
				text-align: center;
				font-size: 10px;
				padding-left: 6px;
				padding-right: 6px;
				background-color: rgb(233, 241, 255);
				border-radius: 4px;
				color: #008fd6;
				margin-top: 6px;
				margin-bottom: 6px;
				// 文字超出 ...
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				line-clamp: 1;
				-webkit-box-orient: vertical;
			}
		}
		
		.article-right {
			float: right;
			width: 30%;
			
			image {
				width: 80px;
				height: 90px;
				float: right;
			}
		}
	}

</style>
