const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const uglify = require('uglifyjs-webpack-plugin')
const path = require('path')

module.exports = env => ({
  entry: {
    content: path.join(__dirname, 'src', 'content', 'main.js'),
    popup: path.join(__dirname, 'src', 'popup', 'main.js'),
  },
  node: {fs: 'empty'},
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]-bundle.js'
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: './**',
      context: 'src/static/',
      transform(content, path) {
        if (path.indexOf('manifest.json') >= 0) {
          let manifest = JSON.parse(content.toString())
          manifest.version = env.version
          return JSON.stringify(manifest)
        }
        return content
      }
    }]),
    new uglify({ uglifyOptions: { warnings: false } }),
  ]
})
