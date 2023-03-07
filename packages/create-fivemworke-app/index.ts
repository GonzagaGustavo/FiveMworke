#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import * as path from "path";
import packageJsonLib from "./package.json";
import * as fs from "fs-extra";
import { ChildProcess, exec } from "child_process";
import os from "os";

async function install(packageManager: string = "yarn", root: string) {
  const packagesToAdd = ["fivemworke", "@types/node", "typescript"];
  const devPackagesToAdd = ["@citizenfx/client", "@citizenfx/server"];

  console.log(`Installing the dependencies using ${packageManager}`);

  const installPackages = exec(
    `cd "${root}" && ${packageManager} add ` + packagesToAdd.join(" ")
  );

  await promiseFromChildProcess(installPackages);

  const installDevPackages = exec(
    `cd "${root}" && ${packageManager} add -D ` + devPackagesToAdd.join(" ")
  );
  await promiseFromChildProcess(installDevPackages);
}

function promiseFromChildProcess(child: ChildProcess) {
  return new Promise(function (resolve, reject) {
    child.addListener("error", reject);
    child.addListener("exit", resolve);
  });
}

async function template(root: string) {
  await fs.copy(`${__dirname}/src/template`, root).catch((err) => {
    if (err) console.log(err);
  });
}
async function reactWithVite(packageManager: string = "npm", root: string) {
  console.log(
    chalk.greenBright("Installing react with ") +
      chalk.blueBright("Vite") +
      chalk.greenBright(" template")
  );

  const cmd = exec(
    `cd "${path.resolve(
      root + "/src/resource"
    )}" && ${packageManager} create vite cms -- --template react-ts`,
    (err) => {
      if (err) console.log(err);
    }
  );

  await promiseFromChildProcess(cmd);
}

async function main() {
  let projectPath: string = "";

  const program = new Command(packageJsonLib.name);

  program
    .version(packageJsonLib.version)
    .arguments("<project-directory>")
    .usage(`${chalk.cyan("<project-directory>")} [options]`)
    .action((name) => {
      projectPath = name;
    })
    .parse(process.argv);

  const originalDirectory = process.cwd();
  const root = path.join(originalDirectory, projectPath);
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

  await fs.promises.writeFile(
    path.join(root, "package.json"),
    JSON.stringify(packageJson, null, 2) + os.EOL
  );

  await install(undefined, root);
  await template(root);
  await reactWithVite(undefined, root);

  console.log(chalk.green("Project created!"));
}
main();
