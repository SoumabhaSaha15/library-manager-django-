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
const getTodayDate = () => {
  var today = new Date();

  // Get the components of the date (year, month, day)
  var year = today.getFullYear();
  var month = today.getMonth() + 1; // Note: JavaScript months are 0-based, so January is 0, February is 1, ..., December is 11
  var day = today.getDate();

  // Format the date as desired (e.g., YYYY-MM-DD)
  var formattedDate = year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;

  return formattedDate;
}

const  FINE = FORM.querySelector('input[readonly][name="fine"]');
const RETURN_DATE = FORM.querySelector('input[readonly][name="return_date"]');
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
  RETURN_DATE.value = getTodayDate();
  let submit = FORM.querySelector('input[type="submit"]');
  let data = {};
  FORM.onsubmit =(e)=>{
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
        if(data.verified){
          data.borrow_data = JSON.parse(data.borrow_data)?.map(item=>({id:item.pk,...item.fields}))[0];
          console.log(data.borrow_data);
          let x=DATE_DIFFERENCE(getTodayDate(),data.borrow_data.return_date);
          if(x<0){
            FINE.value = 'no fine due';
            fetch('fine-submit',{
              method: 'POST',
              headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                "X-CSRFToken": csrftoken
              },
              body: JSON.stringify({password:prompt('enter library password: '),fine:0,id:data.id})
            }).then(res=>res.json()).then(console.table);
          }else{
            FINE.value = 'fine due:' + x*FINE_PER_DAY;
            fetch('fine-submit',{
              method: 'POST',
              headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                "X-CSRFToken": csrftoken
              },
              body: JSON.stringify({password:prompt('enter library password: '),fine:x*FINE_PER_DAY,id:data.id})
            }).then(res=>res.json()).then(console.table);
          }
        }else{
          window.alert('you are not valid');
        }
        
      })
      .catch((err)=>{
        console.error(err);
      });
    }else{
      window.alert('empty submission not allowed');
    }

    
  }

})();