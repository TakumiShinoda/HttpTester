import $ = require('jquery')

import Test from './module'

import '../../css/index/styles.css'

const {distPath, srcPath} = require('../../../../dev/path.js')

function show_hide(ele: string, open: boolean= true){
  let element: JQuery<HTMLElement> = $(ele);

  if(open) element.css('display', 'block');
  else element.css('display', 'none');
}

$(document).ready(() => {
  show_hide('#home', true);
  show_hide('#add', false);

  $('#menu_home').on('click', () => {
    show_hide('#home', true);
    show_hide('#add', false);
  });

  $('#menu_add').on('click', () => {
    show_hide('#home', false);
    show_hide('#add', true);
  });
});