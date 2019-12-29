const path = require('path')
const fs = require('fs')
const fm = require('formality-lang')
const withLocalFiles = require('formality-lang/dist/fs-local.js')
  .with_local_files
const withFileSystemCache = require('formality-lang/dist/fs-cache.js')
  .with_file_system_cache

module.exports = function formalityLoader(content) {
  const loader = withLocalFiles(getFromCache, this.context)
  const file = path.basename(this.resourcePath, '.fm')
  return fm
    .parse(content, { loader, file })
    .then(({ defs, open_imports }) => {
      // Adding local imports as a file dependency
      getDependentFiles(open_imports, this.context).forEach(this.addDependency)

      const name = (this.resourceQuery || '?@').slice(1)
      const term = `${file}/${name}`

      const { typeCheckMode = 'all' } = this.query
      const shouldCheckTypes =
        typeCheckMode === 'all' || typeCheckMode === this.mode

      if (shouldCheckTypes) typeCheck(term, defs)

      const js = fm.js.compile(term, defs)

      return 'module.exports = ' + js
    })
    .catch(err => {
      throw new Error(err)
    })
}

module.exports.resolver = {
  apply(resolver) {
    resolver
      .getHook('described-resolve')
      .tapAsync('formalityResolver', (req, resolveContext, callback) => {
        if (!req.request.includes('.fm') || req.resolved) return callback()

        const request = path.resolve(
          req.module ? cachePath : req.path,
          req.request.replace('.fm/', '.fm?')
        )

        const [filePath] = request.split('?')

        const resolve = () =>
          resolver.doResolve(
            resolver.ensureHook('resolve'),
            { ...req, request, resolved: true },
            null,
            resolveContext,
            callback
          )

        if (req.module)
          fs.exists(filePath, fileExits =>
            fileExits
              ? resolve()
              : getFromCache(path.basename(filePath, '.fm')).then(resolve)
          )
        else resolve()
      })
  }
}

const cachePath = path.join(__dirname, 'fm_modules')

const getFromCache = withFileSystemCache(
  withDownloadWarning(fm.loader.load_file),
  cachePath
)

function typeCheck(term, defs) {
  if (term.endsWith('/@')) {
    const file = term.slice(0, -1)
    Object.keys(defs)
      .filter(defName => defName.startsWith(file))
      .forEach(defName => fm.core.typecheck(defName, null, defs))
  } else fm.core.typecheck(term, null, defs)
}

function getDependentFiles(imports, filesPath) {
  return Object.entries(imports)
    .filter(([name, value]) => value && !name.includes('#'))
    .map(([name]) => path.join(filesPath, name + '.fm'))
}

let warned_about_downloading = false
function withDownloadWarning(loader) {
  return file => {
    if (!warned_about_downloading) {
      console.info(
        'Downloading files to `fm_modules`. This may take a while...'
      )
      warned_about_downloading = true
    }
    return loader(file)
  }
}
