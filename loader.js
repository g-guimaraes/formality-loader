const path = require('path')
const fm = require('formality-lang')
const localLoader = require('formality-lang/cjs/fs-local.js')

module.exports = function loader(content) {
  const file = path.basename(this.resourcePath, '.fm')
  return fm
    .parse(content, {
      loader: localLoader(fm.loader.load_file, this.context),
      file
    })
    .then(({ defs }) => {
      const js = fm.js.compile(fm.core.Ref(file + '/main'), defs)
      return 'module.exports = ' + js
    })
    .catch(err => {
      throw new Error(err)
    })
}
