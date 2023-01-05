import http from '@/common/http.js'

module.exports = {
	// 密码登录
	loginByPwd: function(param) {
		return http.post('/api/blog/user/login', param);
	},
	// 验证码登录
	loginByCode: function(param) {
		return http.get('/api/blog/user/bindPhone', param);
	},
	// 发送验证码
	sendCode: function(param) {
		return http.get('/api/blog/user/getCode', param);
	},
	// 登出
	logout: function(param) {
		return http.post('/api/blog/user/logout', param);
	},
	// 是否隐藏tabBar
	hiddenTabBar: function(param) {
		return http.get('/api/blog/before/hiddenTabBar', param);
	},
	// 查询我的应用
	queryMyApp: function(param) {
		return http.get('/api/blog/before/queryMyApp', param);
	},
	// 当前用户
	userInfo: function(param) {
		return http.get('/api/blog/userInfo', param);
	},
	// 上传图片
	uploadPic: function(param) {
		return http.uploadPic('/api/blog/oss/upload', param);
	},
	// 删除图片
	deletePic: function(param) {
		return http.get('/api/blog/oss/delete', param);
	},
	// 查询轮播图
	queryCarousel: function(param) {
		return http.get('/api/blog/carousel/page', param);
	},
	// 查询热门专题
	queryHotTopic: function(param) {
		return http.get('/api/blog/topic/page', param)
	},
	// 查询文章列表
	queryArticle: function(param) {
		return http.get('/api/blog/article/page', param)
	},
	// 查询文章详情
	getArticle: function(param) {
		return http.get('/api/blog/article/fetchById', param)
	},
	// 查询专题详情
	getTopic: function(param) {
		return http.get('/api/blog/topic/fetchById', param)
	},
	// 查询圈子列表
	queryCircle: function(param) {
		return http.get('/api/blog/circle/page', param)
	},
	// 查询圈子详情
	getCircle: function(param) {
		return http.get('/api/blog/circle/fetchById', param)
	},
	// 查询动态列表
	queryTrends: function(param) {
		return http.get('/api/blog/trends/page', param)
	},
	// 查询动态详情
	getTrends: function(param) {
		return http.get('/api/blog/trends/fetchById', param)
	},
	// 发表动态
	addTrends: function(param) {
		return http.post('/api/blog/trends', param)
	},
	// 我收藏的文章
	queryMyCollectArticlePage: function(param) {
		return http.get('/api/blog/myLink/queryMyCollectArticlePage', param)
	},
	// 我的圈子
	queryMyCirclePage: function(param) {
		return http.get('/api/blog/myLink/queryMyCirclePage', param)
	},
	// 我关注的用户
	queryMyUserPage: function(param) {
		return http.get('/api/blog/myLink/queryMyUserPage', param)
	},
	// 反馈列表
	queryFeedback: function(param) {
		return http.get('/api/blog/feedback/page', param)
	},
	// 发表反馈
	addFeedback: function(param) {
		return http.post('/api/blog/feedback', param)
	},
	// 评论列表
	queryComment: function(param) {
		return http.get('/api/blog/comment/page', param)
	},
	// 发表评论
	addComment: function(param) {
		return http.post('/api/blog/comment', param)
	},
	// 版本更新记录
	queryUpdatelog: function(param) {
		return http.get('/api/blog/updatelog/page', param)
	},
	// 个人信息编辑
	editUserInfo: function(param) {
		return http.post('/api/blog/user/update', param)
	},
	// 获取用户信息
	getUserInfo: function(param) {
		return http.get('/api/blog/user/userInfo', param)
	},
	// 查询积分变更记录
	queryIntegralRecord: function(param) {
		return http.get('/api/blog/integralRecord/page', param)
	},
	// 新增关联关系（收藏、关注等）
	addMyLink: function(param) {
		return http.post('/api/blog/myLink', param)
	},
	// 修改关联关系（收藏、关注等）
	updateMyLink: function(param) {
		return http.post('/api/blog/myLink/update', param)
	},
	// 是否关联（收藏、关注等）
	isLink: function(param) {
		return http.post('/api/blog/myLink/isLink', param)
	}
}
