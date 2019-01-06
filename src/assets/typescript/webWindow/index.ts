import $ = require('jquery')
import {ipcRenderer} from 'electron'

import '../../css/index/styles.css'

$(document).ready(() => {
  $('#webArea').append('hoge')

  ipcRenderer.on('sendHtmlSrc', (ev: any, src: string) => {
    console.log(src)
  })
}) 