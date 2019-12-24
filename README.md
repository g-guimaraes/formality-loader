# formality-loader

`formality-loader` compiles imported [Formality](https://github.com/moonad/Formality) files into a JavaScript module.

## Install

With [webpack](https://github.com/webpack/webpack) correctly installed, add the `formality-loader` dependency:

```console
$ npm install formality-loader --save-dev
```

Then add the loader to your `webpack` config file:

**webpack.config.js**

```js
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
```

## Using

In your JavaScript file, import (or require) your Formality files including the `.fm` extension.

**src/index.js**

```js
import app from './App.fm'

console.log(app(10))
```

**src/App.fm**

```haskell
import Base#

main(n: Number) : Number
  2 .*. n
```

Check the `examples` folder for more info.
