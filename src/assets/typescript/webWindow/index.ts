import $ = require('jquery')
import {ipcRenderer} from 'electron'

import Editor from './Editor'

import './style.css'

let bodyEditor = new Editor($)

$(document).ready(() => {
  ipcRenderer.on('sendHtmlSrc', (ev: any, src: string) => {
    console.log(src)
  })
}) 