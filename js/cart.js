

const CART_URL = "https://japdevdep.github.io/ecommerce-api/cart/654.json";
let cart_products = [];
let shippPercent = 0.15;
let payMethodSelected = {
    type: 'debit',
     text: "Seleccione un método de pago"
};
let successMsg= "";

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    //Reseteo valores en los inputs de los metodos de pago
    document.getElementById("account-number").value = "";
    document.getElementById("card-name").value = "";
    document.getElementById("card-number").value = "";
    document.getElementById("due-date").value = "";
    document.getElementById("sec-code").value = "";
    //Obtengo los items del carrito y 
    getJSONData(CART_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            cart_products= resultObj.data;
            // Convierto los dolares a pesos e inserto en el html los productos del carrito
            updateCart();
            // Obtengo el valor de la suma del precio de cada item y llamo a la funcion setFinal 
            setSubTotal();
        }
    });
    
    
    //Seteo un escucha "change" a cada radio button del tipo de envio y modifico al valor correspondiente 
    document.getElementById("goldradio").addEventListener("change", function(){
        shippPercent = 0.15;
        setFinal();
    });
    
    document.getElementById("premiumradio").addEventListener("change", function(){
        shippPercent = 0.07;
        setFinal();
    });

    document.getElementById("standardradio").addEventListener("change", function(){
        shippPercent = 0.05;
        setFinal();
    });
  

});

//Sumo el valor de cada articulo y lo sumo.
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
//Seteo el valor costo de envio, subtotal y la suma de estos en el campo Final
function setFinal(){
    let subtotal = document.getElementById("FinalSubTotal").getAttribute("value")
    let envio = document.getElementById("Shipp");
    envio.value = Math.round(subtotal * shippPercent); 
    envio.innerHTML="$"+envio.value;
    total = parseFloat(subtotal)+parseFloat(envio.value);
    document.getElementById("finalTotal").setAttribute("value",total);
    document.getElementById("finalTotal").innerHTML ="$"+total;
}
//Muestro en HTML cada articulo con su costo en pesos
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
        let htmlcontentToAppend = `<tr>
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
    <td id="cartSub${aux}" class="text-right totalItem" value="${subtotal}">${"$" + subtotal}</td>
</tr>`

document.getElementById("products").innerHTML+= htmlcontentToAppend;
    }
    
}
//Dado un ID  elimino un producto del arreglo de productos y vuelvo a mostrar los articulos del arreglo.
function clearProduct(id){
   cart_products.articles.splice((id-1),1);
    document.getElementById("products").innerHTML="";
    updateCart();
    setSubTotal();
}

