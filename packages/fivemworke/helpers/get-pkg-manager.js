const fs = require("fs");

function getPkgManager(path) {
  if (fs.existsSync(path + "/yarn.lock")) {
    return "yarn";
  } else if (fs.existsSync(path + "/package-lock.json")) {
    return "npm";
  } else {
    return "npm";
  }
}
module.exports = getPkgManager;
