const electron = require('electron');
const {app, BrowserWindow, ipcMain} = electron;
const {distPath} = require('../../dev/path');
const Storage = require('electron-json-storage');

let WebWindowSrc = "";

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

function deleteFromStorage(key, id){
  return new Promise((res, rej) => {
    getFromStorage()
      .then((data) => {
        let dataKeys = Object.keys(data);

        for(var i = 0; i < dataKeys.length; i++){
          if(id == data[i].id){
            data.splice(i, 1);
            break;
          }
          if(i == data.length - 1) rej();
        }

        saveToStorage('data', data)
          .then(() => { res(true); })
          .catch((err) => { rej(err); });
      })
      .catch((err) => {
        rej(err);
      });
  });
}

app.on('ready', () => {
  const Screen = electron.screen;
  const size = Screen.getPrimaryDisplay().size;
  let mainWindow = new BrowserWindow({
    width: size.width,
    height: size.height,
    resizable: true,
    movable: true,
  });

  getFromStorage('data')
    .catch(() => {
      saveToStorage('data', [{"id": 1, "url": "http://hogehoge.com", "label": "dammy"}])
        .catch(() => {
          if(err) process.exit()
        });
    });

  mainWindow.loadURL('file://' + distPath.views('/index/index.html'));

  mainWindow.on('closed', () => { 
    mainWindow = null;
  });

  ipcMain.on('getWebWindowSrc', (ev) => { ev.returnValue = WebWindowSrc });

  ipcMain.on('openWebWindow', (ev, html) => {
    let webWindow = new BrowserWindow({
      width: size.width,
      height: size.height,
      resizable: true,
      movable: true
    });
    
    WebWindowSrc = html;
    webWindow.loadURL('file://' + distPath.views('/webWindow/index.html'));
    webWindow.webContents.send('sendHtmlSrc', 'hoge');
    ev.returnValue = true;
  });

  ipcMain.on('deleteUrl', (ev, id) => {
    deleteFromStorage('data', id)
      .then(() => { ev.returnValue = true; })
      .catch((err) => { ev.returnValue = err; });
  });

  ipcMain.on('saveUrl', (ev, url, label) => {
    let block = {
      "url": url,
      "label": label
    }

    getFromStorage('data')
      .then((data) => {
        let json = data;
        let ids = [];

        for(var i = 0; i < json.length; i++) isNaN(json[i].id) ? pass : ids.push(json[i].id);
        block['id'] = Math.max.apply(null, ids) + 1;
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
