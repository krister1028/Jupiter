module.exports = {
  entry: {
    vendor: ['angular', 'angular-material'],
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
    }]
  }
};