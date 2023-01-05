<template>
	<view class="content">
		<view class="update-view">
			版本更新
			<text class="version" @click="toUpdateRecord">当前版本：{{version}} > </text>
		</view>
		
		<view class="update-view" @click="toDetail(item)" v-for="(item, index) in list" :key="index">
			{{item.name}}
			<text class="version"> > </text>
		</view>
	</view>
</template>

<script>
	import http from "@/api/backend.js"
	export default {
		data() {
			return {
				version: 'v1.0.1',
				list: [
					{
						name: '修改密码',
						pageUrl: '/pages/my/resetPwd'
					},
					{
						name: '关于',
						pageUrl: '/pages/other/about'
					}
				]
			}
		},
		onLoad() {
			this.queryList(1, 10, 'create_date', 'desc')
		},
		onShow() {
		},
		methods: {
			// 跳转更新记录页面
			toUpdateRecord() {
				uni.navigateTo({url: '/pages/other/updateRecord'});
			},
			// 跳转详情页面
			toDetail(e) {
				if(e.pageUrl == '') {
					uni.showToast({title: '功能完善中', icon: 'none'});
					return;
				}
				uni.navigateTo({url: `${e.pageUrl}`});
			},
			// 查询更新记录
			queryList(page, limit, orderField, order) {
				http.queryUpdatelog({page: page, limit: limit, orderField: orderField, order: order}).then((res) => {
					if(res.code != 0) {
						uni.showToast({title: res.msg, icon: 'error'});
						return;
					}
					this.version = res.data.list[0].version
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
		padding: 20upx;
		margin-bottom: 20upx;
		
		.version {
			float: right;
			color: darkgoldenrod;
			font-size: 36rpx;
			margin-top: -4rpx;
		}
	}
</style>