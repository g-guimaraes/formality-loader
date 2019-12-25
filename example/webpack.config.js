var path = require('path')

module.exports = {
  module: {
    rules: [
      {
        test: /\.fm$/,
        loader: path.resolve(__dirname, '../loader'),
        options: {
          typeCheckMode: 'all' // Options: all, none, production, development. Default: all
        }
      }
    ]
  }
}
