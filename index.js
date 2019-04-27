const electron = require("electron");

const { app, BrowserWindow, Menu, ipcMain } = electron;
let startUrl =
  process.env.ELECTRON_START_URL || `file://${__dirname}/build/index.html`;
startUrl = startUrl.trim();

const fs = require('fs');
const buf = fs.readFileSync('./fibonacci.wasm');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    height: 600,
    width: 700,
    resizable: false
  });
  const url = startUrl + "?window=main";
  mainWindow.loadURL(url);

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  if (process.platform === "darwin") {
    Menu.setApplicationMenu(mainMenu);
  } else {
    mainWindow.setMenu(mainMenu);
  }

 mainWindow.webContents.on('did-finish-load', () => { 
   (async () => { 
      res = await WebAssembly.instantiate(buf); 
      const { fib } = res.instance.exports;
      const fibNumber = fib(10);
      mainWindow.webContents.send(
        "new:fib", 
        fibNumber
      );
   })()
 });
  
};

app.on("ready", createWindow);

const menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Quit",
        accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        }
      }
    ]
  },
  {
    label: "View",
    submenu: [{ role: "reload" }, { role: "toggledevtools" }]
  }
];

