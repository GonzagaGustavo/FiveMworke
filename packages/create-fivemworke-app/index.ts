#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import * as path from "path";
import packageJsonLib from "./package.json";
import * as fs from "fs-extra";
import { exec } from "child_process";
import { ncp } from "ncp";

async function main() {
  let projectPath: string = "";

  const program = new Command(packageJsonLib.name)
    .version(packageJsonLib.version)
    .arguments("<project-directory>")
    .usage(`${chalk.cyan("<project-directory>")} [options]`)
    .action((name) => {
      projectPath = name;
    })
    .parse(process.argv);

  const root = path.resolve(projectPath);
  const appName = path.basename(root);

  fs.ensureDirSync(projectPath);

  console.log(`Creating fivemworke project in ${chalk.greenBright(root)}`);
  const packageJson = {
    name: appName,
    version: "0.1.0",
    private: true,
    scripts: {
      build: "fivemworke",
    },
  };
  console.log(path.join(root, "/package.json"));
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );

  //   await install(undefined, root);
  template(root);
}
main();

async function install(packageManager: string = "yarn", root: string) {
  const packages = new Promise((resolve, reject) => {
    const packagesToAdd = ["fivemworke", "@types/node", "typescript"];

    const installer = exec(
      `cd ${root} && ` +
        packageManager +
        " add" +
        packagesToAdd.map((pkg) => `${pkg} `)
    );
    installer.addListener("error", reject);
    installer.addListener("exit", resolve);
  });

  const devPackages = new Promise((resolve, reject) => {
    const devPackagesToAdd = ["@citizenfx/client", "@citizenfx/server"];

    const installer = exec(
      packageManager + " add -D " + devPackagesToAdd.map((pkg) => ` ${pkg}`)
    );
    installer.addListener("error", reject);
    installer.addListener("exit", resolve);
  });

  await packages;
  await devPackages;
}

function template(root: string) {
  ncp(`./src/template`, root, (err) => console.log(err));
}
