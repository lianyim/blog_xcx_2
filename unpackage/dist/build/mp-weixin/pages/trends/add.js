(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/trends/add"],{"09ae":function(t,e,n){"use strict";(function(t){var e=n("4ea4");n("8cfb");e(n("66fd"));var i=e(n("3c5c"));wx.__webpack_require_UNI_MP_PLUGIN__=n,t(i.default)}).call(this,n("543d")["createPage"])},"212c":function(t,e,n){"use strict";var i=n("607f"),c=n.n(i);c.a},"305b":function(t,e,n){"use strict";(function(t){var i=n("4ea4");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var c,o=i(n("253c")),r={created:function(){c=this},data:function(){return{imgArr:[],content:"",pictures:[],circleId:""}},onLoad:function(t){this.circleId=t.circleId},methods:{choseImg:function(){t.chooseImage({count:8,sizeType:["original","compressed"],success:function(e){c.pictures=e.tempFiles;var n=e.tempFiles;console.log("res",c.pictures);for(var i=0;i<n.length;i++)if(n[i].size>10458760)return void t.showToast({title:"图片过大",icon:"error"});t.showLoading({title:"上传中"}),o.default.uploadPic(e.tempFilePaths).then((function(e){c.pictures=e,t.hideLoading(),t.showToast({title:"上传成功",icon:"success"})}))}})},previewImg:function(e){t.previewImage({current:e,urls:this.pictures})},deleteImg:function(t){var e=this;o.default.deletePic({url:t}).then((function(n){if(n.data){var i=e.pictures;e.pictures=i.filter((function(e){return e!=t}))}else e.error()}))},submit:function(){this.paramCheck()&&o.default.addTrends({circleId:this.circleId,content:this.content,pictureList:this.pictures}).then((function(e){10020!=e.code?0==e.code?(t.showToast({title:"发布成功",icon:"success"}),setTimeout((function(){t.navigateBack({delta:1})}),1e3)):t.showToast({title:e.msg,icon:"error"}):t.showToast({title:"未登录",icon:"error"})}))},error:function(){t.showToast({title:"接口请求异常",icon:"error",duration:2e3})},paramCheck:function(){return null==this.content||""==this.content?(t.showToast({title:"请填写您的想法",icon:"none"}),!1):null!=this.pictures&&""!=this.pictures||(t.showToast({title:"请选择照片",icon:"none"}),!1)}}};e.default=r}).call(this,n("543d")["default"])},"3c5c":function(t,e,n){"use strict";n.r(e);var i=n("8bf8"),c=n("b1ec");for(var o in c)["default"].indexOf(o)<0&&function(t){n.d(e,t,(function(){return c[t]}))}(o);n("212c");var r=n("f0c5"),s=Object(r["a"])(c["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],void 0);e["default"]=s.exports},"607f":function(t,e,n){},"8bf8":function(t,e,n){"use strict";n.d(e,"b",(function(){return i})),n.d(e,"c",(function(){return c})),n.d(e,"a",(function(){}));var i=function(){var t=this.$createElement,e=(this._self._c,Object.keys(this.pictures));this.$mp.data=Object.assign({},{$root:{g0:e}})},c=[]},b1ec:function(t,e,n){"use strict";n.r(e);var i=n("305b"),c=n.n(i);for(var o in i)["default"].indexOf(o)<0&&function(t){n.d(e,t,(function(){return i[t]}))}(o);e["default"]=c.a}},[["09ae","common/runtime","common/vendor"]]]);