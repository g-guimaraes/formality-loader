# formality-loader

`formality-loader` compiles imported [Formality](https://github.com/moonad/Formality) files into a JavaScript module.

## Install

With [webpack](https://github.com/webpack/webpack) correctly installed, add `formality-loader` and `formality-lang` as dependencies:

```console
$ npm install  formality-loader formality-lang --save-dev
```

Then add the loader to your `webpack` config file:

**webpack.config.js**

```js
const formalityResolver = require('formality-loader').resolver

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
  }
}
```

## Using

In your JavaScript file, import (or require) your Formality files including the `.fm` extension.

**src/index.js**

```js
import app from './App.fm' // import all terms of local file 'App.fm'
import main from './App.fm/main' // import term 'main' of local file 'App.fm'
import area from 'Area#o99z.fm' // all terms of global file 'Area#o99z.fm'
import circleArea from 'Area#o99z.fm/circle_area' // all term 'circle_area' global file 'Area#o99z.fm'

console.log(app.main(10))
```

**src/App.fm**

```haskell
import Base#

main(n: Number) : Number
  2 .*. n
```

Check the [example](https://github.com/g-guimaraes/formality-loader/tree/master/example) folder for more info.
