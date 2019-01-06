import { ipcRenderer } from "electron";

export default class ConsoleArea{
  $: JQueryStatic
  Parent: JQuery
  UpperBar: JQuery
  Monitor: JQuery
  Buttons: JQuery

  static Selector: string = '#consoleArea'
  static ChildSelector: {upperBar: string, buttons: string, monitor: string} = { 
    upperBar: '#consoleUpperBar',
    buttons: '.consoleUpperBarButtons',
    monitor: '#consoleMonitor'
  }

  constructor(_$: JQueryStatic){
    this.$ = _$
    this.Buttons = $('document')
    this.Parent = $('document')
    this.UpperBar = $('document')
    this.Monitor = $('document')
  } 

  onReady(){
    this.Parent = this.$(ConsoleArea.Selector)
    this.Buttons = this.$(ConsoleArea.ChildSelector.buttons)
    this.UpperBar = this.$(ConsoleArea.ChildSelector.upperBar)
    this.Monitor = this.$(ConsoleArea.ChildSelector.monitor)

    $(ConsoleArea.Selector).hover(
      (ev: any) => {
        this.Monitor.css({'padding-top': '30px'})
        this.UpperBar.css({'transition': '0.8s', 'opacity': '1'})
        this.Buttons.css({'transition': '0.8s', 'opacity': '1'})
      },
      (ev: any) => {
        this.Monitor.css({'padding-top': '0px'})
        this.UpperBar.css({'transition': '0.8s', 'opacity': '0'})
        this.Buttons.css({'transition': '0.8s', 'opacity': '0'})
      }
    )

    $(this.Buttons).click((ev: any) => {
      ipcRenderer.sendSync('openWebWindow', 'hoge')
    })
  }
}