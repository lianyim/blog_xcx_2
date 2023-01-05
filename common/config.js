let url_config  = ""
 
if (process.env.NODE_ENV === 'development'){
    // 开发环境
    // url_config = "http://127.0.0.1:8081/blog"
	url_config = "https://lianlian.space/blog"
} else {
    // 生产环境
	// url_config = "http://120.48.95.192:8081"
	url_config = "https://lianlian.space/blog"
}
 
export default url_config