const { argv } = process
const build = argv[argv.length - 1] === 'build'
module.exports = {
    livereload: !build,
    build,
    gzip: true,
    useLess: true,
    buildFilter: build
        ?
        pathname => !pathname || /(src|lib|css|docs|site|index)/.test(pathname)
        :
        pathname => !pathname || /(src(\/index)|css(\/index)|docs|site(\/index|\/lib)|index)\b/.test(pathname),
    middlewares: [
        {
            middleware: 'rollup',
            mapConfig: (cfg) => {
                return {
                    ...cfg,
                    input: 'site/index.tsx',
                    external: [],
                    output: {
                        format: 'iife',
                        name: 'app',
                        sourcemap: 'bundle.js.map',
                        file: 'bundle.js'
                    }
                }
            }
        }
    ],
    output: require('path').join(__dirname, './output')
}
