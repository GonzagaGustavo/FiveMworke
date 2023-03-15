# FiveMworke

## The first FiveM TypeScript Framework

# Why use fivemworke?

- Fivemworke's directory system makes development much more organized and automates the generation of fxmanifes.lua resources and configurations
- Fivemworke is in typescript. a great language with typing and that will make development faster with the typing of server functions and client functions.
- Fivemworke will compile the files into one making the project lighter.

# Usage

1. Settup a fivem server. <a href="https://docs.fivem.net/docs/server-manual/setting-up-a-server-vanilla/">Fivem Docs to settup a server</a>
2. Run `npx create-fivemworke-app app` at dir of fivem server.
3. this is the framework folder structure.

```.
  ├── app
  │   └── src
  |         └── resource-name
  |                       └── client
  |                       └── server
  |                       └── nui
  ├── resources
  ├── start.bat
```

4. The name of the folder `resource-name`, will be the name of the resource.
5. The client folder will contain all the files with the client scripts, which when compiled with the build command will be transformed into a single file.
6. Same thing for server folder
7. The nui folder will contain the nui of the resource.

## How it works?

<p>To compile the project execute the `build` command of app.<br />
Fivemworke compiles the client and server script using esbuild and moves the compiled files to the resources folder.<br />
In the nui folder, the `build` command is executed, which creates the build of react, vite, vue, etc... and copies the build files to the resources folder.<br />
Lastly fivemworke generates the fxmanifest.lua for each resource and configures the client_script, server_script and ui_page.
And the only thing you will need to do is restart the resources and see the change on your server
</p>

## Contributions

This is my first open source lib that i'm creating, i don't understand much about open source projects but i'm studying about it, to improve the community and contributors.

Any contribution such as bug reports, bug fixes and framework improvements are welcome and each pull request will be analyzed and if proposed improvements will be merged into the main branch and the new version of the package will be published

- [x] System Files to generate fxmanifest.lua
- [x] Compile ts to /resources
- [x] React
- [ ] Gerar o fxmanifest.lua por ultimo e adionar uipage apenas se existir
