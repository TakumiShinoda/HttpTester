const electron = require('electron');
const {app, BrowserWindow, ipcMain} = electron;
const {distPath} = require('../../dev/path');
const Storage = require('electron-json-storage');

function getFromStorage(key){
  return new Promise((res, rej) => {
    Storage.get('data', (err, data) => {
      if(err || Object.keys(data).length == 0){
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

  getFromStorage('data')
    .then(() => {
      console.log("hoge");
    })
    .catch(() => {
      Storage.set('data', [{"dammy": "http://hogehoge.com"}], (err) => {
        if(err) process.exit();
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
        Storage.set('data', json, (err) => {
          if(err){
            ev.returnValue = err;
          }
          else{
            ev.returnValue = true;
          }
        });
      })
      .catch((err) => {
        ev.returnValue = err;
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
