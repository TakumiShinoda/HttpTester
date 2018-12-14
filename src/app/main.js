const electron = require('electron');
const {app, BrowserWindow, ipcMain} = electron;
const {distPath} = require('../../dev/path');
const Storage = require('electron-json-storage');

function getFromStorage(key){
  return new Promise((res, rej) => {
    Storage.get('data', (err, data) => {
      if(err){
        rej(err);
      }
      else{
        res(data);
      } 
    });
  })
}

app.on('ready', () => {
  const Screen = electron.screen;
  const size = Screen.getPrimaryDisplay().size;
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

        console.log(typeof(data));

        json.push(block);
        console.log(data);
        Storage.set('data', json, (err) => {
          if(err) console.log("Save Error: ", err);
          else console.log("saved");
        });
      })
      .catch((err) => {
        console.log("hoge");
      }) 
  });

  ipcMain.on('getData', (ev) => {
    getFromStorage('data')
      .then((data) => {
        ev.returnValue = data;
      })
      .catch((err) => {
        ev.returnValue = err;
      })
  })
});
