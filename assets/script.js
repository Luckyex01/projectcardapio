const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const adressInput = document.getElementById("adress")
const adressWarn = document.getElementById("adress-warn")

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal()
    cartModal.style.display = "flex"
})

// Fechar o modal do carrinho
cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})


menu.addEventListener("click", function(event){

    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const pride = parseFloat(parentButton.getAttribute("data-pride"))
        //Adicionar no carrinho
        addToCart(name, pride)
        

    }

})


//Função para adicionar no carrinho
function addToCart(name, pride){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        existingItem.quantity += 1;

    }else{
        cart.push({
            name,
            pride,
            quantity: 1,
        })

    }
    
    updateCartModal()

}

//Atualiza o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0; 

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">${item.name}</p>
              <p>Qtd:  ${item.quantity}</p>
              <p class="font-medium mt-2">${item.pride.toFixed(2)}</p>
            </div>

              <button class="revome-from-cart-btn" data-name="${item.name}">
                Remover
              </button>
            
          </div>
        `

        total += item.pride * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

//Função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("revome-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name)
    }

})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }

}


adressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
    adressInput.classList.remove("border-red-500")
    adressWarn.classList.add("hidden")
    }
    
})

//Finalizar pedido
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        
        Toastfy({
            text: "FECHADO NO MOMENTO!",
            duration: 3000,
            close: true,
            gravity: "top", // top or bottom
            position: "right", // left, center or right
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
            background: "#ef4444",
            },
        }).showToast();

        return;
    }

    if(cart.length === 0) return;
    if(adressInput.value === ""){
        adressWarn.classList.remove("hidden")
        adressInput.classList.add("border-red-500")
        return;
    }

    //Enviar pedido para api whats
    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.pride} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "61996162979"

    window.open(https://wa.me/${phone}?text=${message} Endereço: ${adressInput.value}, "_blank")

    cart = []
    updateCartModal();

})


//Verificar a hora e manipular o card horario
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22; 
    // true = restaurante aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}