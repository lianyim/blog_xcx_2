(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/other/message"],{5003:function(t,e,n){"use strict";n.d(e,"b",(function(){return a})),n.d(e,"c",(function(){return o})),n.d(e,"a",(function(){}));var a=function(){var t=this.$createElement;this._self._c},o=[]},"568a":function(t,e,n){"use strict";n.r(e);var a=n("82de"),o=n.n(a);for(var i in a)["default"].indexOf(i)<0&&function(t){n.d(e,t,(function(){return a[t]}))}(i);e["default"]=o.a},7926:function(t,e,n){"use strict";(function(t){var e=n("4ea4");n("8cfb");e(n("66fd"));var a=e(n("8a93"));wx.__webpack_require_UNI_MP_PLUGIN__=n,t(a.default)}).call(this,n("543d")["createPage"])},"82de":function(t,e,n){"use strict";(function(t){var a=n("4ea4");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=a(n("253c")),i={created:function(){this},data:function(){return{pageNum:1,pageSize:10,userInfo:{},content:"",commentShow:!1,dataList:[],total:0,boxName:"不二博客",boxImg:"https://lian-pictures.oss-cn-beijing.aliyuncs.com/smart-box/jnh.png"}},onLoad:function(){this.queryMessages(1,10,"create_date","desc")},onShow:function(){},onReachBottom:function(){10*this.pageNum<this.total&&(this.pageNum++,this.queryMessages(this.pageNum,this.pageSize,"create_date","desc"))},onPullDownRefresh:function(){this.dataList=[],this.pageNum=1,this.pageSize=10,this.queryMessages(1,10,"create_date","desc"),t.stopPullDownRefresh()},methods:{openComment:function(t){this.commentShow=t,this.content=""},queryMessages:function(e,n,a,i){var s=this;t.showLoading({title:"加载中"}),o.default.queryFeedback({page:e,limit:n,orderField:a,order:i}).then((function(e){if(0==e.code){for(var n=0;n<e.data.list.length;n++)e.data.list[n].height="124rpx",e.data.list[n].open=!1;s.dataList=s.dataList.concat(e.data.list),s.total=e.data.total,t.hideLoading()}else t.showToast({title:"接口异常",icon:"error"})}))},addFeedback:function(){var e=this;o.default.addFeedback({content:this.content}).then((function(n){10020!=n.code?0==n.code?(e.content="",e.dataList=[],e.queryMessages(1,10,"create_date","desc")):t.showToast({title:n.msg,icon:"error"}):t.showToast({title:"未登录",icon:"error"})}))},toRecord:function(e){1!=this.userInfo.id?t.showToast({title:"未开启查阅权限",icon:"none"}):t.navigateTo({url:"/pages/my/useRecord?userId=".concat(e)})},author:function(e){t.showToast({title:e.remark,icon:"none"})},clickOpen:function(t){t.height="auto",t.open=!0},clickClose:function(t){t.height="124rpx",t.open=!1}}};e.default=i}).call(this,n("543d")["default"])},"8a93":function(t,e,n){"use strict";n.r(e);var a=n("5003"),o=n("568a");for(var i in o)["default"].indexOf(i)<0&&function(t){n.d(e,t,(function(){return o[t]}))}(i);n("e117");var s=n("f0c5"),c=Object(s["a"])(o["default"],a["b"],a["c"],!1,null,"85266d22",null,!1,a["a"],void 0);e["default"]=c.exports},c55a:function(t,e,n){},e117:function(t,e,n){"use strict";var a=n("c55a"),o=n.n(a);o.a}},[["7926","common/runtime","common/vendor"]]]);