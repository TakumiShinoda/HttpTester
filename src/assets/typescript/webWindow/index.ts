import $ = require('jquery')
import {ipcRenderer} from 'electron'

import Editor from './Editor'

import './style.css'

let bodyEditor = new Editor($, 'editor')

$(document).ready(() => {
  bodyEditor.render()
  
  ipcRenderer.on('sendHtmlSrc', (ev: any, src: string) => {
    bodyEditor.setText(src)
  })
}) 