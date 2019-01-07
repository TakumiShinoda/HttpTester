import Ace = require('ace-builds')

import '../../../../node_modules/ace-builds/src-min-noconflict/theme-monokai'
import '../../../../node_modules/ace-builds/src-min-noconflict/mode-html'
import '../../../../node_modules/ace-builds/src-min-noconflict/ext-language_tools'

export default class Editor{
  $: JQueryStatic
  Editor: any
  Selector: string
  Text: string

  constructor(_$: JQueryStatic, _Selector: string, _Text: string = ''){
    this.$ = _$
    this.Selector = _Selector
    this.Text = _Text
    this.Editor = null
  }

  setText(_Text: string){ this.Editor.setValue(_Text) }

  render(){
    this.Editor = Ace.edit('editor')

    this.Editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    })
    this.Editor.setTheme("ace/theme/monokai");
    this.Editor.getSession().setMode("ace/mode/html");
  }
}