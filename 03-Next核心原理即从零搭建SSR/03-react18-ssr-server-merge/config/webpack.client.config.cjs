const path = require('path')
const { merge } = require('webpack-merge')

const baseConfig = require('./webpack.base.config.cjs')

module.exports = merge(baseConfig, {
  target: 'web',
  entry: path.resolve(__dirname, '../src/client/index.jsx'),
  output: {
    filename: 'client.bundle.js',
    publicPath: '/'
  }
})
