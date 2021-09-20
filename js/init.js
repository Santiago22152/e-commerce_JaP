const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";
//Muestro spineer 
var showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}
//Oculto Spinner 
var hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}
//funcion para procesar mediante fetch un JSON
//Cargo la información en el campo data de la variable result
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
//Checkeo que este logueado y si no redirijo a login para hacerlo 
if((( window.location.pathname.substring((window.location.pathname.lastIndexOf('/'))+1) != 'login.html') 
&&
   (localStorage.getItem("user") == undefined)  ))
{
  window.location.replace('login.html');
}



//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
  showUser();
});
//funcion para mostrar usuario almacenado en el localStorage 
function showUser(){
  let user = localStorage.getItem("user")
  document.getElementById("profile").innerHTML+= user;
}