const { resolve } = require('path')
const buildPath = resolve(__dirname, "../../resources")

const { build } = require('esbuild')

build({
    entryPoints: ['../src/client/*.ts'],
    outdir: resolve(buildPath, 'client'),
    bundle: true,
    minify: true,
    platform: 'browser',
    target: 'ES2020',
    logLevel: "info"
}).catch(() => process.exit(1))