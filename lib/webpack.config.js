const path = require("path");
const glob = require("glob");

function getFiles(paths) {
  console.log(paths);

  let ret = {};
  paths.forEach((path) => {
    let fileName = path.split("/").slice(-1)[0].split(".ts")[0];
    let filePath = "";
    path.split("/").forEach((i) => {
      filePath = filePath + "/" + i;
    });
    ret[fileName] = filePath;
  });
  console.log(ret);
  return ret;
}

module.exports = function () {
  return {
    entry: getFiles(glob.sync(__dirname + "/../src/client/*.ts")),
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                configFile: __dirname + "/tsconfig.json",
              },
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "..", "..", "resources"),
    },
    watch: true,
    watchOptions: {
      ignored: "../node_modules",
    },
  };
};
