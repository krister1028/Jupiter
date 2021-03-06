const NgAnnotatePlugin = require('ng-annotate-webpack-plugin');
const path = require('path');

module.exports = {
  devtool: 'source-map',

  entry: {
    jupiter: ['./scheduler/frontend/index.js']
  },
  output: {
    path: __dirname + '/static/compiled/',
    filename: '[name]-bundle.js'
  },

  eslint: {
    configFile: '.eslintrc'
  },

  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    },
    {
      test: /\.html$/,
      loader: 'ng-cache',
      exclude: /node_modules/
    }]
  },
  //resolve: {
  //  root: __dirname,
  //  'scheduler': path.join(__dirname, 'scheduler/frontend')
  //}

  //plugins: [
  //  new NgAnnotatePlugin({
  //    add: true
  //  })
  //]
};