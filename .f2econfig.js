const { argv } = process
const build = argv[argv.length - 1] === 'build'
module.exports = {
    livereload: !build,
    build,
    gzip: true,
    useLess: true,
    buildFilter: pathname => !pathname || /(src(\/index|\/lib)|css(\/index)|docs|site(\/index)|index)\b/.test(pathname),
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
    ]
}
