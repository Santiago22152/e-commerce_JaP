//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

const CART_URL = "https://japdevdep.github.io/ecommerce-api/cart/654.json";
let cart_products = [];
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(CART_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            cart_products= resultObj.data;
            updateCart();
            setSubTotal();
        }
    });
});
function setSubTotal(){
    let subtotal =0;
  let listTotals= document.getElementsByClassName("totalItem")
   for (let total of listTotals) {
    subtotal+=parseFloat(total.getAttribute("value"));
   }
      
   document.getElementById("FinalSubTotal").setAttribute("value",subtotal );
    document.getElementById("FinalSubTotal").innerHTML= "$" + subtotal;
setFinal()
}

function setFinal(){
    let subtotal = document.getElementById("FinalSubTotal").getAttribute("value")
    let envio = document.getElementById("Shipp").getAttribute("value");

    total = parseFloat(subtotal)+parseFloat(envio);
    document.getElementById("finalTotal").setAttribute("value",total);
    document.getElementById("finalTotal").innerHTML ="$"+total;
}

function updateCart(){
    let aux = 0;
    for (let product of cart_products.articles) {
        aux++;
        let unitCost = product.unitCost;
        if (product.currency=="USD") {
            unitCost = unitCost * 40;
        }
        let subtotal=product.count * parseFloat(unitCost);
        let price = product.currency+ " "+ product.unitCost;
        let htmlcontentToAppend= `<tr>
    <th scope="row">${aux}</th>
    <td><a onclick="clearProduct(${aux})" class="text-danger"><i class="ri-delete-bin-3-line"></i></a></td>
    <td><img src=${product.src} class="img-fluid" width="150" alt="product"></td>
    <td>${product.name}</td>
    <td>
        <div class="form-group mb-0">
            <input  type="number" class="form-control cart-qty" min="1" data-column="${product.currency}" name="${product.currency}" id="cartQty${aux}" value="${product.count}" onchange="updateItemSubTotal(${aux},this.value,${product.unitCost},this.name)">
        </div>
    </td>
    <td>${price}</td>
    <td id="cartSub${aux}" class="text-right totalItem" value="${subtotal}">${"$"+subtotal}</td>
</tr>`

document.getElementById("products").innerHTML+= htmlcontentToAppend;
    }
    
}

function clearProduct(id){
   cart_products.articles.splice((id-1),1);
    document.getElementById("products").innerHTML="";
    updateCart();
    setSubTotal();
}


function clearCart(){
    for (let index = 0; index <= cart_products.articles.length; index++) {
       clearProduct(index);
        
    }
    setSubTotal();
}

function updateItemSubTotal(id, qty, unitcost,cur){
    id="cartSub"+id;
   
    
    if (cur=="USD") {
        unitcost=unitcost*40;
    }
    let subtotal= parseInt(qty)*parseFloat(unitcost);

    document.getElementById((id)).setAttribute("value",subtotal );
    document.getElementById((id)).innerHTML = "$"+ subtotal;
    
   setSubTotal();

}

