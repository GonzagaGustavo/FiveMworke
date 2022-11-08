const blips = [
  { id: 225, title: "Garagem 1", colour: 3, x: -429.98, y: 1205.2, z: 325.75 },
  {
    title: "McDonald's",
    colour: 46,
    id: 52,
    x: -1144.37,
    y: -1719.846,
    z: 3.937898,
  },
];

for (let i = 0; i < blips.length; i++) {
  let blip = AddBlipForCoord(blips[i].x, blips[i].y, blips[i].z);
  SetBlipSprite(blip, blips[i].id);
  SetBlipDisplay(blip, 4);
  SetBlipScale(blip, 1.0);
  SetBlipColour(blip, blips[i].colour);
  SetBlipAsShortRange(blip, true);
  BeginTextCommandSetBlipName("STRING");
  AddTextComponentString(blips[i].title);
  EndTextCommandSetBlipName(blip);
  SetBlipCategory(blip, blips[i].id);
}