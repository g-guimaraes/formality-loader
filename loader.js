const path = require('path')
const fm = require('formality-lang')
const loaderUtils = require('loader-utils')
const localLoader = require('formality-lang/dist/fs-local.js').with_local_files;

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
    .then(({ defs, open_imports }) => {
      // Adding local imports as a file dependency
      Object.entries(open_imports)
        .filter(([name, value]) => value && name.indexOf('#') === -1)
        .map(([name]) => path.join(this.context, name + '.fm'))
        .forEach(this.addDependency)

      //TODO: check all in defs
      //if (shouldCheckTypes) fm.core.typecheck(refName, null, defs, {})

      const js = fm.js.compile(file+"/@", defs)
      return 'module.exports = ' + js
    })
    .catch(err => {
      throw new Error(err)
    })
}
