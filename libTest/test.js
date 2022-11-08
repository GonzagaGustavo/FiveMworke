const fs = require("fs");

const paths = ['blip', 'mapmanager', 'fivem']

const resurcesFile = fs.readFileSync(__dirname + "/../../resources.cfg", "utf8")
  const resources = resurcesFile.split("start");
    console.log(resources)
  resources.forEach((i) => {
    const a = paths.find(p => p == i.trim())

  });
