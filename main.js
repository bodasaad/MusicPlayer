const electron = require("electron");
const packager = require('electron-packager')
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;


const path = require("path");
const url = require("url");

process.env.NODE_ENV = 'production'


let win;

const nativeImage = electron.nativeImage;
let demoIcon = nativeImage.createFromPath(path.join(__dirname, 'guitar.svg'));
function createWindow() {
  win = new BrowserWindow({
    height: 600,
    width: 300,
    icon: demoIcon,
    maxHeight:600,
    maxWidth:300,
    minHeight:600,
    minWidth:300,
    webPreferences: {
      nodeIntegration: true,
    }
  });
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file",
      slashes: true,
    })
  );
  win.on("close", () => {
    win = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
