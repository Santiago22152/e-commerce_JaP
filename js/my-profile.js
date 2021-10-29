//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.


function getinfo(){
    let userPersonalInfo = {};
    let preview = document.getElementById("imguser");
    
    userPersonalInfo.names= document.getElementById("names").value;
    userPersonalInfo.lastname=document.getElementById("lastname").value;
    userPersonalInfo.age=document.getElementById("age").value;
    userPersonalInfo.email=document.getElementById("email").value;
    userPersonalInfo.cellNumber=document.getElementById("cellNumber").value;
    userPersonalInfo.img = preview.src;
    localStorage.setItem("userData", JSON.stringify(userPersonalInfo));
}

function setInfo(){
        userPersonalInfo = JSON.parse(localStorage.getItem("userData"));
        document.getElementById("names").value = userPersonalInfo.names;
        document.getElementById("lastname").value = userPersonalInfo.lastname;
        document.getElementById("age").value =userPersonalInfo.age;
        document.getElementById("email").value = userPersonalInfo.email;
        document.getElementById("cellNumber").value = userPersonalInfo.cellNumber;
        document.getElementById("imguser").src=userPersonalInfo.img;
    
}

document.addEventListener("DOMContentLoaded", function (e) {

setInfo();
});


function previewFile(){
    let preview = document.getElementById("imguser");
    let file = document.getElementById("imginput").files[0];

    let reader = new FileReader();

    if (file) {
        reader.readAsDataURL(file);
    }else{
        preview.src = "img/avatar.png";
    }
    reader.onloadend = function (){
        preview.src = reader.result;

    }
}

