const glob = require("glob");
const fs = require("fs");
const { build } = require("esbuild");

class FiveMwork {
  type;
  outputDir = __dirname + "/../../resources/";
  baseDir = __dirname + "/..";

  constructor(type) {
    this.type = type;
  }

  makeMagic() {
    this.generateResources();
  }

  generateResources() {
    let pathsR = [];
    const paths = glob.sync(this.baseDir + "/src/*");

    paths.forEach((i) => {
      pathsR.push(i.split("/").slice(-1)[0]);
    });

    this.generateManifest(pathsR);
  }

  generateManifest(pathsR) {
    pathsR.forEach((i) => {
      fs.mkdir(this.outputDir + i, (err) => {
        if (err) {
          console.error(err);
        }
      });
      fs.writeFile(
        this.outputDir + i + "/fxmanifest.lua",
        `fx_version 'bodacious'game 'gta5'author 'Gustavo Gonzaga'description 'Gonzaga resource'version '0.0.1'client_scripts 'client/**/*.js'`,
        (err) => {
          if (err) console.error(err);
        }
      );
    });
    this.generateClientBundle(pathsR);
  }

  generateClientBundle(paths) {
    paths.forEach((i) => {
      let entrys = [];
      const a = glob.sync(`${this.baseDir}/src/${i}/client/**/*.ts`);
      a.forEach((i) => {
        let string = this.baseDir;
        const fragments = i.split("/").slice(2);
        fragments.forEach((i) => {
          string = string + "/" + i;
        });
        entrys.push(string);
      });
      // build
      build({
        entryPoints: entrys,
        outdir: this.outputDir + i + '/client',
        bundle: true,
        minify: true,
        platform: "browser",
        target: "es2020",
        logLevel: "info",
      }).catch(() => process.exit(1));
    });
  }

  generateServerBundle(paths) {}
}

module.exports = FiveMwork;
