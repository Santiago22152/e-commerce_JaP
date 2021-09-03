
//Constantes y variables.
const ORDER_ASC_BY_PRICE = "19";
const ORDER_DESC_BY_PRICE = "91";
const ORDER_BY_PROD_SOLDCOUNT = "Relev.";
var currentProductsArray = [];
var currentSortCriteria = undefined;
var minCount = undefined;
var maxCount = undefined;


//Función que ordena un Array en base  a  un criterio
function sortProducts(criteria, array){
    //Variable donde se almacenaran los resultados ordenados
    let result = [];
    //caso que se elija ordenar ascendentemente por precio
    if (criteria === ORDER_ASC_BY_PRICE)
    {//con la funcion sort filtra de a parejas el array de manera que va guardando ordenadamente en la variable result
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
        //caso que se elija ordenar descendentemente por precio
    }else if (criteria === ORDER_DESC_BY_PRICE){
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
        //caso que se elija ordenar descendentemente por relevancia
    }else if (criteria === ORDER_BY_PROD_SOLDCOUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}




//Función que muestra en el HTML la lista de productos
function showProductsList(){
//variable donde guardar el contenido de cada producto
    let htmlContentToAppend = "";
    //loop para procesar toda la lista de productos
    for(let i = 0; i < currentProductsArray.length; i++){
        let product = currentProductsArray[i];
// if que se dedica a sortear por rango determinado de precios.
        if (((minCount == undefined) || (minCount != undefined && parseInt(product.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(product.cost) <= maxCount))){

            htmlContentToAppend += `
            <a href="product-info.html" class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-3">
                        <img src="` + product.imgSrc + `" alt="` + product.description + `" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">`+ product.name +`</h4>
                        </div>
                        <p class="mb-1">` + product.description + `</p>
                       <span class="price-tag-amount" aria-hidden="true">
                        <span class="price-tag-symbol">${product.currency} </span>
                        <span >${product.cost}</span>
                        </span>
                    </div>
                </div>
            </a>
            `
        }
//Obtengo elemento donde insertar el html del producto, y lo inserto.
        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
    }
}


//Función que invoca showProductsList y la ordena.
function sortAndShowProducts(sortCriteria, productsArray){
    currentSortCriteria = sortCriteria;
//en el caso de que el arreglo de productos esté definido setea ese como el actual
//en caso de que no esté definido simplemente ordena el que ya esta almacenado en la variable global
    if(productsArray != undefined){
        currentProductsArray = productsArray;
    }

    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    showProductsList();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    //llamo a funcion para procesar el link products_URL y obtener la informacion del JSON
    getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            //en caso de haber procesado y obtenido la informacion del JSON llamo a sortandShowProducts
            //Y lo ordeno por precio ascendente
            sortAndShowProducts(ORDER_ASC_BY_PRICE, resultObj.data);
        }
    });
//en casod eque se clickee la el boton de filtrado ascendente se llama a sortAndShowProducts
//solo con un parametro
    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_BY_PRICE);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_PRICE);
    });

    document.getElementById("sortByCount").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_PROD_SOLDCOUNT);
    });
//Limpia filtros de rango de precio y muestra listado
    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showProductsList();
    });
//obtengo el rango de precios para filtrar y muestro listado en ese rango de precio
    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        }
        else{
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        }
        else{
            maxCount = undefined;
        }

        showProductsList();
    });
    
});

//funcion para filtrar por nombre y descripción
function filterFunction() {
    var input, inputUpp,mainTags ,aTags, h4Tags, i, pTags, txtValue, txt2Value;
    //variable input que es el elemnto donde el usuario  escribio lo que  desea buscar
    input = document.getElementById("userInput");
    //paso el valor de input a mayus.
    inputUpp = input.value.toUpperCase();
    //obtengo los tags main del html product
    mainTags= document.getElementsByTagName("main");
    //obtengo los aTags del elemento mainTags
    //ya que  ahi se encuentra la info de cada producto que se muestra
    aTags = mainTags[0].getElementsByTagName("a");
   //Loop para buscar en cada elemento
    for (i = 0; i < aTags.length; i++) {
        //itero en los tags h4 ya que  aqui se encuentra el nombre del producto
        h4Tags = aTags[i].getElementsByTagName("h4");
        //itero con los p tags ya que aqui se encuentra la descripcion del producto
        pTags = aTags[i].getElementsByTagName("p");
        //obtengo el nombre del producto y lo guardo en una variable auxiliar
        txtValue = h4Tags[0].textContent || h4Tags[0].innerText;
        //obtengo la descripcion del producto y la guardo en una variable auxiliar
        txt2Value= pTags[0].txtContent || pTags[0].innerText;
        //checkeo si coinciden en alguna medida con indexOf
        if ((txtValue.toUpperCase().indexOf(inputUpp) > -1) ||
            (txt2Value.toUpperCase().indexOf(inputUpp) > -1) ) {
//en el caso de que haya algo de coincidencia por el nombre o descripcion se muestra el objeto
            aTags[i].style.display = "";
        } else {
            //en caso de que no se oculta.
            aTags[i].style.display = "none";
        }
    }
}