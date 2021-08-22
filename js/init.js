const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";
const USERID = "11833756231-vi15u0fik0la47jj7v26md047qlp70ql.apps.googleusercontent.com";
let auth2;
let usuarioG = {};
var showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

var getJSONData = function(url){
    var result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}



  if((( window.location.pathname.substring((window.location.pathname.lastIndexOf('/'))+1) != 'login.html') &&
     (sessionStorage.getItem("user") == undefined)  ))
{
    window.location.replace('login.html');
}
// Work in progress

  

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
  function initClient() {
    gapi.client.init({
      'clientId': USERID,
      'scope': 'profile'
    }).then(function () {
      auth2 = gapi.auth2.getAuthInstance();
  
      // Listen for sign-in state changes.
      auth2.isSignedIn.listen(updateSigninStatus);
  
      // Handle initial sign-in state. (Determine if user is already signed in.)
      var user = auth2.currentUser.get();
      setSigninStatus();
    });
  }
  function setSigninStatus() {
    var user = auth2.currentUser.get();
    var isAuthorized = user.hasGrantedScopes('profile');
    if (isAuthorized) {
        
        usuarioG = user;
        let profile = usuarioG.getBasicProfile();
        window.sessionStorage.setItem('user', profile.getName());
        window.sessionStorage.setItem('userID', profile.getId());
        window.sessionStorage.setItem('email', profile.getEmail());
        window.location.replace('index.html');
    }
  };
  function updateSigninStatus() {
    setSigninStatus();
  };
  function signOut(){
    gapi.load('client:auth2', initClient);
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out');
    });
    window.sessionStorage.clear();
    location.reload();
  }
  document.getElementById("logout").addEventListener("click",  signOut());
});