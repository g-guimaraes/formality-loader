const fm = require('formality-lang')
const localLoader = require('formality-lang/cjs/fs-local.js')(
  fm.loader.load_file
)

module.exports = function loader(content) {
  const fileName = this.currentRequest.split('/').pop()
  const file = fileName.replace('.fm', '')
  return fm.parse(content, { loader: localLoader, file }).then(({ defs }) => {
    const js = fm.js.compile(fm.core.Ref(file + '/main'), defs)
    return 'module.exports = ' + js
  })
}
