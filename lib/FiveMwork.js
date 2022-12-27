const glob = require("glob");
const fs = require("fs");
const { build } = require("esbuild");
const { exec } = require("child_process");
const getPkgManager = require("./helpers/get-pkg-manager");
const { resolve } = require("path");
const createPromise = require("./helpers/promises");
const ncp = require("ncp").ncp;

class FiveMwork {
  outputDir = __dirname + "/../../resources/";
  baseDir = __dirname + "/..";

  async makeMagic() {
    await this.generateResources();
  }

  async generateResources() {
    let pathsR = [];
    const paths = glob.sync(this.baseDir + "/src/*");

    paths.forEach((i) => {
      pathsR.push(i.split("/").slice(-1)[0]);
    });

    await this.generateManifest(pathsR);
  }

  async generateManifest(pathsR) {
    pathsR.forEach((i) => {
      fs.mkdir(this.outputDir + i, (err) => {
        if (err) {
        }
      });
      fs.writeFile(
        this.outputDir + i + "/fxmanifest.lua",
        `fx_version 'bodacious'game 'gta5'author 'Gustavo Gonzaga'description 'Gonzaga resource'version '0.0.1'ui_page 'cms/index.html'file 'cms/build/*' client_script 'client/**/*.js' server_script 'server/**/*.js'`,
        (err) => {
          if (err) console.error(err);
        }
      );
    });
    try {
      console.log(
        "\x1b[33m Compiling client and server of resources... \x1b[0m"
      );
      await this.generateClientBundle(pathsR);
      await this.generateServerBundle(pathsR);

      console.log("\x1b[36m%s\x1b[0m", " Compiling React NUI...");
      await this.generateCmsBundle(pathsR);
      this.startResources(pathsR);
      // END CONSOLE MESSAGE
      console.log(
        "\x1b[32m%s\x1b[0m",
        " Compiled! Please restart resources..."
      );
    } catch (err) {
      console.error(err);
    }
  }

  async generateClientBundle(paths) {
    await paths.forEach(async (i) => {
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
      await build({
        entryPoints: entrys,
        outdir: this.outputDir + i + "/client",
        bundle: true,
        minify: true,
        platform: "browser",
        target: "es2020",
        logLevel: "info",
      }).catch(() => process.exit(1));
    });
  }

  async generateServerBundle(paths) {
    await paths.forEach(async (i) => {
      let entrys = [];
      const a = glob.sync(`${this.baseDir}/src/${i}/server/**/*.ts`);
      a.forEach((i) => {
        let string = this.baseDir;
        const fragments = i.split("/").slice(2);
        fragments.forEach((i) => {
          string = string + "/" + i;
        });
        entrys.push(string);
      });
      // build
      await build({
        entryPoints: entrys,
        outdir: this.outputDir + i + "/server",
        bundle: true,
        minify: true,
        platform: "browser",
        target: "es2020",
        logLevel: "info",
      }).catch(() => process.exit(1));
    });
  }

  async generateCmsBundle(pathsR) {
    await pathsR.forEach(async (path) => {
      const base = `${this.baseDir}/src/${path}/cms`;
      if (fs.existsSync(base)) {
        const packageManager = getPkgManager();
        await createPromise(
          exec(
            `${packageManager} run build --prefix "${resolve(base)}"`,
            (err, stdout, stderr) => {
              if (err) {
                console.error(err);
              } else if (stderr) {
                console.error("stderr", stderr);
              }
            }
          ).on("close", () => {
            // copiar pasta build para resources cms
            ncp(`${base}/build`, this.outputDir + path + "/cms", (err) => {
              if (err) {
                return console.error(err);
              }
            });
          })
        );
      }
    });
  }

  startResources(pathsR) {
    let newResources = [];

    const resourcesFile = fs.readFileSync(
      __dirname + "/../../resources.cfg",
      "utf8"
    );
    const resources = resourcesFile.split("start");
    pathsR.forEach((p) => {
      const a = resources.find((r) => r.trim() == p);
      if (!a) {
        newResources.push(p);
      }
    });
    if (newResources.length > 0) {
      fs.writeFile(
        this.outputDir + "../resources.cfg",
        resourcesFile +
          newResources.map((r) => {
            return " start " + r;
          }),
        (err) => {
          if (err) throw err;
        }
      );
    }
  }
}

module.exports = FiveMwork;
