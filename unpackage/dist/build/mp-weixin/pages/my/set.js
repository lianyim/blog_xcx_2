(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/my/set"],{"0289":function(e,t,n){},"33e3":function(e,t,n){"use strict";(function(e){var t=n("4ea4");n("8cfb");t(n("66fd"));var a=t(n("6a5c"));wx.__webpack_require_UNI_MP_PLUGIN__=n,e(a.default)}).call(this,n("543d")["createPage"])},"36ef":function(e,t,n){"use strict";n.d(t,"b",(function(){return a})),n.d(t,"c",(function(){return o})),n.d(t,"a",(function(){}));var a=function(){var e=this.$createElement;this._self._c},o=[]},"6a5c":function(e,t,n){"use strict";n.r(t);var a=n("36ef"),o=n("9e27");for(var r in o)["default"].indexOf(r)<0&&function(e){n.d(t,e,(function(){return o[e]}))}(r);n("6aea");var i=n("f0c5"),u=Object(i["a"])(o["default"],a["b"],a["c"],!1,null,null,null,!1,a["a"],void 0);t["default"]=u.exports},"6aea":function(e,t,n){"use strict";var a=n("0289"),o=n.n(a);o.a},"9e27":function(e,t,n){"use strict";n.r(t);var a=n("f73d"),o=n.n(a);for(var r in a)["default"].indexOf(r)<0&&function(e){n.d(t,e,(function(){return a[e]}))}(r);t["default"]=o.a},f73d:function(e,t,n){"use strict";(function(e){var a=n("4ea4");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=a(n("253c")),r={data:function(){return{version:"v1.0.1",list:[{name:"修改密码",pageUrl:"/pages/my/resetPwd"},{name:"关于",pageUrl:"/pages/other/about"}]}},onLoad:function(){this.queryList(1,10,"create_date","desc")},onShow:function(){},methods:{toUpdateRecord:function(){e.navigateTo({url:"/pages/other/updateRecord"})},toDetail:function(t){""!=t.pageUrl?e.navigateTo({url:"".concat(t.pageUrl)}):e.showToast({title:"功能完善中",icon:"none"})},queryList:function(t,n,a,r){var i=this;o.default.queryUpdatelog({page:t,limit:n,orderField:a,order:r}).then((function(t){0==t.code?i.version=t.data.list[0].version:e.showToast({title:t.msg,icon:"error"})}))}}};t.default=r}).call(this,n("543d")["default"])}},[["33e3","common/runtime","common/vendor"]]]);