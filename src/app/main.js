const electron = require('electron');
const {app, BrowserWindow, ipcMain} = electron;
const {distPath} = require('../../dev/path');
const Storage = require('electron-json-storage');

function getFromStorage(key){
  return new Promise((res, rej) => {
    Storage.get('data', (err, data) => {
      if(err || Object.keys(data).length == 0) rej(err);
      else res(data);
    });
  })
}

function saveToStorage(key, json){
  return new Promise((res, rej) => {
    Storage.set(key, json, (err) => {
      if(err) rej(err);
      else res();
    })
  });
}

app.on('ready', () => {
  const Screen = electron.screen;
  const size = Screen.getPrimaryDisplay().size;

  getFromStorage('data')
    .catch(() => {
      saveToStorage('data', [{"url": "http://hogehoge.com", "label": "dammy"}])
        .catch(() => {
          if(err) process.exit()
        });
    });

  mainWindow = new BrowserWindow({
    width: size.width,
    height: size.height,
    resizable: true,
    movable: true,
  });

  mainWindow.loadURL('file://' + distPath.views('/index/index.html'));

  mainWindow.on('closed', () => { 
    mainWindow = null;
  });

  ipcMain.on('saveUrl', (ev, url, label) => {
    let block = {
      "url": url,
      "label": label
    }

    getFromStorage('data')
      .then((data) => {
        let json = data;

        json.push(block);
        saveToStorage('data', json)
          .then(() => { ev.returnValue = true })
          .catch((err) => { ev.returnValue = err });
      })
      .catch((err) => {
        ev.returnValue = err;
      });
  });

  ipcMain.on('getData', (ev) => {
    getFromStorage('data')
      .then((data) => { ev.returnValue = data })
      .catch((err) => { ev.returnValue = err });
  });
});