//Elimina todos los elementos del arreglo cart_products y vuelve a llamar setSubTotal.
function clearCart(){
    for (let index = 0; index <= cart_products.articles.length; index++) {
       clearProduct(index);
        
    }
    setSubTotal();
}
// calcula y muestra el costo total por item en pesos.
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
//Obtengo cada input de la tab de tarjeta de credito o debito  y deshabilito el input de cuenta  bancaria
//tambien seteo el tipo de pago en el objeto paymethodselected.
function validateVisaInputs(){
    document.getElementById("account-number").disabled = true;
    document.getElementById("account-number").value = "";
    
    if (document.getElementById("card-name").disabled == true ||
        document.getElementById("card-number").disabled == true ||
        document.getElementById("due-date").disabled == true ||
        document.getElementById("sec-code").disabled == true) {

        document.getElementById("card-name").disabled = false;
        document.getElementById("card-number").disabled = false;
        document.getElementById("due-date").disabled = false;
        document.getElementById("sec-code").disabled = false;
    }
    payMethodSelected.type = "debit"
    
}
//Analogo a validatevisaInputs pero con la tab de cuenta bancaria
function validateBankInputs(){
    document.getElementById("card-name").disabled = true;
    document.getElementById("card-name").value = "";
    document.getElementById("card-number").disabled = true;
    document.getElementById("card-number").value = "";
    document.getElementById("due-date").disabled = true;
    document.getElementById("due-date").value = "";
    document.getElementById("sec-code").disabled = true;
    document.getElementById("sec-code").value = "";

    if (document.getElementById("account-number").disabled == true) {
        document.getElementById("account-number").disabled = false;
    }
    payMethodSelected.type = "bankaccount"
    
}
//Valida que alguno de los dos metodos de pago esten completos y muestra error en caso de que no se haya completado ninguno.
//Tambien muestra los ultimos digitos de la tarjeta o cuenta que se selecciono
function putPayMethodAndSave(){
    if ((document.getElementById("card-name").value.length > 0 &&
    document.getElementById("card-number").value.length > 0 &&
    document.getElementById("due-date").value.length > 0 && 
    document.getElementById("sec-code").value.length > 0 ) || (document.getElementById("account-number").value.length > 0)){
        
        
        switch (payMethodSelected.type){
            case "bankaccount":
                let account_number= document.getElementById("account-number").value; 
                if (account_number.length <= 4){
                    payMethodSelected.text = "Cuenta terminada en "+account_number[account_number.length-1] +" seleccionada";
                }else{
                    payMethodSelected.text ="Cuenta bancaria terminada en "+account_number.slice(account_number.length-4,account_number.length) +" seleccionada";
                }
                
                break;
            case "debit":
                let card_number = document.getElementById("card-number").value;
                if (card_number.length <= 4){
                    payMethodSelected.text = "Tarjeta terminada en "+card_number[card_number.length-1] +" seleccionada";
                }else{
                    payMethodSelected.text = "Tarjeta terminada en "+card_number.slice(card_number.length-4,card_number.length) +" seleccionada";
                }
                break;
            default:
                payMethodSelected.text = "Seleccione un método de pago";
            }
            if (payMethodSelected.type != undefined){
                document.getElementById("payMethod").innerHTML = payMethodSelected.text;
            } 
            document.getElementById('savePayMthd').setAttribute('data-dismiss',"modal");

    }else {
        document.getElementById('savePayMthd').setAttribute('data-dismiss',"");
        payMethodSelected.text = "Seleccione un método de pago";
        document.getElementById('payMethod').innerHTML = payMethodSelected.text;
        
        Swal.fire({
            icon:'error',
            title:'Por favor complete los campos de pago!'
        }
        )

       
    }
    
    
}
//Valida que se cumpla con las 3 validaciones, que hayan elementos en el carrito, se hayan llenado los campos de datos de envio y que se haya escogido un metodo de envio
// y muestra una alerta en diferente en caso de faltar alguno de ellos.
//En caso de que todo se haya completado, se muestra una alerta con un mensaje obtenido del JSON CART_BUY_URL.
function validatePurchase(){
    let purchaseCost = document.getElementById("finalTotal").getAttribute('value');
    
    let inputsFilled = false;
    let contactName = document.getElementById('name').value;
    let contact_LastName = document.getElementById('last_name').value;
    let contact_address = document.getElementById('address').value;
    let contact_email = document.getElementById('email').value;
    let contact_number = document.getElementById('contact_number').value;
    let payMethodSelectedText = document.getElementById("payMethod").innerHTML;
  
    if(contactName.length > 0 
        && contact_LastName.length > 0
        && contact_address.length > 0
        && contact_email.length > 0
        && contact_number > 0){
            inputsFilled = true;
            
        }
    if(purchaseCost > 0 && inputsFilled && payMethodSelectedText != "Seleccione un método de pago" ){
        getJSONData(CART_BUY_URL).then(function(resultObj){
            if (resultObj.status === "ok"){
               successMsg= resultObj.data.msg;
               Swal.fire({
                icon:'success',
                title:successMsg
            }
            )
            }
        });
        
        
    }else if(purchaseCost == 0){
        Swal.fire({
            icon:'error',
            title:'Agregue productos a su carrito!'
        }
        )
      
    } else if(inputsFilled == false){
        Swal.fire({
            icon:'error',
            title:'Por favor llene los campos para continuar!'
        })
        
    }else if (payMethodSelectedText == "Seleccione un método de pago"){
        Swal.fire({
            icon:'error',
            title:'Seleccione un método de pago para continuar!'
        })
       
    }
}

