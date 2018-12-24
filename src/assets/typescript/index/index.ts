import $ = require('jquery')
import {ipcRenderer} from 'electron'

import Test from './module'

import '../../css/index/styles.css'

const {distPath, srcPath} = require('../../../../dev/path.js')

function show_hide(ele: string, open: boolean= true): void{
  let element: JQuery<HTMLElement> = $(ele)

  if(open) element.css('display', 'block')
  else element.css('display', 'none')
}

function postUrl(url: string, label: string): void{
  ipcRenderer.send("saveUrl", url, label)
}

function getUrls(): Object{
  return ipcRenderer.sendSync("getData")[0]
}

function updateConsole(text: string){
  $('#consoleArea').val(text);
}

$(document).ready(() => {
  show_hide('#home', true)
  show_hide('#add', false)
  updateConsole('hoge')

  $('#menu_home').on('click', () => {
    show_hide('#home', true)
    show_hide('#add', false)
  })

  $('#menu_add').on('click', () => {
    show_hide('#home', false)
    show_hide('#add', true)
  })

  $('#registerButton').on('click', () => {
    let url: string | number | string[] | undefined = $('#registerUrl').val();
    let label: string | number | string[] | undefined = $('#registerLabel').val();

    if(typeof(url) == 'string' && typeof(label) == 'string' && label != '' && url != ''){
      postUrl(url, label)
    }else{
      alert('Type Url')
    }
  })

  $('.requestButton').click((ev: any) => {
    let lineElements: HTMLCollection = ev.currentTarget.children
    let url: string | null = lineElements[1].textContent

    if(url != null){
      fetch(url)
        .then((data: any) => data.text())
        .then((text: any) => {
          updateConsole(text)
        })
        .catch((err: any) => {
          alert("Failed to access.")
        })
    }else{
      alert("Failed to access.")
    }
  })
})