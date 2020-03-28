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
const CompressionWebpackPlugin = require('compression-webpack-plugin')
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
        // publicPath: "/"
    },
    devServer: {
        disableHostCheck: true,  //内网穿透失败解决方式
        contentBase: "dist",
        //热更新
        hot: true,
        overlay: true,
        host: 'localhost', // can be overwritten by process.env.HOST
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
            //  合并css 将所有样式文件合并  不支持样式热加载
            // {
            //     test: /\.less$/,
            //     use: ExtractTextPlugin.extract({
            //         fallback: 'style-loader',
            //         use: ['css-loader', 'less-loader']
            //     }),
            // },
            // dev
            {
                test: /\.less$$/,
                use: [
                    'style-loader',
                    {
                    loader: 'css-loader',
                    options: {
                        minimize: true, // 使用 css 的压缩功能
                    },
                    }
                ,'less-loader']
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
                // 借助 url-loader 对小图标进行DataUrl处理
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024, // 单位是 Byte，当文件小于 8KB 时作为 DataURL 处理
                        },
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: { // 压缩 jpeg 的配置
                                progressive: true,
                                quality: 50
                            },
                        }

                    }
                ],
            },
            // JS loaders
            {
                test: /\.js$/,
                use: ['babel-loader'],
                // 排除node_modules中的JS文件
                exclude: /node_modules/
            }
            // JS loaders
/*            {
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
            }*/
        ]
    },
    /**
     * plugin 用于处理更多其他的一些构建任务
     * HotModuleReplacementPlugin：代码热更新
     */
    plugins: [
        // rom 热加载
        new webpack.HotModuleReplacementPlugin(),
        // 分离css   不适用开发环境
        new ExtractTextPlugin('[name].css'),
        // 本地静态资源访问  拎出不需要webpack打包的文件
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, './src/assest'),   // 配置来源
                to: './assest', // 配置目标路径
            }
        ]),
        // 自动加载模块，而不 import 或 require 。
        new webpack.ProvidePlugin({
            $: 'jquery',
        }),
        // 压缩配置
        new CompressionWebpackPlugin({
            // 目标文件名称。[path] 被替换为原始文件的路径和 [query] 查询
            filename: '[path].gz[query]',
            // 使用 gzip 压缩
            algorithm: 'gzip',
            // 处理与此正则相匹配的所有文件
            test: new RegExp(
                '\\.(js|css)$'
            ),
            // 只处理大于此大小的文件
            threshold: 10240,
            // 最小压缩比达到 0.8 时才会被压缩
            minRatio: 0.8
        })
    ].concat(router())
}
