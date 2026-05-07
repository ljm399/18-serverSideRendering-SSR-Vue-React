const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  target: 'node',
  mode: 'development',
  entry: './src/server/index.js',
  output: {
    filename: 'server_bundle.js',
    path: path.resolve(__dirname, '../build/server'),
    libraryTarget: 'commonjs2'//告诉node是commjs导出
    /* 
    commonjs vs commonjs2
    commonjs：偏向 exports.xxx = ...
    commonjs2：偏向 module.exports = ...
    */
  },
  externals: [nodeExternals()]
}
