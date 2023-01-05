<template>
	<view class="content">
		<view class="update-view" v-for="(item, index) in dataList" :key="index">
			<view class="time">{{item.createDate}}</view>
			
			<view class="content-view">
				<view class="title">{{item.title}}</view>
				<view class="version">{{item.version}}</view>
				<view class="log-content">{{item.content}}</view>
			</view>
		</view>
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
				dataList: []
			}
		},
		onLoad() {
			this.queryList(1, 10)
		},
		onShow() {
		},
		onReachBottom() {
			if(this.pageNum * 10 < this.total) {
				this.pageNum++;
				this.queryList(this.pageNum, this.pageSize)
			}
		},
		onPullDownRefresh () {
			this.dataList = []
			this.pageNum = 1
			this.pageSize = 10
			this.queryList(1, 10)
			uni.stopPullDownRefresh()
		},
		methods: {
			queryList(page, limit) {
				http.queryUpdatelog({page: page, limit: limit}).then((res) => {
					if(res.code != 0) {
						uni.showToast({title: res.msg, icon: 'error'});
						return;
					}
					this.dataList = this.dataList.concat(res.data.list)
					this.total = res.data.total
				})
			}
		}
	}
</script>

<style lang="less">
	.content {
		padding: 20upx;
	}
	
	.update-view {
		padding-bottom: 30upx;
		
		.time {
			color: #818181;
			font-size: 28upx;
			padding-left: 30upx;
			border-left: 4upx solid #818181;
			margin-bottom: 20upx;
		}
		
		.content-view {
			padding: 20upx;
			box-shadow: 0 0 10upx 6upx #e5e5e5;
			width: 84%;
			margin: 0 auto;
			
			.title {
				float: left;
				font-weight: bold;
				font-size: 30upx;
			}
			
			.version {
				float: right;
				font-size: 30upx;
				margin-right: 30upx;
				margin-bottom: 20upx;
				color: #787878;
			}
			
			.log-content {
				font-size: 28upx;
				letter-spacing: 2upx;
				clear: both;
			}
		}
	}
</style>