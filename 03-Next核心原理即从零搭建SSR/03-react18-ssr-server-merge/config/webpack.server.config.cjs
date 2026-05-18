const path = require('path')
const { merge } = require('webpack-merge')

const baseConfig = require('./webpack.base.config.cjs')

module.exports = merge(baseConfig, {
  target: 'node',
  entry: path.resolve(__dirname, '../src/server/index.js'),
  output: {
    filename: 'server.bundle.cjs'
  }
})
