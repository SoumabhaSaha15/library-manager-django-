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
 * @param {Object[]} obj
 * @returns {string}
 */
const SECTIONS = window.document.querySelectorAll('body div#root main section[id]');
(function main(){

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
  let submit = FORM.querySelector('input[type="submit"]');
  let data = {};
  FORM.onsubmit=(e)=>{
    e.preventDefault();
    FORM.querySelectorAll('input[name][required]').forEach(item=>{
      data[item.name] = item.value.toUpperCase();
    });
    let csrftoken = GET_COOKIE('csrftoken');

    if(VALIDATED(data)){
      fetch(window.location.pathname, {
        method: 'POST',
        headers: { 'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        "X-CSRFToken": csrftoken },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data=>{
        if(data.verified){
          data.Borrow = JSON.parse(data.Borrow)?.map(item=>({id:item.pk,...item.fields}));
          data.Client = JSON.parse(data.Client)?.map(item=>({id:item.pk,...item.fields}));
          data.Books = JSON.parse(data.Books)?.map(item=>({id:item.pk,...item.fields}));
          let data_arr = [data.Books,data.Borrow,data.Client];
          FORM.style.display = 'none';
          SECTIONS.forEach((item,index)=>{
            item.style.display = 'grid';
            item.innerHTML = data_arr[index].map(bookTabulate).join('');
          });
        }else{

        }
      })
      .catch(console.error);
    }else{
      window.alert('empty submission not allowed');
    }
  }

})();