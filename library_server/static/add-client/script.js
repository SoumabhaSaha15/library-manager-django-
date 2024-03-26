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
      .then((data)=>{
        let field = FORM.querySelector('input[readonly][name="id"]');
        field.value = 'your client id:-'+data.id;
        field.style.color = 'green';
        window.setTimeout(()=>{
          field.style.color = 'var(--text_color)';
        },1000);
      })
      .catch((err)=>{
        console.error(err);
        let field = FORM.querySelector('input[readonly][name="id"]');
        field.value = err.message;
        field.style.color = 'red';
        window.setTimeout(()=>{
          field.style.color = 'var(--text_color)';
        },1000);
      });
    }else{
      window.alert('empty submission not allowed');
    }

    
  }

})();