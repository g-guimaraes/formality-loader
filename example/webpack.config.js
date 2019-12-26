var path = require('path')

module.exports = {
  module: {
    rules: [
      {
        test: /\.fm$/,
        loader: 'formality-loader'
      }
    ]
  }
}
