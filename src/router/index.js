const HTMLWebpackPlugin = require("html-webpack-plugin");
module.exports = () => {
    return [
        new HTMLWebpackPlugin({
            template: "./src/views/home/index.html",// 配置文件模板
            filename: './home.html', // 配置输出文件名和路径
            inject: true,// 向template或者templateContent中注入所有静态资源，不同的配置值注入的位置不经相同
            minify: {   //  压缩HTML配置
                minifyCSS: true, // 压缩 HTML 中出现的 CSS 代码
                minifyJS: true, // 压缩 HTML 中出现的 JS 代码
                removeComments: true,
                collapseWhitespace: true
            }
        })
    ]
}
