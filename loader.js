const path = require('path')
const fm = require('formality-lang')
const loaderUtils = require('loader-utils')
const localLoader = require('formality-lang/cjs/fs-local.js')

module.exports = function loader(content) {
  const options = loaderUtils.getOptions(this) || {}

  const { typeCheckMode = 'all' } = options

  const shouldCheckTypes =
    typeCheckMode === 'all' || typeCheckMode === this.mode

  const file = path.basename(this.resourcePath, '.fm')
  return fm
    .parse(content, {
      loader: localLoader(fm.loader.load_file, this.context),
      file
    })
    .then(({ defs }) => {
      if (shouldCheckTypes) fm.core.typecheck('App/main', null, defs, {})

      const js = fm.js.compile(fm.core.Ref(file + '/main'), defs)
      return 'module.exports = ' + js
    })
    .catch(err => {
      throw new Error(err)
    })
}
