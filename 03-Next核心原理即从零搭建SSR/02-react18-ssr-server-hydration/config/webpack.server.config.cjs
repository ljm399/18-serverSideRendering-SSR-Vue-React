const path = require('path')

module.exports = {
  target: 'node',
  mode: process.env.NODE_ENV || 'development',
  entry: path.resolve(__dirname, '../src/server/index.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'server.bundle.cjs'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { node: 'current' } }],
              ['@babel/preset-react', { runtime: 'automatic' }]
            ]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
}
