require('dotenv').config();
const { app, BrowserWindow, session } = require('electron')
const path = require('path');


function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    webPreferences: {
        preload: path.join(__dirname, 'preload.js')
    }
  })
  win.maximize();
  var filter = {
    urls: ["https://*.whatsapp.com/*"]
  };
  const agent = process.env.USER_AGENT;
  
  session.defaultSession.webRequest.onBeforeSendHeaders(filter, function(details, callback) {
    details.requestHeaders['User-Agent'] = agent;
    callback({cancel: false, requestHeaders: details.requestHeaders});
  });
  win.loadURL('https://web.whatsapp.com/');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

