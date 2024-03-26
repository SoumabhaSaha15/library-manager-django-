"use-strict";
/**
 * @type {HTMLButtonElement}
 */
const THEME_TOGGLER = window.document.querySelector('body div#root header button[toggle_theme]');
/**
 * @type {HTMLElement}
 */
const ROOT = window.document.querySelector(':root');
/**
 * @type {HTMLFormElement}
 */
const FORM = window.document.querySelector('body div#root main form');
/**
 * @type {HTMLInputElement}
 */
const SEARCH_BOOK = document.getElementById('search_book'); 
/**
 * @type {HTMLElement}
 */

const SECTION = document.getElementById('books');
/**
 * @param {Object} 
 * @returns {string}
 */
function tabulate(object){
  let kv = [];
  for(let key in object){
    if(!(typeof(object[key]) == Object))
    kv.push({key:key,value:object[key]});
  }
  let attr = kv.map(item=>`${item.key}="${item.value}"`).join(" ");
  let thead = `<thead>
  <tr><th>key</th><th>value</th></tr>
  </thead>`
  let tbody = kv.map(item => `
  <tr><td>${item.key}</td><td>${item.value}</td></tr>
  `).join('');
  tbody=`<tbody>${tbody}</tbody>`
  let table = `<table ${attr} >${thead+tbody}</table>`
  return table;
}

(function main(){

  // console.log(window.localStorage.getItem('theme'));
  
  THEME_TOGGLER.addEventListener('click',(e)=>{
    if(e.currentTarget.style?.backgroundImage == 'url("./static/icons/moon.svg")'){
      
      e.currentTarget.style.backgroundImage = 'url("./static/icons/sun.svg")';
      THEME_COLORS_NAME.forEach((element,index) => {
        ROOT.style.setProperty(element,DARK_MODE[index]);
      });
      SAVE_THEME_DARK();
    }else if(e.currentTarget.style?.backgroundImage == 'url("./static/icons/sun.svg")'){
      
      e.currentTarget.style.backgroundImage = 'url("./static/icons/moon.svg")';
      THEME_COLORS_NAME.forEach((element,index) => {
        ROOT.style.setProperty(element,LIGHT_MODE[index]);
      });
      SAVE_THEME_LIGHT();
    }
  });

  if(window.localStorage.getItem('theme') =='light'){
    THEME_TOGGLER.click();
  }

  
  let csrftoken = GET_COOKIE('csrftoken');
  fetch(window.location.pathname, {
    method: 'POST',
    headers: { 'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    "X-CSRFToken": csrftoken },
    body: JSON.stringify({query:'all'})
  })
  .then(response => response.json())
  .then(arr=>{
    let books = arr?.map(item=>({id:item.pk,...item.fields}));
    SECTION.innerHTML = books.map(tabulate).join('');
    SEARCH_BOOK.addEventListener('keypress',(e)=>{
      if(e.key == "Enter"){
        let book_name = e.currentTarget.value.toUpperCase();
        SECTION.innerHTML = books.map(item=>(item.book_name.startsWith(book_name))?tabulate(item):('')).join('');
      }
    });
  })
  .catch(console.error);

})();