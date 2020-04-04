/* global require, __dirname, process, module */

// TODO: css compression

'use strict';
require('dotenv').config();
var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
// var CompressionPlugin = require('compression-webpack-plugin');
var RollbarSourceMapPlugin = require('rollbar-sourcemap-webpack-plugin');

loaders.push({
  test: /\.jsx?$/,
  exclude: /(node_modules|bower_components|public\/)/,
  loader: 'babel-loader',
  include: [path.join(__dirname, './src'), /\/node_modules\/flux/]
});

loaders.push({
  test: /\.s?css$/,
  loader: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [{ loader: 'css-loader', options: { minimize: true } }, 'sass-loader']
  })
});

const plugins = [
  new CleanWebpackPlugin([
    'public/css/*',
    'public/js/*',
    'public/*.hot-update.json',
    'public/*.hot-update.js',
    'public/*.hot-update.js.map',
    'public/*.map'
  ]),
  new webpack.DefinePlugin({
    __DEV__: false,
    'process.env.BROWSER': false,
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'window.APP_ENV': JSON.stringify(process.env.APP_ENV),
    'window.APP_DOMAIN': JSON.stringify(process.env.APP_DOMAIN),
    'window.APP_HOST': JSON.stringify(process.env.APP_HOST),
    'window.API_URL': JSON.stringify(process.env.API_URL),
    'window.SUPPORT_URL': JSON.stringify(process.env.SUPPORT_URL),
    'window.WELCOME_TOPIC_ID': JSON.stringify(process.env.WELCOME_TOPIC_ID),
    'window.IDEAS_TOPIC_ID': JSON.stringify(process.env.IDEAS_TOPIC_ID),
    'window.SUPPORT_TOPIC_ID': JSON.stringify(process.env.SUPPORT_TOPIC_ID),
    'window.FILESTACK_API_KEY': JSON.stringify(process.env.FILESTACK_API_KEY),
    'window.FILESTACK_API_URL': JSON.stringify(process.env.FILESTACK_API_URL),
    'window.RECAPTCHA_SITE': JSON.stringify(process.env.RECAPTCHA_SITE),
    'window.RECAPTCHA_SECRET': JSON.stringify(process.env.RECAPTCHA_SECRET),
    'window.PUSHER_APP_KEY': JSON.stringify(process.env.PUSHER_APP_KEY),
    'window.DROPBOX_APP_URL': JSON.stringify(process.env.DROPBOX_APP_URL),
    'window.DROPBOX_APP_KEY': JSON.stringify(process.env.DROPBOX_APP_KEY),
    'window.DROPBOX_APP_SECRET': JSON.stringify(process.env.DROPBOX_APP_SECRET),
    'window.DROPBOX_APP_AUTHORIZATION_URI': JSON.stringify(
      process.env.DROPBOX_APP_AUTHORIZATION_URI
    ),
    'window.DROPBOX_APP_ACCESS_TOKEN_URI': JSON.stringify(
      process.env.DROPBOX_APP_ACCESS_TOKEN_URI
    ),
    'window.SLACK_APP_KEY': JSON.stringify(process.env.SLACK_APP_KEY),
    'window.SLACK_APP_SECRET': JSON.stringify(process.env.SLACK_APP_SECRET),
    'window.SLACK_APP_AUTHORIZATION_URI': JSON.stringify(process.env.SLACK_APP_AUTHORIZATION_URI),
    'window.SLACK_APP_ACCESS_TOKEN_URI': JSON.stringify(process.env.SLACK_APP_ACCESS_TOKEN_URI),
    'window.GOOGLE_APP_KEY': JSON.stringify(process.env.GOOGLE_APP_KEY),
    'window.GOOGLE_APP_SECRET': JSON.stringify(process.env.GOOGLE_APP_SECRET),
    'window.GOOGLE_APP_AUTHORIZATION_URI': JSON.stringify(
      process.env.GOOGLE_APP_AUTHORIZATION_URI
    ),
    'window.GOOGLE_APP_ACCESS_TOKEN_URI': JSON.stringify(
      process.env.GOOGLE_APP_ACCESS_TOKEN_URI
    ),
    'window.BOX_APP_URL': JSON.stringify(process.env.BOX_APP_URL),
    'window.BOX_APP_KEY': JSON.stringify(process.env.BOX_APP_KEY),
    'window.BOX_APP_SECRET': JSON.stringify(process.env.BOX_APP_SECRET),
    'window.BOX_APP_AUTHORIZATION_URI': JSON.stringify(
      process.env.BOX_APP_AUTHORIZATION_URI
    ),
    'window.BOX_APP_ACCESS_TOKEN_URI': JSON.stringify(
      process.env.BOX_APP_ACCESS_TOKEN_URI
    ),
    'window.FROALA_EDITOR_KEY': JSON.stringify(process.env.FROALA_EDITOR_KEY),
  }),
  new webpack.optimize.ModuleConcatenationPlugin(),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: 'js/vendor.bundle-[hash].js',
    // minChunks(module) {
    //   return module.context && module.context.indexOf('node_modules') >= 0;
    // }
  }),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compress: {
      warnings: false,
      screw_ie8: true,
      conditionals: true,
      unused: true,
      comparisons: true,
      sequences: true,
      dead_code: true,
      evaluate: true,
      if_return: true,
      join_vars: true
    },
    output: {
      comments: false
    }
  }),
  new webpack.HashedModuleIdsPlugin(),
  new HtmlWebpackPlugin({
    template: 'public/index.html.ejs',
    filename: 'index.html',
    inject: false,
    appEnv: 'production',
    // minify: {
    //   collapseWhitespace: true,
    //   collapseInlineTagWhitespace: true,
    //   removeComments: true,
    //   removeRedundantAttributes: true
    // }
  }),
  new HtmlWebpackPlugin({
    template: 'public/version.txt.ejs',
    filename: 'version.txt',
    inject: false
  }),
  new ExtractTextPlugin({
    filename: 'css/[name].bundle-[hash].css',
    allChunks: true
  }),
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
    moment: 'moment'
  }),
  new webpack.NamedModulesPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  new RollbarSourceMapPlugin({
    accessToken: 'cc0da5f18d31441d8a0cb4dc128ee52b',
    version: '0.6.15',
    publicPath: 'https://dynamichost'
  })
  // new CompressionPlugin({
  //   asset: '[path].gz[query]',
  //   algorithm: 'gzip',
  //   test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
  //   threshold: 10240,
  //   minRatio: 0.8
  // })
];

