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
  let result = ipcRenderer.sendSync("saveUrl", url, label)

  console.log(result)
  if(result == true){
    alert('Saved')
    $('#registerLabel').val('')
    $('#registerUrl').val('')
  }else{
    alert("Error")
  }
}

function getUrls(): Object{
  return ipcRenderer.sendSync("getData")
}

function updateConsole(text: string): void{
  $('#consoleArea').val(text)
}

function updateUrlList(){
  let urls: object = getUrls()
  let urlsObjKeys: string[] = Object.keys(urls) 
  let tbody: JQuery = $('#urlList tbody')

  tbody.empty()
  urlsObjKeys.forEach((k: string) => {
    let tr: JQuery = $('<tr class=requestButton>')
    let obj: {url: string, label: string} = (urls as any)[k]
    let url: string = obj.url
    let label: string = obj.label

    tr.append($('<td>').append(label))
    tr.append($('<td>').append(url))
    tbody.append(tr)
  })
}

function reattachEvents(){
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
}

$(document).ready(() => {
  show_hide('#home', true)
  show_hide('#add', false)
  updateUrlList()
  reattachEvents()

  $('#menu_home').on('click', () => {
    show_hide('#home', true)
    show_hide('#add', false)
    updateUrlList()
    reattachEvents()
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
})