const glob = require("glob");
const fs = require("fs");
const { exec } = require("child_process");

const baseDir = __dirname + "/..";
const outputDir = __dirname + "/../../resources/";

const paths = glob.sync(baseDir + "/src/*");

let pathsR = [];
paths.forEach((i) => {
  pathsR.push(i.split("/").slice(-1)[0]);
});

pathsR.forEach((i) => {
  fs.mkdir(outputDir + i, (err) => {
    if (err) {
      console.error(err);
    }
  });
  fs.writeFile(
    outputDir + i + "/fxmanifest.lua",
    `fx_version 'bodacious'game 'gta5'author 'Gustavo Gonzaga'description 'Gonzaga resource'version '0.0.1'client_script 'client/index.js'`,
    (err) => {
      if (err) console.error(err);
    }
  );

  exec(
    "yarn webpack --config ./lib/webpackClient.config.js --mode development",
    (err) => {
      if (err) console.error(err);
    }
  );
});
