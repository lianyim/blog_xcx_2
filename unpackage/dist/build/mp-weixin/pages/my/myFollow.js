(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/my/myFollow"],{4273:function(t,e,n){"use strict";n.r(e);var o=n("5b9c"),a=n.n(o);for(var i in o)["default"].indexOf(i)<0&&function(t){n.d(e,t,(function(){return o[t]}))}(i);e["default"]=a.a},"5b9c":function(t,e,n){"use strict";(function(t){var o=n("4ea4");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=o(n("253c")),i={data:function(){return{pageNum:1,pageSize:10,total:0,userList:[],isFocus:!0}},onShow:function(){},onLoad:function(){this.queryMyUserPage(1,10)},onReachBottom:function(){10*this.pageNum<this.total&&(this.pageNum++,this.queryMyUserPage(this.pageNum,this.pageSize))},onPullDownRefresh:function(){this.userList=[],this.pageNum=1,this.pageSize=10,this.queryMyUserPage(1,10),t.stopPullDownRefresh()},methods:{queryMyUserPage:function(e,n){var o=this;a.default.queryMyUserPage({page:e,limit:n}).then((function(e){if(10020==e.code||10021==e.code)return t.showToast({title:"未登录",icon:"error"}),void setTimeout((function(){t.navigateBack({delta:1})}),1e3);0==e.code?null!=e.data.list&&(o.userList=o.userList.concat(e.data.list),o.total=e.data.total):t.showToast({title:e.msg,icon:"error"})}))},toUser:function(e){t.navigateTo({url:"/pages/my/user?userId=".concat(e)})},follow:function(e){e.isFocus?a.default.updateMyLink({sourceId:e.id,category:"3",status:"1"}).then((function(n){0==n.code?e.isFocus=!1:t.showToast({title:n.msg,icon:"error"})})):a.default.updateMyLink({sourceId:e.id,category:"3",status:"0"}).then((function(n){0==n.code?e.isFocus=!0:t.showToast({title:n.msg,icon:"error"})}))}}};e.default=i}).call(this,n("543d")["default"])},"6f9c":function(t,e,n){"use strict";(function(t){var e=n("4ea4");n("8cfb");e(n("66fd"));var o=e(n("d1b6"));wx.__webpack_require_UNI_MP_PLUGIN__=n,t(o.default)}).call(this,n("543d")["createPage"])},"7f83":function(t,e,n){"use strict";n.d(e,"b",(function(){return o})),n.d(e,"c",(function(){return a})),n.d(e,"a",(function(){}));var o=function(){var t=this.$createElement;this._self._c},a=[]},8162:function(t,e,n){"use strict";var o=n("ba74"),a=n.n(o);a.a},ba74:function(t,e,n){},d1b6:function(t,e,n){"use strict";n.r(e);var o=n("7f83"),a=n("4273");for(var i in a)["default"].indexOf(i)<0&&function(t){n.d(e,t,(function(){return a[t]}))}(i);n("8162");var u=n("f0c5"),s=Object(u["a"])(a["default"],o["b"],o["c"],!1,null,null,null,!1,o["a"],void 0);e["default"]=s.exports}},[["6f9c","common/runtime","common/vendor"]]]);