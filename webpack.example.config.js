require('dotenv').config();

const path               = require('path');
const webpack            = require('webpack');
const ExtractTextPlugin  = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin  = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: {
    app: './src/main.js',
    vendor: [
      'imports?define=>false&exports=>false!pace-progress',
      'jquery',
      'jquery-ujs',
      'moment',
      'lodash.assign',
      'lodash.debounce',
      'lodash.omit',
      './vendor/scripts/bootstrap',
      'classnames',
      'object-assign',
      'element-resize-detector',
      'outlayer', // user on masonry only
      'get-size', // user on masonry only
      './vendor/scripts/masonry',
      './vendor/scripts/masonry-component',
      'md5',
      'marked',
      'events',
      './vendor/scripts/url',
      './vendor/scripts/jquery.timer',
      'imports?define=>false!./vendor/scripts/jquery.isolatedScroll',
      'js-cookie',
      'mime',
      'typeahead.js',
      'jquery-deparam',
      'twitter-text',
      'autolink-js',
      'imports?define=>false!selectize',
      './vendor/scripts/jquery.tutorialize',
      'imports?define=>false!blueimp-file-upload',
      'filepicker-js',
      'imports?define=>false!./vendor/scripts/bootstrap-submenu',
      'messenger/build/js/messenger',
      'messenger/build/js/messenger-theme-flat',
      'imports?define=>false&exports=>false!vex-js',
      'imports?define=>false&exports=>false!vex-js/js/vex.dialog',
      'prop-types',
      'react',
      'create-react-class',
      'react-dom',
      'flux',
      'react-router',
      'react-froala-wysiwyg',
      'radium',
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
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'js/[name].bundle-[hash].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'src'),
        loader: 'babel-loader?presets[]=react'
      },
      {
        test: /\.ejs?$/,
        loader: 'ejs-loader'
      },
      {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, './vendor/styles')]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'js/vendor.bundle-[hash].js'),
    new ExtractTextPlugin('css/[name].bundle-[hash].css'),
    new HtmlWebpackPlugin({
      template: 'public/index.html.ejs',
      filename: 'index.html',
      inject: false,
      appEnv: 'development'
    }),
    new HtmlWebpackPlugin({
      template: 'public/version.txt.ejs',
      filename: 'version.txt',
      inject: false
    }),
    new CleanWebpackPlugin(['public/css/*', 'public/js/*']),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      moment: 'moment',
      _: 'underscore'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV':     JSON.stringify(process.env.NODE_ENV),
      'window.APP_ENV':           JSON.stringify(process.env.APP_ENV),
      'window.APP_DOMAIN':        JSON.stringify(process.env.APP_DOMAIN),
      'window.APP_HOST':          JSON.stringify(process.env.APP_HOST),
      'window.API_URL':           JSON.stringify(process.env.API_URL),
      'window.SUPPORT_URL':       JSON.stringify(process.env.SUPPORT_URL),
      'window.WELCOME_TOPIC_ID':  JSON.stringify(process.env.WELCOME_TOPIC_ID),
      'window.IDEAS_TOPIC_ID':    JSON.stringify(process.env.IDEAS_TOPIC_ID),
      'window.SUPPORT_TOPIC_ID':  JSON.stringify(process.env.SUPPORT_TOPIC_ID),
      'window.FILESTACK_API_KEY': JSON.stringify(process.env.FILESTACK_API_KEY),
      'window.FILESTACK_API_URL': JSON.stringify(process.env.FILESTACK_API_URL),
      'window.RECAPTCHA_SITE':    JSON.stringify(process.env.RECAPTCHA_SITE),
      'window.RECAPTCHA_SECRET':  JSON.stringify(process.env.RECAPTCHA_SECRET),
      'window.PUSHER_APP_KEY':    JSON.stringify(process.env.PUSHER_APP_KEY)
    }),
    new webpack.DefinePlugin({
      'window.DROPBOX_APP_URL':               JSON.stringify(process.env.DROPBOX_APP_URL),
      'window.DROPBOX_APP_KEY':               JSON.stringify(process.env.DROPBOX_APP_KEY),
      'window.DROPBOX_APP_SECRET':            JSON.stringify(process.env.DROPBOX_APP_SECRET),
      'window.DROPBOX_APP_AUTHORIZATION_URI': JSON.stringify(process.env.DROPBOX_APP_AUTHORIZATION_URI),
      'window.DROPBOX_APP_ACCESS_TOKEN_URI':  JSON.stringify(process.env.DROPBOX_APP_ACCESS_TOKEN_URI)
    }),
    new webpack.DefinePlugin({
      'window.GOOGLE_APP_KEY':               JSON.stringify(process.env.GOOGLE_APP_KEY),
      'window.GOOGLE_APP_SECRET':            JSON.stringify(process.env.GOOGLE_APP_SECRET),
      'window.GOOGLE_APP_AUTHORIZATION_URI': JSON.stringify(process.env.GOOGLE_APP_AUTHORIZATION_URI),
      'window.GOOGLE_APP_ACCESS_TOKEN_URI':  JSON.stringify(process.env.GOOGLE_APP_ACCESS_TOKEN_URI)
    }),
    new webpack.DefinePlugin({
      'window.BOX_APP_URL':               JSON.stringify(process.env.BOX_APP_URL),
      'window.BOX_APP_KEY':               JSON.stringify(process.env.BOX_APP_KEY),
      'window.BOX_APP_SECRET':            JSON.stringify(process.env.BOX_APP_SECRET),
      'window.BOX_APP_AUTHORIZATION_URI': JSON.stringify(process.env.BOX_APP_AUTHORIZATION_URI),
      'window.BOX_APP_ACCESS_TOKEN_URI':  JSON.stringify(process.env.BOX_APP_ACCESS_TOKEN_URI),
      'window.FROALA_EDITOR_KEY':         JSON.stringify(process.env.FROALA_EDITOR_KEY)
    }),
    // new BundleAnalyzerPlugin()
  ],
  node: {
    fs: 'empty'
  }
};
