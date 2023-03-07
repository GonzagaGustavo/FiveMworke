const glob = require("glob");
const fs = require("fs");
const { build } = require("esbuild");
const { exec } = require("child_process");
const getPkgManager = require("./helpers/get-pkg-manager");
const { resolve } = require("path");
const promiseFromChildProcess = require("./helpers/promises");
const copyDir = require("./helpers/copy-dir");
const path = require("path");
const os = require("os");

class FiveMwork {
  outputDir = __dirname + "/../../../resources/";
  baseDir = __dirname + "/../..";
  globDir = __dirname + "/..";

  async makeMagic() {
    await this.generateResources();
  }

  async generateResources() {
    let pathsR = [];
    const paths = glob.sync(this.globDir + "/src/*");

    paths.forEach((i) => {
      pathsR.push(i.split("/").slice(-1)[0]);
    });
    pathsR.forEach((i) => {
      fs.mkdir(this.outputDir + i, (err) => {
        if (err) {
        }
      });
    });

    await this.compile(pathsR);
  }

  async compile(pathsR) {
    console.log("\x1b[33m Compiling client and server of resources... \x1b[0m");
    await this.generateClientBundle(pathsR);
    await this.generateServerBundle(pathsR);

    console.log("\x1b[36m%s\x1b[0m", " Compiling React NUI...");
    await this.generateCmsBundle(pathsR);

    this.startResources(pathsR);

    // END CONSOLE MESSAGE
    console.log("\x1b[32m%s\x1b[0m", " Compiled! Please restart resources...");
  }

  async generateClientBundle(paths) {
    for (let i = 0; i < paths.length; i++) {
      let entrys = [];
      const a = glob.sync(`${this.globDir}/src/${paths[i]}/client/**/*.ts`);
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
        outdir: this.outputDir + paths[i] + "/client",
        bundle: true,
        minify: true,
        platform: "browser",
        target: "es2020",
        logLevel: "info",
      }).catch(() => process.exit(1));
    }
  }

  async generateServerBundle(paths) {
    for (let i = 0; i < paths.length; i++) {
      let entrys = [];
      const a = glob.sync(`${this.globDir}/src/${paths[i]}/server/**/*.ts`);
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
        outdir: this.outputDir + paths[i] + "/server",
        bundle: true,
        minify: true,
        platform: "browser",
        target: "es2020",
        logLevel: "info",
      }).catch(() => process.exit(1));
    }
  }

  async generateCmsBundle(paths) {
    for (let i = 0; i < paths.length; i++) {
      const base = `${this.baseDir}/src/${paths[i]}/cms`;
      if (fs.existsSync(base)) {
        const packageManager = getPkgManager(base);
        fs.rmdir(this.outputDir + paths[i] + "/cms", (err) => {});
        fs.mkdir(base, (err) => {});
        const reactBuild = exec(
          `cd "${resolve(base)}" && ${packageManager} run build`,
          (err, stdout, stderr) => {
            if (err) {
              console.error(`error: ${err.message}`);
              return;
            }

            if (stderr) {
              console.error(`stderr: ${stderr}`);
              return;
            }
          }
        );

        reactBuild.stdout.on("data", (data) => console.log(data.toString()));

        await promiseFromChildProcess(reactBuild);

        // copiar pasta build para resources cms
        await copyDir(`${base}/dist`, this.outputDir + paths[i] + "/cms");

        this.generateManifest(true, paths[i]);
      }
    }
  }

  generateManifest(cms, resource) {
    const resolvedCmsBuildPath = path
      .resolve(this.outputDir + resource)
      .replace(/\\/g, "/");

    const pathCms = glob.sync(
      `${path.resolve(this.outputDir + resource + "/cms")}/**/*`.replace(
        /\\/g,
        "/"
      )
    );

    const cmsFiles = pathCms.map((filePath) => {
      const removedBase = filePath.replace(resolvedCmsBuildPath, "");
      return removedBase.substring(1, removedBase.length);
    });
    cmsFiles.shift();

    const manifest = `fx_version 'bodacious'
game 'gta5'
author ''
description '${resource} resource'
version '1.0.0'
${cms ? `ui_page 'cms/index.html'` : null}
files {
${cmsFiles.map((file) => `'${file}',`).join(os.EOL)}
}
client_script 'client/**/*.js'
server_script 'server/**/*.js'
`;

    fs.writeFile(
      this.outputDir + resource + "/fxmanifest.lua",
      manifest,
      (err) => {
        if (err) console.error(err);
      }
    );
  }

  startResources(pathsR) {
    let newResources = [];

    const resourcesFile = fs.readFileSync(
      this.outputDir + "/../resources.cfg",
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