module.exports = {
  entry: {
    app: [
      // 'babel-polyfill',
      'react-hot-loader/patch',
      './src/main.js' // your app's entry point
    ],
    vendor: [
      'imports-loader?define=>false&exports=>false!pace-progress',
      'jquery',
      'jquery-ujs',
      'moment',
      './vendor/scripts/bootstrap',
      'classnames',
      'object-assign',
      'element-resize-detector',
      './vendor/scripts/masonry',
      'md5',
      'marked',
      'events',
      './vendor/scripts/url',
      './vendor/scripts/jquery.timer',
      'imports-loader?define=>false!./vendor/scripts/jquery.isolatedScroll',
      'js-cookie',
      'typeahead.js',
      'jquery-deparam',
      'twitter-text',
      'autolink-js',
      'imports-loader?define=>false!selectize',
      './vendor/scripts/jquery.tutorialize',
      'imports-loader?define=>false!blueimp-file-upload',
      'filepicker-js',
      'imports-loader?define=>false!./vendor/scripts/bootstrap-submenu',
      'messenger/build/js/messenger',
      'messenger/build/js/messenger-theme-flat',
      'imports-loader?define=>false&exports=>false!vex-js',
      'prop-types',
      'react',
      'create-react-class',
      'react-dom',
      'flux',
      'react-router',
      'react-froala-wysiwyg',
      'react-mentions',
      'dropbox',
      'react-select',
      'dnd-core',
      'react-dnd',
      'react-dnd-html5-backend',
      'client-oauth2',
      'froala-editor/js/froala_editor.pkgd.min.js'
    ],
    analytics: './src/lib/analytic_vendors.js'
  },
  devtool: 'hidden-source-map',
  output: {
    publicPath: '/',
    path: path.join(__dirname, 'public'),
    filename: 'js/[name].bundle-[hash].js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      Enums: path.resolve(__dirname, 'src/enums'),
      Utils: path.resolve(__dirname, 'src/utils'),
      AppConstants: path.resolve(__dirname, 'src/constants'),
      Actions: path.resolve(__dirname, 'src/actions'),
      Components: path.resolve(__dirname, 'src/components'),
      Lib: path.resolve(__dirname, 'src/lib'),
      Src: path.resolve(__dirname, 'src')
    },
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  module: {
    rules: loaders
  },
  plugins,
  node: {
    fs: 'empty'
  }
};
