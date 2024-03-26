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
const getTomorrowsDate = () => {
  var today = new Date();

  // Add one day to the current date
  today.setDate(today.getDate() + 1);

  // Get the components of the date (year, month, day) for tomorrow
  var year = today.getFullYear();
  var month = today.getMonth() + 1; // Note: JavaScript months are 0-based, so January is 0, February is 1, ..., December is 11
  var day = today.getDate();

  // Format the date as desired (e.g., YYYY-MM-DD)
  var formattedDate = year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;

  return formattedDate; // Output: e.g., "2024-02-15"
}
// const SECTION = document.getElementById('books');
const FORM = window.document.querySelector('body div#root main form');
const SELECTION = window.document.querySelector('body div#root main form select');
(function main() {
  "use-strict";
  // console.log(window.localStorage.getItem('theme'));

  let csrftoken = GET_COOKIE('csrftoken');
  
  let [today, nextday] = FORM.querySelectorAll('input[type="date"]');
  today.value = getTodayDate();
  nextday.min  = getTomorrowsDate();

  THEME_TOGGLER.addEventListener('click', (e) => {
    if (e.currentTarget.style?.backgroundImage == 'url("./static/icons/moon.svg")') {

      e.currentTarget.style.backgroundImage = 'url("./static/icons/sun.svg")';
      THEME_COLORS_NAME.forEach((element, index) => {
        ROOT.style.setProperty(element, DARK_MODE[index]);
      });
      SAVE_THEME_DARK();
    } else if (e.currentTarget.style?.backgroundImage == 'url("./static/icons/sun.svg")') {

      e.currentTarget.style.backgroundImage = 'url("./static/icons/moon.svg")';
      THEME_COLORS_NAME.forEach((element, index) => {
        ROOT.style.setProperty(element, LIGHT_MODE[index]);
      });
      SAVE_THEME_LIGHT();
    }
  });

  if (window.localStorage.getItem('theme') == 'light') {
    THEME_TOGGLER.click();
  }


  fetch('/search-book', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      "X-CSRFToken": csrftoken
    },
    body: JSON.stringify({ query: 'borrowable' })
  })
  .then(response => response.json())
  .then(arr => {
      let books = arr?.map(item => ({ id: item.pk, ...item.fields }));
      SELECTION.innerHTML =`${DEFAULT_OPTION('choose book here')}
      ${books.map(item=>('<option value ="'+item.book_name+'">'+item.book_name+'</option>')).join('')}`
      window.localStorage.setItem('books',JSON.stringify(books));
  })
  .catch(console.error);

  const submit = FORM.querySelector('input[type="submit"]');
  const book_id = FORM.querySelector('input[name="book_id"]');
  const id = FORM.querySelector('input[name="id"][readonly]');
  const book_data = JSON.parse(window.localStorage.getItem('books'))||'';


  SELECTION.oninput= (e) =>{
    let book_id_number = book_data?.map((item)=>((item.book_name==SELECTION.value)?(parseInt(item.id)):(''))).join('');
    book_id.value = parseInt(book_id_number);
  } 

  let data = {};
  FORM.onsubmit = (e) => {
    e.preventDefault();
    FORM.querySelectorAll('input[name][required]').forEach(item => {
      data[item.name] = item.value.toUpperCase();
    });

    submit.setAttribute('disabled','');

    if (VALIDATED(data)) {
      fetch(window.location.pathname, {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data=>{
          console.log(data);
          if(data.is_client == true){
            if(data?.error=='book copy is no longer available'){
              id.value = (data?.id||data?.error)||'err';
              id.style.color = 'red';
            }else{
              id.value = 'your borrow id:- ' + data?.id||"err";
              id.style.color = 'green';
            }
          }else{
            id.value = data.error;
            id.style.color = 'red';
          }
          
          window.setTimeout(()=>{
            id.style.color = 'var(--text_color)';
            submit.removeAttribute('disabled');
          },10000);


        })
        .catch(console.error);
    } else {
      window.alert('empty submission not allowed');
      submit.removeAttribute('disabled');
    }
  }

})();