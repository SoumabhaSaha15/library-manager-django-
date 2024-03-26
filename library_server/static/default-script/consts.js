const THEME_COLORS_NAME = ['--background_color','--foreground_color','--text_color'];
const DARK_MODE =['#191919c0','#000000c0','#ffffff'];
const LIGHT_MODE =['#afafafc0','#bcbcbcc0','#000000'];
const FINE_PER_DAY = 5;
/**
 * 
 * @param {string} text
 * @returns {string} 
 */
const DEFAULT_OPTION = (text='Choose here') => (`<option vlaue="" selected disabled hidden>${text}</option>`);

const GOTO_HOME=()=>{
  window.location.href=window.location.origin;
}
const SAVE_THEME_DARK = () => {
  window.localStorage.setItem('theme','dark');
}
const SAVE_THEME_LIGHT = () => {
  window.localStorage.setItem('theme','light');
}

const  GET_COOKIE=(name)=> {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}
/**
 * @param {Object} object
 * @returns {boolean}
 */
const VALIDATED = (object) => {
  let flag = 0;
  for(let key in object){
    if(object[key]==''||object[key]==null){
      flag = 1
    }
  }
  
  return ((flag==1)?(false):(true));

}

/**
 * bookTabulate
 * @param {Object} object 
 * @returns {string}
 */
function bookTabulate(object){
  let kv = [];
  for(let key in object){
    if(!(typeof(object[key]) == Object))
    kv.push({key:key,value:object[key]});
  }
  let attr = kv.map(item=>`${item.key}="${item.value}"`).join(" ");
  let thead = `
  <thead>
    <tr>
      <th>descriptor</th>
      <th>description</th>
    </tr>
  </thead>`;
  let tbody = kv.map(item => `
  <tr>
    <td>${item.key}</td>
    <td>${item.value}</td>
  </tr>`).join('');
  tbody=`<tbody>${tbody}</tbody>`
  let table = `<table ${attr} >${thead+tbody}</table>`
  return table;
}
/**
 * 
 * @param {CallableFunction} cb 
 */
const ADMIN_AUTHENTICATION = (csrftoken,cb) => {
  fetch('auth-admin',{
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      "X-CSRFToken": csrftoken
    },
    body: JSON.stringify({'password':prompt('enter library password: ')})
  }).then(res=>res.text()).then(data=>{cb(data)}).catch(console.error).finally(()=>{
    // console.log(location.href);
  });
  // 
  // 
} 
/**
 * 
 * @param {string} d1 
 * @param {string} d2
 * @returns {number} 
 */
const DATE_DIFFERENCE = (d1,d2) => {
  try{
    const date1 = new Date(d1)
    const date2 = new Date(d2)
    const differenceInMs = date1 - date2;
    const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
    return differenceInDays;
  }catch(e){
    return 0;
  }
}

// const FETCH_FINE =(FINE_TOTAL,id,csrftoken,cb)=>{
//   console.log(csrftoken,FINE_TOTAL,id);
//   (csrftoken,cb) => {
//     .catch(console.error).finally(()=>{
      
//     });
     
//   }
// }