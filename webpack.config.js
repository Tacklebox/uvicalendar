const webpack = require('webpack')
const uglify = require('uglifyjs-webpack-plugin')
const path = require('path')

module.exports = {
  entry: {
    content: path.join(__dirname, 'src', 'main.js'),
    popup: path.join(__dirname, 'src', 'popup.js'),
  },
  node: {fs: 'empty'},
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]-bundle.js'
  },
  plugins: [
    new uglify({ uglifyOptions: { warnings: false } }),
  ]
};
