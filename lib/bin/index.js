#!/usr/bin/env node

process.on("unhandledRejection", (err) => {
  throw err;
});
const FiveMwork = require("../FiveMwork.js");
(async () => {
  const fiveM = new FiveMwork();
  await fiveM.makeMagic();
})();
