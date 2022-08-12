const addbutton = document.querySelectorAll('.button-add');
addbutton.forEach(addtocart => {
    addtocart.addEventListener('click', addclicked);
});

const comprarButton = document.querySelector('.comprarButton');
comprarButton.addEventListener('click', comprarButtonClicked);

function addclicked(event) {
    const button = event.target;
    const productcon = button.closest('.product-con');
    
    const productTitle = productcon.querySelector('.product-title').textContent;
    const productPrice = productcon.querySelector('.product-price').textContent;
    const productImage = productcon.querySelector('.product-image').src;

    addProductToCart(productTitle, productPrice, productImage);
    addLocalStorage(button.id,productTitle, productPrice, productImage); // lo agregas al storage aca, le pasas los datos
}

const shoppingCartItemsContainer = document.querySelector(
    '.shoppingCartItemsContainer'
);

function addProductToCart(productTitle, productPrice, productImage)
{    
    const elementsTitle = shoppingCartItemsContainer.getElementsByClassName('shoppingCartItemTitle');
    for (let i = 0; i <elementsTitle.length; i++)
    {
        if (elementsTitle[i].innerText === productTitle)
        {
            let elementQuantity = elementsTitle[i].parentElement.parentElement.querySelector('.shoppingCartItemQuantity');
            if(elementQuantity)
            {
                elementQuantity.value++;
                $('.toast').toast('show');
                updateShoppingCartTotal();
                return
            }
        }
    }
    const cartRow = document.createElement('div');
    const cartContent = `
    <div class="row shoppingCartItem">
        <div class="col-6">
            <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
            <img src=${productImage} class="shopping-cart-image">
            <h6 class="shopping-cart-item-title shoppingCartItemTitle text-truncate ml-3 mb-0">${productTitle}</h6>
            </div>
        </div>
        <div class="col-2">
            <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                <p class="item-price mb-0 shoppingCartItemPrice">${productPrice}</p>
            </div>
        </div>
        <div class="col-4">
            <div
                class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
                <input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number"
                value="1">
            <button class="btn btn-danger buttonDelete" type="button">X</button>
            </div>
        </div>
    </div>`;
    cartRow.innerHTML = cartContent;
    shoppingCartItemsContainer.append(cartRow);

cartRow.querySelector('.buttonDelete').addEventListener('click', removeShoppingCartItem);
cartRow.querySelector('.shoppingCartItemQuantity').addEventListener('change', quantityChanged);

    updateShoppingCartTotal();
}

function updateShoppingCartTotal() {
    let total = 0;
    const shoppingCartTotal = document.querySelector('.shoppingCartTotal');

    const shoppingCartItems = document.querySelectorAll('.shoppingCartItem');

    shoppingCartItems.forEach((shoppingCartItem) => {
    const shoppingCartItemPriceElement = shoppingCartItem.querySelector(
        '.shoppingCartItemPrice'
    );
    const shoppingCartItemPrice = Number(
        shoppingCartItemPriceElement.textContent.replace('$', '')
    );
    const shoppingCartItemQuantityElement = shoppingCartItem.querySelector(
        '.shoppingCartItemQuantity'
    );
    const shoppingCartItemQuantity = Number(
        shoppingCartItemQuantityElement.value
    );
    total = total + shoppingCartItemPrice * shoppingCartItemQuantity;
    });
    shoppingCartTotal.innerHTML = `${total}$`;
} 
function removeShoppingCartItem(event) {
    const buttonClicked = event.target;
    buttonClicked.closest('.shoppingCartItem').remove();
    updateShoppingCartTotal();
} 

function quantityChanged(event) {
    const input = event.target;
    if (input.value <=0) {
        input.value =1;
    }
    updateShoppingCartTotal();
}

function comprarButtonClicked() {
    shoppingCartItemsContainer.innerHTML = '';
    updateShoppingCartTotal();
}

function addLocalStorage(id,productTitle,productPrice,productImage)
{   
    
    let cartStorage = JSON.parse(localStorage.getItem('shoppingCartItems')) || []; 
    let exists = cartStorage.find(element => element.id == id);
    if(!exists)
    {
        let product = {
            id: id,
            title: productTitle,
            price: productPrice,
            url: productImage,
            cantidad: 1
        }
        cartStorage.push(product);
        localStorage.setItem('shoppingCartItems', JSON.stringify(cartStorage));
    }
}

window.onload = function()
{
    const storage = JSON.parse(localStorage.getItem('shoppingCartItems'));
    if(storage)
    {
        for (const product of storage)
        {
            addProductToCart(product.title, product.price, product.url);
        }
    }
}



const getProducts = async () =>
{
    try
    {
        const response = await fetch("data.json");
        const data = await response.json();
        console.log("data from json: " , data);
    }
    catch(error)
    {
        console.log(error);
    }
}
getProducts();