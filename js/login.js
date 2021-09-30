//Variables y constantes requeridas para el API de Google signIn

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
 //inicializo api google
    gapi.load('client:auth2', initClient);
    //obtengo el elemento con id Trigger y cuando se le hace click ejecuta la function anonima
    document.getElementById("trigger").addEventListener("click",function(){
      //Obtengo los campos que se llenaron user y password
        var user = document.getElementById("user");
        var password = document.getElementById("password");
        //Hago validaciones que no sean vacios los campos
        if((user.value == "" || password.value == ""))
        {
            alert("Ingrese ambos campos ");
        }else{
            if((user.value.length >= 0 )&&(password.value.length >= 0))
            {
                localStorage.setItem("user",user.value);
                localStorage.setItem("password",password.value);
                //Doy alert de bienvenida y redirijo a index
                alert("Bienvenido "+ user.value);
              
                window.location.replace('index.html');
            }
            
        }});
        //obtengo el elemento con id clickGoogle y cuando se le hace click ejecuta la funcion flecha
      document.getElementById("clickGoogle").addEventListener("click", () => {
              auth2.signIn();
      });
      //en esta funcion inicializo el clientId y el scope
     
        //doy permiso al usuario que se logueo y obtengo su informacion de perfil
      
      
        
        
});

function setSigninStatus() {
  var user = auth2.currentUser.get();
  var isAuthorized = user.hasGrantedScopes('profile');
  if (isAuthorized) {
      
      usuarioG = user;
      let profile = usuarioG.getBasicProfile();
      window.localStorage.setItem('user', profile.getName());
      window.localStorage.setItem('userID', profile.getId());
      window.localStorage.setItem('email', profile.getEmail());
      window.location.replace('index.html');
  }
}



