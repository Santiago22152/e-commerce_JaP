//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

let productInfo;
let commentsList=[];
let commentCounter=0;
//Obtengo datos de las API
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCT_INFO_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
           productInfo= resultObj.data;
           showProductsInfo();
        }
    });
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
           commentsList= resultObj.data;
            orderAndShowComments();
        }
    });
    addComment();
});
//funcion que muestra productos
function showProductsInfo(){
    //variable donde guardar el contenido de cada producto
        let htmlContentToAppend = "";
     
                htmlContentToAppend = `
                <h2>${productInfo.name}</h2>
                `
        console.log(productInfo.images[0]);
    //Obtengo elemento donde insertar el html del producto, y lo inserto.
            document.getElementById("title").innerHTML += htmlContentToAppend;
//loop para cargar las imagenes en el carousel
for (let index = 0; index < productInfo.images.length; index++) {
  
if (index == 0) {
    htmlContentToAppend= ` <div class="carousel-item active"> <img
            src="${productInfo.images[index]}"
            alt="imgProd${index}"> </div>`
            
            document.getElementById("carouselIMG").innerHTML += htmlContentToAppend;

            htmlContentToAppend=`<li class="list-inline-item active"> <a id="carousel-selector-${index}" class="selected" data-slide-to="${index}"
            data-target="#custCarousel"> <img
              src="${productInfo.images[index]}"
              class="img-fluid"> </a> </li>`
              document.getElementById("thumb").innerHTML += htmlContentToAppend;

}
else{

    htmlContentToAppend= ` <div class="carousel-item"> <img
    src="${productInfo.images[index]}"
    alt="imgProd${index}"> </div>`
    
    document.getElementById("carouselIMG").innerHTML += htmlContentToAppend;

    htmlContentToAppend=`<li class="list-inline-item"> <a id="carousel-selector-${index}" class="selected" data-slide-to="${index}"
    data-target="#custCarousel"> <img
      src="${productInfo.images[index]}"
      class="img-fluid"> </a> </li>`
      document.getElementById("thumb").innerHTML += htmlContentToAppend;
}
    
    
}
//hmtl a ingresar en la carta de descripcion del producto
htmlContentToAppend=` <h5 class="card-title" style="font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif; font-size:2rem;" > ${productInfo.currency + productInfo.cost}</h5>
<span class="card-subtitle mb-2 text-muted">Vendidos: ${productInfo.soldCount} | Categoría: ${productInfo.category}</span>
<p class="card-text"><b>Descripción</b>:<br> ${productInfo.description}</p>`
document.getElementById("cardInfo").innerHTML += htmlContentToAppend;
            
}
    //funcion para que el usuario agregue un comentario
function addComment(){

    
    let estrellas = document.querySelectorAll('.fa-star');
        let puntuacion = undefined;//global
       let comentario = {};
        document.getElementById('stars').addEventListener('click', evento =>{
            let objeto = evento.target;
            if (objeto.getAttribute('data-value') != null) {
                puntuacion = objeto.getAttribute('data-value');
            
                for (let i = 0; i < puntuacion; i++) {
                    estrellas[i].classList.replace('far', 'fas');
                }
                for (let i = puntuacion; i < 5; i++) {
                    estrellas[i].classList.replace('fas', 'far');
                }
            }
            comentario.score=puntuacion;
           
        });
        
        //un escucha que detecta al presionar el boton de "opinar" y carga el comentario del usuario
document.getElementById('send-comm').addEventListener('click', send =>{
    comentario.dateTime = formatDate(new Date);
   commentsList.unshift(comentario);
   //console.log(commentsList);
   comentario.user=localStorage.getItem("user");
   comentario.description= document.getElementById("comment-box").value;
    showComment();
    
    //reseteo los controles graficos de cargar un comentario
    for (let i = 0; i < 5; i++) {
        estrellas[i].classList.replace('fas', 'far');
    }

    document.getElementById("comment-box").value="";
    //reseteo la variable de de comentario
comentario={
    user:"",
    dateTime:"",
    description:"",
    score:""
}
})

        
}
//funcion que muestra el primer comentario
function showComment(){
    let htmlContentToAppend="";
        let comm = commentsList[0];
        htmlContentToAppend=`<li id="comment-${commentCounter}" class="media">
                                
        <div class="media-body">
          
            <span class="text-muted pull-right">
                <small class="text-muted">${comm.dateTime} |</small>
                <strong class="text-success">${comm.user}</strong>
                <div>
                  <i class="far fa-star checked"></i>
                  <i class="far fa-star checked"></i>
                  <i class="far fa-star checked"></i>
                  <i class="far fa-star checked"></i>
                  <i class="far fa-star checked"></i>
                </div>
                
            </span>
           
            
            <p>
                ${comm.description}
            </p>
        </div>
    </li>`;
    document.getElementById("comments").innerHTML += htmlContentToAppend;
    showStars(commentCounter,comm.score);
    commentCounter++;

}
//funcion que ordena los comentarios por fecha y los muestra
function orderAndShowComments(){
    result = commentsList.sort(function(a, b) {
        aDate= new Date(a.dateTime);
        bDate= new Date(b.dateTime);
        
        if ( aDate > bDate ){ return -1; }
        if ( aDate < bDate ){ return 1; }
        return 0;
    });
    commentsList = result;
    let htmlContentToAppend="";
    for (let index = 0; index < commentsList.length; index++) {
        const element = commentsList[index];
        htmlContentToAppend=`<li id="comment-${index}" class="media">
                                
        <div class="media-body">
          
            <span class="text-muted pull-right">
                <small class="text-muted">${element.dateTime} |</small>
                <strong class="text-success">${element.user}</strong>
                <div>
                  <i class="far fa-star checked"></i>
                  <i class="far fa-star checked"></i>
                  <i class="far fa-star checked"></i>
                  <i class="far fa-star checked"></i>
                  <i class="far fa-star checked"></i>
                </div>
                
            </span>
           
            
            <p>
                ${element.description}
            </p>
        </div>
    </li>`;
    document.getElementById("comments").innerHTML += htmlContentToAppend;
    showStars(index,element.score);
    commentCounter++;
    
        

        
    }
}
//funcion que da formato a fecha 
function formatDate(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}
//funcion que dada un indice de comentario, y una puntuacion muestra las estrellas correspondientes.
function showStars(commentIndex, commentScore){
    let commentID = "comment-" + commentIndex;
    let estrellas =document.getElementById(commentID).querySelectorAll('.fa-star'); 
    let puntuacion = commentScore;
            for (let i = 0; i < puntuacion; i++) {
                estrellas[i].classList.replace('far', 'fas');
            }
            for (let i = puntuacion; i < 5; i++) {
                estrellas[i].classList.replace('fas', 'far');
            }
}