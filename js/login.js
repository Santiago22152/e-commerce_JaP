

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
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
                alert("Bienvenido "+user.value);
        
                window.location.href = "../index.html";
            }
            
        }});
 
  
});