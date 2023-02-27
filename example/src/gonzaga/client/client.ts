RegisterCommand(
  "coords",
  () => {
    const player = global.source; // use (global as any).source for Typescript
    const ped = GetPlayerPed(player);
    const [playerX, playerY, playerZ] = GetEntityCoords(ped);
    console.log(GetPlayerPed(global.source));
    console.log(`${playerX}, ${playerY}, ${playerZ}`);
  },
  false
);
