const webpack = require('webpack')
const uglify = require('uglifyjs-webpack-plugin')
const path = require('path')

module.exports = {
  entry: path.join(__dirname, 'src', 'main.js'),
  node: {fs: 'empty'},
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new uglify({ uglifyOptions: { warnings: false } }),
  ]
};
