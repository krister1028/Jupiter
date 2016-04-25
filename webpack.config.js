const NgAnnotatePlugin = require('ng-annotate-webpack-plugin');

module.exports = {
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

  plugins: [
    new NgAnnotatePlugin({
      add: true
    })
  ]
};