const HTMLWebpackPlugin = require("html-webpack-plugin");
module.exports = () => {
    return [
            new HTMLWebpackPlugin({
                template: "./src/views/about/index.html",
                filename: './about.html',
                inject: true,
                minify: {
                    removeComments: true,
                    collapseWhitespace: true
                }
            }),
            new HTMLWebpackPlugin({
                template: "./src/views/home/index.html",// 配置文件模板
                filename: './home.html', // 配置输出文件名和路径
                inject: true,
                minify: {
                    removeComments: true,
                    collapseWhitespace: true
                }
            })
    ]
}
