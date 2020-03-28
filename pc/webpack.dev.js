const path = require("path");
const webpack = require('webpack');
const HTMLWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
    //入口（一个或多个）    配置多个入口
    entry: {
        main: ["core-js/fn/promise", "./src/main.js"]
    },
    //打包环境：development & production
    mode: "development",
    //输入  即最终构建的静态文件
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "./dist"),
        // publicPath: "./"
    },
    devServer: {
        disableHostCheck: true,
        contentBase: "dist",
        //热更新
        hot: true,
        overlay: true,
        host: 'localhost', // can be overwritten by process.env.HOST
        port: '8888',
        proxy: {
            '/':{
                ws:false,
                target:'http://cs.taodiandating.cn/',
                secure: true,  // 是否支出https
                changeOrigin:true,  // 跨域配置
                pathRewrite:{
                    '^/':''
                }  //   请求路径重写
            }
        }
    },
    /**
     * webpack 中提供一种处理多种文件格式的机制
     *
     * 在没有添加额外插件的情况下，webpack 会默认把所有依赖打包成 js 文件
     * 果入口文件依赖一个 .hbs 的模板文件以及一个 .css 的样式文件
     * 那么我们需要 handlebars-loader 来处理 .hbs 文件，
     * 需要 css-loader 来处理 .css 文件（这里其实还需要 style-loader），
     * 最终把不同格式的文件都解析成 js 代码，以便打包后在浏览器中运行。
     */
    module: {
        rules: [
            /**
             * 合并css 将所有样式文件合并  但是没有样式热加载
             */
            // {
            //     test: /\.less$/,
            //     use: ExtractTextPlugin.extract({
            //         fallback: 'style-loader',
            //         use: ['css-loader', 'postcss-loader', 'less-loader']
            //     }),
            // },

            // dev
            {
                test: /\.less$$/,
                use: ['style-loader', 'css-loader','less-loader']
            },

            //html loaders
            {
                test: /\.html$/,
                use: ["html-loader"]
            },
            //image loaders
            {
                //匹配到.jpg|png|svg|gif结尾的文件
                test: /\.(jpg|png|svg|gif)$/,
                //多个loader需要从后到前进行解析(大于10kb打包)
                use: ["url-loader?limit=10&name=images/[name]-[hash:8].[ext]"]
            },
            //JS loaders   使用babel 编写代码
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                                '@babel/plugin-transform-runtime',
                                '@babel/plugin-transform-modules-commonjs'
                        ]
                    }
                }
            }
        ]
    },
    /**
     * plugin 用于处理更多其他的一些构建任务
     * HotModuleReplacementPlugin：代码热更新
     */
    plugins: [
        // rom 热加载
        new webpack.HotModuleReplacementPlugin(),
        new HTMLWebpackPlugin({
            template: "./src/view/index.html",// 配置文件模板
            filename: './index.html', // 配置输出文件名和路径
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        // 分离css
        new ExtractTextPlugin('[name].css'),
        // 本地静态资源访问
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, './public'),
                to: './public',
            }
        ]),
        // 自动加载模块，而不 到处去import 或 require 。
        new webpack.ProvidePlugin({
            $: 'jquery',  // 全局去使用jq
        }),
        // ie8相关配置
        new UglifyJSPlugin({
            sourceMap: true,
            exclude: /node_modules/,
            uglifyOptions: {
                ie8: true // 解决ie下的关键字default的问题
            }
        })
    ]
}
