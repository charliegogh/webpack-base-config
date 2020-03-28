/**
 * @author charlie
 * @Description:
 * webpack打包环境基础构建
 */
"use strict";
const path = require("path");
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const router=require('./src/router')
module.exports = {
    //入口（一个或多个）    配置多个入口
    entry: {
        main: ["core-js/fn/promise", "./src/main.js"]
    },
    mode: "development",
    //输入  即最终构建的静态文件
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "./dist"),
        publicPath: "/"
    },
    devServer: {
        disableHostCheck: true,  //内网穿透失败解决方式
        contentBase: "dist",
        hot: true,
        overlay: true,
        host: 'localhost',
        port: '8103',
        // 本地开发环境反向代理
        /*        proxy: {
                    '/':{
                        ws:false,
                        target:'http://cs.taodiandating.cn/',
                        secure: true,  // 如果是https接口，需要配置这个参数
                        changeOrigin:true,
                        pathRewrite:{
                            '^/':''
                        }
                    }
                }*/
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'less-loader']
                }),
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
            // JS loaders
            {
                test: /\.js$/,
                use: ['babel-loader'],
                // 排除node_modules中的JS文件
                exclude: /node_modules/
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
        // 分离css
        new ExtractTextPlugin('[name].css'),
        // 本地静态资源访问
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, './src/assest'),
                to: './assest',
            }
        ]),
        // 自动加载模块，而不 import 或 require 。
        new webpack.ProvidePlugin({
            $: 'jquery',
        }),
    ].concat(router())

}