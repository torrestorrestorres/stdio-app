const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // Ensure contextIsolation is enabled

      // Enable node integration in the renderer process
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


ipcMain.on('saveQR', (event, qrCodeImage) => {
  dialog.showSaveDialog({
    title: 'Save QR Code',
    defaultPath: 'qr-code.png',
    filters: [
      { name: 'Images', extensions: ['png'] }
    ]
  }).then(result => {
    if (!result.canceled) {
      fs.writeFile(result.filePath, qrCodeImage.split(',')[1], 'base64', (err) => {
        if (err) {
          console.log('Error saving file:', err);
        } else {
          event.sender.send('saveQR-success', 'The file has been successfully saved');
        }
      });
    } else {
      console.log('No file selected');
    }
  }).catch(err => {
    console.error(err);
  });
});