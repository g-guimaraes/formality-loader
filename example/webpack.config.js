const formalityResolver = require('formality-loader').resolver
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  resolve: { plugins: [formalityResolver] },
  module: {
    rules: [
      {
        test: /\.fm$/,
        loader: 'formality-loader',
        options: {
          typeCheckMode: 'all' // Options: all, none, production, development. Default: all
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
}
