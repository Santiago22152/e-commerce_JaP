const USERID = "11833756231-vi15u0fik0la47jj7v26md047qlp70ql.apps.googleusercontent.com";

let auth2;
let usuarioG = {};
document.addEventListener("DOMContentLoaded", function(e){
 
    gapi.load('client:auth2', initClient);
  
});
document.getElementById("trigger").addEventListener("click",function(){
  var user = document.getElementById("user");
  var password = document.getElementById("password");
  if((user.value == "" || password.value == ""))
  {
      alert("Ingrese ambos campos ");
  }else{
      if((user.value.length >= 0 )&&(password.value.length >= 0))
      {
          sessionStorage.setItem("user",user.value);
          sessionStorage.setItem("password",password.value);
          alert("Bienvenido "+ user.value);
  
          window.location.replace('index.html');
      }
      
  }});
document.getElementById("clickGoogle").addEventListener("click",async () => {

    
      await  auth2.signIn();
   
    
});
  
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
        let profile = googleUser.getBasicProfile();
        window.sessionStorage.setItem('user', profile.getGivenName());
        window.location.replace('index.html');
    }
  };

  function updateSigninStatus() {
    setSigninStatus();
  };

  function revokeAccess() {
    auth2.disconnect();
  }


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
