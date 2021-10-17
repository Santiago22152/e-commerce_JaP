//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

let productInfo;
let commentsList=[];
let relatedProductsList =[];
let productList = [];

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
    getRelatedProduct();
    /*
    new Splide( '.splide',{
        type   : 'loop',
        rewind: true,
        trimSpace: false,
        autoWidth: true,
	perPage: 2,
    perMove: 1,
    gap: 10,

    } ).mount();*/
    const swiper = new Swiper('.swiper', {
        // Optional parameters
        direction: 'horizontal',
        loop: false,
        slidesPerView: 2,
        effect: 'slide',
        centeredSlides: false,
        autoplay: {
            delay: 500,
          },
        // If we need pagination
        pagination: {
          el: '.swiper-pagination',
        },
      
        // Navigation arrows
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      
        // And if we need scrollbar
       
      });
      

    
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
    htmlContentToAppend= ` <div class="carousel-item active"> <img style= " max-width: 100% !important;"
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

    htmlContentToAppend= ` <div class="carousel-item"> <img style= "max-width: 100% !important;"
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
if(productInfo.description.length > 240){
    htmlContentToAppend=` <h5 class="card-title" style="font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif; font-size:2rem;" > ${productInfo.currency +" "+productInfo.cost}</h5>
    <span class="card-subtitle mb-2 text-muted">Vendidos: ${productInfo.soldCount} | Categoría: ${productInfo.category}</span>
    <p class="card-text"><b>Descripción</b>:<br> ${productInfo.description.slice(0,240)} ...</p>
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter"> Leer más</button>
    
    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle"><b>${productInfo.name}</b></h5>
          
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          
        </div>
        
        <div class="modal-body">
        <b>Descripción:</b> <br>

          ${productInfo.description}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          
        </div>
      </div>
    </div>
  </div>
  `
    
}else{
    htmlContentToAppend=` <h5 class="card-title" style="font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif; font-size:2rem;" > ${productInfo.currency + productInfo.cost}</h5>
    <span class="card-subtitle mb-2 text-muted">Vendidos: ${productInfo.soldCount} | Categoría: ${productInfo.category}</span>
    <p class="card-text"><b>Descripción</b>:<br> ${productInfo.description}</p>`
}
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
   
   comentario.user=localStorage.getItem("user");
   comentario.description= document.getElementById("comment-box").value;
   commentsList.unshift(comentario);
  orderAndShowComments();
  console.log(commentsList);
    
    
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

//funcion que ordena los comentarios por fecha y los muestra
function orderAndShowComments(){
    result = commentsList.sort(function(a, b) {
        aDate= new Date(a.dateTime);
        bDate= new Date(b.dateTime);
        
        if ( aDate > bDate ){ return 1; }
        if ( aDate < bDate ){ return -1; }
        return 0;
    });
    commentsList = result;
    let htmlContentToAppend="";
    for (let index = (commentsList.length - 1); index >= 0; index--) {
        const element = commentsList[index];
        htmlContentToAppend=`<li  class="media">
                                
        <div class="media-body" id= "comment-${index}">
          
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
    if(index == (commentsList.length-1)){
        document.getElementById("comments").innerHTML = htmlContentToAppend;
    showStars(index,element.score);
    
    }else{
        document.getElementById("comments").innerHTML += htmlContentToAppend;
        showStars(index,element.score);
    }
    
    
        

        
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

function getRelatedProduct(){
    getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
          productList = resultObj.data;
          
          for (let index = 0; index < productInfo.relatedProducts.length; index++) {
            let relatedProductIndex = productInfo.relatedProducts[index];
            
           relatedProductsList.push(productList[relatedProductIndex]);
        }
        showRelatedProducts();
        }
       
       
    });
}
function showRelatedProducts(){
   
    let htmlContentToAppend = ``;
    for (let index = 0; index < relatedProductsList.length; index++) {
        let relatedProduct = relatedProductsList[index];
       
       if (relatedProduct.description.length > 100) {
        htmlContentToAppend=` 
        <div class="swiper-slide">
      <div class="card ">
      <img class="card-img-top" src="${relatedProduct.imgSrc}">
          <div class="card-body pt-0 px-0">
          <div class= "text-center">
              <h5 > <b>${relatedProduct.name}</b></h5> </div>
          
              <div class="d-flex flex-row justify-content-between mb-0 px-3"> 
              
              <b>Price: </b>
              
                  <h6>&dollar; ${relatedProduct.cost}</h6>
              </div>
              <hr class="mt-2 mx-3">
              <div class="d-flex flex-row justify-content-between px-3 pb-4">
                  <div class="d-flex flex-column"><span class="text-muted">Vendidos: ${relatedProduct.soldCount}</span></div>
                  <div class="d-flex flex-column">
                      <span class="mb-0 text-muted" >Categoría: Autos</span><small class="text-muted text-right"></small>
                  </div>
              </div>
              <div class="d-flex flex-row justify-content-between p-3 mid">
              ${relatedProduct.description.slice(0,100)} ...
              </div> 
              <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#relatedModal"> Leer más</button> 
          </div>
      </div>
      </div>
      
    
    <div class="modal fade" id="relatedModal" tabindex="-1" role="dialog" aria-labelledby="relatedModalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle"><b>${relatedProduct.name}</b></h5>
          
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          
        </div>
        
        <div class="modal-body">
        <b>Descripción:</b> <br>

          ${relatedProduct.description}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          
        </div>
      </div>
    </div>
  </div>
      
    `;
     
       }else{
        htmlContentToAppend=` 
        <div class="swiper-slide">
      <div class="card ">
      <img class="card-img-top" src="${relatedProduct.imgSrc}">
          <div class="card-body pt-0 px-0">
          <div class= "text-center">
              <h5 > <b>${relatedProduct.name}</b></h5> </div>
          
              <div class="d-flex flex-row justify-content-between mb-0 px-3"> 
              
              <b>Price: </b>
              
                  <h6>&dollar; ${relatedProduct.cost}</h6>
              </div>
              <hr class="mt-2 mx-3">
              <div class="d-flex flex-row justify-content-between px-3 pb-4">
                  <div class="d-flex flex-column"><span class="text-muted">Vendidos: ${relatedProduct.soldCount}</span></div>
                  <div class="d-flex flex-column">
                      <span class="mb-0 text-muted" >Categoría: Autos</span><small class="text-muted text-right"></small>
                  </div>
              </div>
              <div class="d-flex flex-row justify-content-between p-3 mid">
              ${relatedProduct.description}
              </div> 
              
          </div>
      </div>
      </div>`
       }
          

        
       
        document.getElementById("relatedProd").innerHTML+= htmlContentToAppend;
    }
}
  