(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/topic/index"],{"0e8e":function(t,e,n){"use strict";n.d(e,"b",(function(){return a})),n.d(e,"c",(function(){return i})),n.d(e,"a",(function(){}));var a=function(){var t=this.$createElement;this._self._c},i=[]},"1baf":function(t,e,n){"use strict";(function(t){var e=n("4ea4");n("8cfb");e(n("66fd"));var a=e(n("fb07"));wx.__webpack_require_UNI_MP_PLUGIN__=n,t(a.default)}).call(this,n("543d")["createPage"])},3179:function(t,e,n){},"637d":function(t,e,n){"use strict";n.r(e);var a=n("e9f4"),i=n.n(a);for(var c in a)["default"].indexOf(c)<0&&function(t){n.d(e,t,(function(){return a[t]}))}(c);e["default"]=i.a},a7c4:function(t,e,n){"use strict";var a=n("3179"),i=n.n(a);i.a},e9f4:function(t,e,n){"use strict";(function(t){var a=n("4ea4");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i=a(n("253c")),c={data:function(){return{pageNum:1,pageSize:10,total:0,cardType:!0,topicList:[]}},onLoad:function(){this.queryTopic(1,10)},onReachBottom:function(){10*this.pageNum<this.total&&(this.pageNum++,this.topicList(this.pageNum,this.pageSize))},methods:{queryTopic:function(t,e){var n=this;i.default.queryHotTopic({page:t,limit:e}).then((function(t){n.topicList=n.topicList.concat(t.data.list),n.total=t.data.total}))},changeCardType:function(){this.cardType=!this.cardType},toArticleIndex:function(e){t.navigateTo({url:"/pages/topic/detail?id=".concat(e)})}}};e.default=c}).call(this,n("543d")["default"])},fb07:function(t,e,n){"use strict";n.r(e);var a=n("0e8e"),i=n("637d");for(var c in i)["default"].indexOf(c)<0&&function(t){n.d(e,t,(function(){return i[t]}))}(c);n("a7c4");var o=n("f0c5"),u=Object(o["a"])(i["default"],a["b"],a["c"],!1,null,null,null,!1,a["a"],void 0);e["default"]=u.exports}},[["1baf","common/runtime","common/vendor"]]]);