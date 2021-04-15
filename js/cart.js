//templates
const templateCartItem = document.getElementById('template-cart-item').content;
const templateCartFooter = document.getElementById('template-cart-footer').content;
//containers
const cartItems = document.getElementById('cart-items');
const cartMainContainer = document.getElementById('cart-container');

const fragment = document.createDocumentFragment();

//items added from shop page
let itemsToBuy = localStorage.getItem('cart');

if (itemsToBuy === null) {
  //container showing that the cart is empty

  const divEmptyContainer = document.createElement('div');
  divEmptyContainer.classList.add('my-4', 'p-2', 'fs-5');
  divEmptyContainer.textContent = 'Your shopping cart is empty';

  const aCatalog = document.createElement('a');
  aCatalog.setAttribute('href', '../shop/shop.html');

  const aCatalogBtn = document.createElement('button');
  aCatalogBtn.classList.add('btn', 'btn-primary', 'ff-lato-7', 'fs-5', 'my-5', 'col-md-8', 'col-lg-4');
  aCatalogBtn.textContent = 'Check catalog';

  aCatalog.appendChild(aCatalogBtn);
  fragment.appendChild(divEmptyContainer);
  fragment.appendChild(aCatalog);

  cartItems.classList.add('text-center');
  cartItems.appendChild(fragment);
} else {
  try {
    itemsToBuy = JSON.parse(itemsToBuy);
    renderCartItems(itemsToBuy);
  } catch (error) {
    console.log(error);
  }
}


function renderCartItems(arrayItems) {
  Object.values(arrayItems).forEach(product => {
    //title
    templateCartItem.querySelector('div.fw-bold.mb-1').textContent = product.title;
    //quantity
    templateCartItem.querySelector('input[name="quantity"]').value = product.quantity;
    //increase/reduce quantity buttons
    templateCartItem.querySelector('input[name="reducequantity"]').dataset.id = product.id;
    templateCartItem.querySelector('input[name="increasequantity"]').dataset.id = product.id;
    //final price
    templateCartItem.querySelector('div.d-flex div.text-truncate').textContent = product.quantity * product.finalPrice;
    //image
    const productImage = templateCartItem.querySelector('img');
    const altAttribute = product.title.toLowerCase().replaceAll(" ", "-");
    productImage.setAttribute("src", product.thumnailUrl);
    productImage.setAttribute("alt", altAttribute);
    //shipping
    if (product.hasFreeShipping) {
      //shipping container creation
      const divShipping = document.createElement('div');
      divShipping.classList.add('text-green-5', 'mb-1');
      const iconShipping = document.createElement('i');
      iconShipping.classList.add('fas', 'fa-truck', 'me-1');
      const spanShipping = document.createElement('span');
      spanShipping.classList.add('fw-bold');
      spanShipping.textContent = 'Free shipping';
      divShipping.appendChild(iconShipping);
      divShipping.appendChild(spanShipping);

      templateCartItem.querySelector('.mx-2').appendChild(divShipping);
    }

    const clone = templateCartItem.cloneNode(true);
    fragment.appendChild(clone);

    //if the shipping container was added we remove it
    if (product.hasFreeShipping) {
      const shippingContainer = templateCartItem.querySelector('.mx-2');
      shippingContainer.removeChild(shippingContainer.lastChild);
    }
  });
  cartItems.appendChild(fragment);

  renderCartFooter(itemsToBuy);
}

function renderCartFooter(arrayItems) {
  //we add all the units
  const nQuantity = Object.values(arrayItems).reduce((acc, {quantity}) => acc + quantity, 0);
  //we add all the prices to calculate the total
  const nFinalPrice = Object.values(arrayItems).reduce((acc, {quantity, finalPrice}) => acc + quantity * finalPrice, 0);
  //top cart label in checkout
  cartMainContainer.querySelector('span').textContent = `(${nQuantity})`;

  //final calculation of the checkout (coupons, shipping, discounts, etc)
  templateCartFooter.querySelector('div.d-flex div.text-truncate').textContent = nFinalPrice;
  templateCartFooter.querySelectorAll('div.d-flex div.text-truncate')[3].textContent = nFinalPrice; //the last item

  const clone = templateCartFooter.cloneNode(true);
  fragment.appendChild(clone);

  //buy button at the end of checkout
  const divBuyBtn = document.createElement('div');
  divBuyBtn.classList.add('col-10', 'py-5', 'pe-0', 'text-center', 'text-sm-end');
  const buyBtn = document.createElement('button');
  buyBtn.classList.add('btn', 'btn-primary', 'ff-lato-7', 'fs-5');
  buyBtn.textContent = 'Proceed to checkout';

  divBuyBtn.appendChild(buyBtn);
  fragment.appendChild(divBuyBtn);

  //we add the cost calculator and the button to finish the purchase
  cartMainContainer.appendChild(fragment);
}









