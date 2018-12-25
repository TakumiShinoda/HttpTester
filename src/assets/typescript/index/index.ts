import $ = require('jquery')
import {ipcRenderer} from 'electron'

import Test from './module'

import '../../css/index/styles.css'
import { STATUS_CODES } from 'http';

const {distPath, srcPath} = require('../../../../dev/path.js')
let StateDeleteMode: boolean = false

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
    let deleteBut: JQuery
    let tr: JQuery = $('<tr class=requestButton>')
    let obj: {url: string, label: string} = (urls as any)[k]
    let url: string = obj.url
    let label: string = obj.label

    if(StateDeleteMode) deleteBut = $('<input class="btn btn-danger deleteButton" type=button value=Delete style="right: 0;">')
    else deleteBut = $('<input class="btn btn-danger deleteButton" type=button value=Delete style="right: 0;display: none;">')

    tr.append($('<td width=26%>').append(label))
    tr.append($('<td>').append(url))
    tr.append($('<td>').append(deleteBut))
    tbody.append(tr)
  })
}

function reattachEvents(){
  $('.requestButton').click((ev: any) => {
    let lineElements: HTMLCollection = ev.currentTarget.children
    let url: string | null = lineElements[1].textContent

    if(StateDeleteMode){
      let conf = confirm('Are you sure?')

      if(conf){
        console.log('delete')
      }else{
        console.log('cancel')
      }
    }else{
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

  $('#deleteSwitch').on('click', () => {
    let switchElement: JQuery = $('#deleteSwitch')
    let deleteButtonElements = $('.deleteButton')

    if(StateDeleteMode){
      deleteButtonElements.css('display', 'none')
      switchElement.text('-')
    }else{
      deleteButtonElements.css('display', 'block')
      switchElement.text('x')
    }
    StateDeleteMode = !StateDeleteMode
  })
})