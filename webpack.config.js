const webpack = require('webpack');
const path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const packageInfo = require('./package.json');

const defaultToken = 'KYU0JOF1t/ooK85NvoCEkPdWJn5G5N52vJjP8r7IvyGGAQfuX9IBORqoSAfNA/xu';

module.exports = (webpackConfig) => {
  /* eslint no-param-reassign: ["error", { "props": false }] */

  webpackConfig.resolve.modules.push(path.resolve(__dirname, 'src'));

  webpackConfig.module.rules.map((rule) => {
    // 配置js或jsx文件
    if (rule.test && rule.use && new RegExp(rule.test).test('.js')) {
      for (const value of rule.use) {
        // 配置babel-loader
        if (/babel-loader/.test(value.loader)) {
          // lodash细粒度打包
          value.options.plugins.push('lodash');
          // 支持import使用glob语法
          value.options.plugins.push('import-glob-fix');
          // 自动匹配样式，并模块化
          value.options.plugins.push([
            'react-css-modules', {
              // 匹配文件类型
              filetypes: {
                '.less': {
                  // 解析语法
                  syntax: 'postcss-less',
                },
              },
            },
          ]);
        }
      }
    }

    // 配置less文件
    if (rule.test && rule.use && new RegExp(rule.test).test('.less') && rule.exclude) {
      for (const value of rule.use) {
        // 配置css-loader
        if (/css-loader/.test(value.loader) && value.options) {
          value.options.localIdentName = '[path]___[name]__[local]___[hash:base64:5]'; // 与react-css-modules格式一致
          value.options.context = process.cwd(); // path路径与react-css-modules一致
        }
      }
    }

    return null;
  });

  webpackConfig.module.rules.push({
    test: /\.tsx?$/,
    loader: 'ts-loader',
  });

  // 公共资源路径
  webpackConfig.output.publicPath = process.env.NODE_ENV === 'production' ? '/jj-platform/' : '';

  webpackConfig.plugins = webpackConfig.plugins.concat([
    // 定义全局变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV), // 取值：development|production
      'process.env.API_ENV': JSON.stringify(process.env.API_ENV), // 取值：development|dev|sit|beta|stg|release|fix|stress
      'process.env.NO_RPOXY': JSON.stringify(process.env.NO_RPOXY),
      'process.env.DETAIL_TOKEN': JSON.stringify(process.env.DETAIL_TOKEN) || defaultToken,
      VERSION: JSON.stringify(packageInfo.version),
    }),
    // lodash细粒度打包
    new LodashModuleReplacementPlugin({
      shorthands: true,
      collections: true,
      paths: true,
    }),
    // node_modules自动化分离第三方库
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({ resource }) => (
        resource &&
        /node_modules/.test(resource) &&
        resource.match(/\.js$/)
      ),
    }),
    // node_modules自动化分离第三方库：稳定的
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor-common',
      minChunks: ({ resource }) => (
        resource &&
        /(react-dom|elliptic|immutable|moment|bn.js)/.test(resource) &&
        resource.match(/\.js$/)
      ),
    }),
  ]);

  return webpackConfig;
};
