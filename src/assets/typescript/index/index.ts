import $ = require('jquery')
import {ipcRenderer, nativeImage} from 'electron'

import ConsoleArea from './ConsoleArea'
import Test from './module'

import '../../css/index/styles.css'

const consoleUpperBar = new ConsoleArea($)
const {distPath, srcPath} = require('../../../../dev/path.js')
let StateDeleteMode: boolean = false

function show_hide(ele: string, open: boolean= true): void{
  let element: JQuery<HTMLElement> = $(ele)

  if(open) element.css('display', 'block')
  else element.css('display', 'none')
}

function postUrl(url: string, label: string): boolean{
  let result = ipcRenderer.sendSync("saveUrl", url, label)

  if(result == true){
    return true
  }else{
    alert("Error")
    return false
  }
}

function getUrls(): Object{
  return ipcRenderer.sendSync("getData")
}

function deleteUrl(id: number): boolean{
  if(ipcRenderer.sendSync("deleteUrl", id) == true) return true
  else return false
}

function updateConsole(text: string): void{
  $('#consoleMonitor').text(text)
}

function updateUrlList(): void{
  let urls: object = getUrls()
  let urlsObjKeys: string[] = Object.keys(urls)
  let tbody: JQuery = $('#urlList tbody')

  tbody.empty()
  urlsObjKeys.forEach((k: string) => {
    let obj: {url: string, label: string, id: number} | null = (urls as any)[k]
    let id: number | null = obj != null ? obj.id : null;
    let url: string | null = obj != null ? obj.url : null;
    let label: string | null = obj != null ? obj.label : null
    let deleteBut: JQuery
    let tr: JQuery = $('<tr class=requestButton name=' + id + '>')

    if(id != null  && url != null && label != null) {
      if(StateDeleteMode) deleteBut = $('<input class="btn btn-danger deleteButton" type=button value=Delete style="right: 0;">')
      else deleteBut = $('<input class="btn btn-danger deleteButton" type=button value=Delete style="right: 0;display: none;">')

      tr.append($('<td width=26%>').append(label))
      tr.append($('<td>').append(url))
      tr.append($('<td>').append(deleteBut))
      tbody.append(tr)
    }
  })
}

function reattachEvents(): void{
  $('.requestButton').click((ev: any): void => {
    let lineElements: HTMLCollection = ev.currentTarget.children
    let url: string | null = lineElements[1].textContent

    if(StateDeleteMode){
      let conf = confirm('Are you sure?')
      let selectedId: number = parseInt(ev.currentTarget.attributes.name.textContent)

      if(conf && selectedId != undefined && selectedId != NaN){
        if(deleteUrl(selectedId)){
          updateUrlList()
          reattachEvents()
        }else{
          alert('Failed to delete.')
        }
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

function openHome(){
  show_hide('#home', true)
  show_hide('#add', false)
  updateUrlList()
  reattachEvents()
}

function openAdd(){
  show_hide('#home', false)
  show_hide('#add', true)
  $('#registerLabel').focus()
}

function changeDeleteMode(){
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
}

function registerSubmit(){
  let url: string | number | string[] | undefined = $('#registerUrl').val();
  let label: string | number | string[] | undefined = $('#registerLabel').val();

  if(typeof(url) == 'string' && typeof(label) == 'string' && label != '' && url != ''){
    if(postUrl(url, label)){
      alert('Saved')
      $('#registerLabel').val('')
      $('#registerUrl').val('')
    }else alert('Failed to save.')
  }else{
    alert('Type Url.')
  }
  $('#registerLabel').focus()
}

$(document).ready(() => {
  show_hide('#home', true)
  show_hide('#add', false)
  updateUrlList()
  reattachEvents()
  consoleUpperBar.onReady()

  consoleUpperBar.setHoverEvent()

  $('#menu_home').on('click', () => { openHome() })

  $('#menu_add').on('click', () => { openAdd() })
  
  $('#deleteSwitch').on('click', () => { changeDeleteMode() })

  $('#registerButton').on('click', () => { registerSubmit() })

  $('#registerUrl').keypress((ev: any) => { if(ev.key == "Enter") registerSubmit() })

  $(document).keydown((ev: any) => {
    if(ev.metaKey){
      switch(ev.key){
        case 'ArrowLeft':
          openHome()
          break
        case 'ArrowRight':
          openAdd()
          break
        case 'd':
          changeDeleteMode()
          break
      }
    }
  })
})