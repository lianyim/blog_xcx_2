(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/home/book"],{"0886":function(t,e,n){"use strict";(function(t){var o=n("4ea4");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=o(n("253c")),i={data:function(){return{pageNum:1,pageSize:10,total:0,bookList:[]}},onLoad:function(){this.queryBook(1,10,1)},onReachBottom:function(){10*this.pageNum<this.total&&(this.pageNum++,this.queryBook(this.pageNum,this.pageSize,1))},onPullDownRefresh:function(){this.bookList=[],this.pageNum=1,this.pageSize=10,this.queryBook(1,10,1),t.stopPullDownRefresh()},methods:{queryBook:function(t,e,n){var o=this;a.default.queryArticle({page:t,limit:e,category:n}).then((function(t){o.bookList=o.bookList.concat(t.data.list),o.total=t.data.total}))},toArticleDetail:function(e){t.navigateTo({url:"/pages/article/detail?id=".concat(e)})}}};e.default=i}).call(this,n("543d")["default"])},"28a6":function(t,e,n){"use strict";var o=n("7402"),a=n.n(o);a.a},"3d9c":function(t,e,n){"use strict";n.r(e);var o=n("ecbf"),a=n("46c2");for(var i in a)["default"].indexOf(i)<0&&function(t){n.d(e,t,(function(){return a[t]}))}(i);n("28a6");var u=n("f0c5"),c=Object(u["a"])(a["default"],o["b"],o["c"],!1,null,null,null,!1,o["a"],void 0);e["default"]=c.exports},"46c2":function(t,e,n){"use strict";n.r(e);var o=n("0886"),a=n.n(o);for(var i in o)["default"].indexOf(i)<0&&function(t){n.d(e,t,(function(){return o[t]}))}(i);e["default"]=a.a},7402:function(t,e,n){},c074:function(t,e,n){"use strict";(function(t){var e=n("4ea4");n("8cfb");e(n("66fd"));var o=e(n("3d9c"));wx.__webpack_require_UNI_MP_PLUGIN__=n,t(o.default)}).call(this,n("543d")["createPage"])},ecbf:function(t,e,n){"use strict";n.d(e,"b",(function(){return o})),n.d(e,"c",(function(){return a})),n.d(e,"a",(function(){}));var o=function(){var t=this.$createElement;this._self._c},a=[]}},[["c074","common/runtime","common/vendor"]]]);