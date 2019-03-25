const typescript = require('rollup-plugin-typescript2')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')

module.exports = [{
    input: 'site/index.tsx',
    plugins: [
        nodeResolve(),
        commonjs(),
        typescript(),
    ],
    onwarn: function (warning) {
        switch (warning.code) {
            case 'THIS_IS_UNDEFINED': return
        }
        console.warn(warning.message)
    },
    output: {
        sourcemap: true,
        intro: 'var process = {env: {}};',
        file: 'bundle.js',
        format: 'iife'
    }
}]