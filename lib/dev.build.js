const { resolve } = require('path')
const buildPath = resolve(__dirname, "../../resources")

const { build } = require('esbuild')

build({
    entryPoints: ['../src/client/*'],
    outdir: resolve(buildPath, 'client'),
    bundle: true,
    minify: true,
    plataform: 'browser',
    target: 'ES2020',
    logLevel: "info",
    watch: true
}).catch(() => process.exit(1))