const glob = require("glob")

function paths(resource) {
    const baseDir = `${__dirname}/../src/${resource}`
    const clientPaths = glob.sync(baseDir + '/client/**/*.ts')
    const serverPaths = glob.sync(baseDir + '/server/**/*.ts')
    return {
        client: clientPaths,
        server: serverPaths
    }
}

module.exports = paths