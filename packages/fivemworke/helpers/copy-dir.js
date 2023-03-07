const fs = require("fs-extra");

async function copyDir(source, destination) {
  await fs.copy(source, destination);
}
module.exports = copyDir;
