<template>
	<view class="content">
		<rich-text :nodes="content"></rich-text>
	</view>
</template>

<script>
	import http from "@/api/backend.js"
	export default {
		data() {
			return {
				content: ''
			}
		},
		onLoad() {
			this.queryArticle(1, 1, '2', null)
		},
		onShow() {
		},
		methods: {
			queryArticle(page, limit, category) {
				http.queryArticle({page: page, limit: limit, category, order: 'desc'}).then((res)=>{
					this.content = res.data.list[0].content
				})
			}
		}
	}
</script>

<style lang="less">
	.content {
		padding: 20upx;
	}
	
</style>